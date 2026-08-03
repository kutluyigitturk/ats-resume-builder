import puppeteerCore from "puppeteer-core";

// Chrome lives in a different location on each OS, so resolve it at runtime
// instead of hardcoding a path. Override with CHROME_PATH in .env.local.
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
  // Get HTML content from the request body
  const { html } = await request.json();

  let browser = null;

  try {
    let launchOptions;

    if (process.env.NODE_ENV === "production") {
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

    // Launch browser
    browser = await puppeteerCore.launch(launchOptions);

    // Open a new page
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF with A4 size
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    });

    // Return PDF as response
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cv.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
    }
  }
}