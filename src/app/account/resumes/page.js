"use client";

import ResumeLibrary from "@/components/resumes/ResumeLibrary";
import { TabHeading } from "@/components/account/AccountShell";

export default function AccountResumesPage() {
  return (
    <>
      <TabHeading>My Resumes</TabHeading>
      <div className="pt-6">
        <ResumeLibrary variant="panel" />
      </div>
    </>
  );
}
