"use client";

import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import UserMenu from "@/components/UserMenu";
import ResumeLibrary from "@/components/resumes/ResumeLibrary";

const BG_COLOR = "#fafafa";

// The page is now just the chrome. Everything that lists, creates, renames,
// duplicates, deletes and restores a resume lives in ResumeLibrary, because
// /account renders the same library in its own shell - and two copies of that
// behaviour would drift apart the first time either changed.
export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: BG_COLOR }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-50/40 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-50/30 blur-[120px]" />
      </div>

      <Navbar maxWidth="1280px" baseRingClass="ring-slate-200/50" justify="justify-between">
        <Logo />
        <UserMenu />
      </Navbar>

      <main className="relative z-10 mx-auto max-w-[1280px] px-6 pt-28 pb-16">
        <ResumeLibrary variant="page" />
      </main>
    </div>
  );
}
