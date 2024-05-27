export default function Footer() {
  return (
    // <footer className="bot-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-background px-6 py-3 shadow-md ">
    <footer className="grid-rows grid w-full place-content-center justify-items-center gap-6 bg-background lg:grid-cols-3">
      <div className="flex flex-col p-2">
        <p className="p-2 text-sm text-slate-400">
          Steam Deals is a hobby project and is not affiliated with Valve or
          Steam.
        </p>
        <p className="p-2 text-sm text-slate-400">
          Steam and the Steam logo are trademarks of Valve Corporation. All
          other trademarks are property of their respective owners.
        </p>
      </div>
      {/* <div className="flex flex-wrap place-content-center gap-8 p-2 text-center sm:flex-col sm:gap-4 sm:underline"></div>
      <div className="flex flex-wrap items-center gap-5 p-2 sm:gap-2"></div> */}
    </footer>
  );
}
