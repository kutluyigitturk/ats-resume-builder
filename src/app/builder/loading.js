// The builder waits on a session lookup before any of it renders. Without this
// the visitor gets a blank screen for that round trip, which reads as a hang.
export default function BuilderLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-200">
      <div className="h-screen w-[38%] border-r border-slate-200 bg-gray-100 p-3">
        <div className="h-[52px] animate-pulse rounded-[18px] bg-white/90" />
        <div className="mt-2.5 space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[54px] animate-pulse rounded-xl bg-white/70" />
          ))}
        </div>
      </div>

      <div className="h-screen flex-1 bg-gray-100 px-8">
        <div className="mx-auto h-[58px] max-w-[240mm] animate-pulse rounded-b-lg bg-white" />
        <div className="mt-[40px] flex justify-center">
          <div className="h-[297mm] w-[210mm] animate-pulse rounded-sm bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
