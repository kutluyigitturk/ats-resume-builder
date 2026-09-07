"use client";

import { TabHeading, MUTED_FG } from "@/components/account/AccountShell";

// The tab exists so the navigation is complete; the feature is not built. An
// empty column with a heading over it would read as something that failed to
// load, so it says which of the two it is.
export default function AccountCoverLettersPage() {
  return (
    <>
      <TabHeading>My Cover Letters</TabHeading>
      <p className="pt-6 text-[16px] leading-6" style={{ color: MUTED_FG }}>
        Cover letters are not built yet. When they are, they will live here beside your resumes.
      </p>
    </>
  );
}
