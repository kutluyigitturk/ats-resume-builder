import puppeteerCore from "puppeteer-core";
import { getCurrentUser } from "@/lib/session";
import { hitRateLimit, tooManyAttempts } from "@/lib/rateLimit";
import { withEmbeddedFonts } from "@/lib/pdfFonts";

// Chrome cold-starts slowly on a serverless host; the platform default is far
// too short for it.
export const maxDuration = 60;

// Launching a browser is the most expensive thing this app does, so the body
// is capped well above any real resume but far below what would hurt us.
const MAX_HTML_BYTES = 2 * 1024 * 1024;

// Every export costs a browser launch, so one account cannot be allowed to
// start them in a loop. Generous for a person, useless for a script.
const PER_USER = { limit: 30, windowMs: 60 * 60 * 1000 };

// Even with a session and no egress, a page that never settles holds the
// function open until the platform kills it.
const PAGE_TIMEOUT_MS = 15_000;

// Chrome lives in a different location on each OS, so resolve it at runtime
// instead of hardcoding a path. Override with CHROME_PATH in .env.
function getLocalChromePath() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  switch (process.platform) {
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "win32":
      return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    default:
      return "/usr/bin/google-chrome";
  }
}

export async function POST(request) {
  // This endpoint renders attacker-supplied HTML in a real browser on our
  // server. Without a session check anyone could spend our CPU, and could
  // point the page at internal addresses only this server can reach.
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Log in to export a PDF." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const html = typeof body.html === "string" ? body.html : "";

  if (!html) {
    return Response.json({ error: "Nothing to export." }, { status: 400 });
  }

  if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
    return Response.json({ error: "This resume is too large to export." }, { status: 413 });
  }

  const limit = await hitRateLimit("pdf:user", user.id, PER_USER);
  if (!limit.allowed) return tooManyAttempts(limit.retryAfterSeconds);

  let browser = null;

  try {
    let launchOptions;

    // Keyed on the host, not the build mode: NODE_ENV is "production" under a
    // local `next build && next start` too, which sent local runs down the
    // Lambda path and made this branch impossible to exercise before deploying.
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      // Production (Vercel) - use serverless Chromium
      const chromium = await import("@sparticuz/chromium");
      launchOptions = {
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
      };
    } else {
      // Local development - use installed Chrome
      launchOptions = {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: getLocalChromePath(),
        headless: true,
      };
    }

    browser = await puppeteerCore.launch(launchOptions);

    const page = await browser.newPage();

    // The templates are static markup - no script runs in them - so turning
    // JavaScript off changes nothing about the output and removes the ability
    // to run code inside a browser launched with --no-sandbox.
    await page.setJavaScriptEnabled(false);
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);
    page.setDefaultNavigationTimeout(PAGE_TIMEOUT_MS);

    // The resume HTML is fully self-contained: inline SVG icons and system
    // fonts, no stylesheet or image fetched from anywhere. So every outgoing
    // request is something we did not put there, and refusing them all closes
    // the door on both server-side request forgery and slow-loading payloads.
    await page.setRequestInterception(true);
    page.on("request", (interceptedRequest) => {
      const url = interceptedRequest.url();

      if (url.startsWith("data:") || url === "about:blank") {
        interceptedRequest.continue();
        return;
      }

      interceptedRequest.abort();
    });

    // The fonts are added here rather than in the builder because they live on
    // disk on the server, and because sending a few hundred KB of base64 up
    // from the browser on every export would be absurd.
    await page.setContent(withEmbeddedFonts(html, body.fonts), {
      waitUntil: "domcontentloaded",
    });

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cv.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return Response.json({ error: "Could not build the PDF. Try again." }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
