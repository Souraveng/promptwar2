export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans text-xs leading-relaxed border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-[1200px] mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_vote</span>
            Bharat Nirvachan
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs">© 2024 Election Information Portal. An official civic resource for the democratic process.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-slate-500 dark:text-slate-400">
          <a className="hover:text-red-700 dark:hover:text-red-400 underline transition-all" href="#">Privacy Policy</a>
          <a className="hover:text-red-700 dark:hover:text-red-400 underline transition-all" href="#">Terms of Service</a>
          <a className="hover:text-red-700 dark:hover:text-red-400 underline transition-all" href="#">Accessibility</a>
          <a className="hover:text-red-700 dark:hover:text-red-400 underline transition-all" href="#">Contact Us</a>
          <a className="col-span-2 hover:text-red-700 dark:hover:text-red-400 underline transition-all" href="#">National Voter Service Portal</a>
        </div>
      </div>
    </footer>
  );
}
