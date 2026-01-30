"use client";

interface LibraryDocument {
  id: string;
  title: string;
  author: string;
  year: string;
  status: "synthesized" | "pending" | "error";
  themes: string[];
}

const documents: LibraryDocument[] = [
  { id: "1", title: "The Impact of AI on Supply Chains", author: "Johnson, K. & Lee, M.", year: "2023", status: "synthesized", themes: ["Supply Chain", "Artificial Intelligence"] },
  { id: "2", title: "Consumer Behavior Shifts in 2024", author: "Smith, A.", year: "2024", status: "pending", themes: ["Marketing", "Consumer Tech"] },
  { id: "3", title: "Global Financial Trends: Post-Pandemic Analysis", author: "Doe, J. & Brown, R.", year: "2022", status: "synthesized", themes: ["Finance", "Global Economy"] },
  { id: "4", title: "Organizational Change Management", author: "Brown, L.", year: "2021", status: "error", themes: ["Management"] },
  { id: "5", title: "Digital Transformation Strategies", author: "Wilson, K.", year: "2023", status: "synthesized", themes: ["Strategy", "Tech"] },
];

export default function ResearchLibrary() {
  const statusColors = {
    synthesized: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4 z-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">ResearchAI</h1>
              <span className="text-[11px] text-slate-500 font-medium">MBA Assistant</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Project</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Library</p>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium" href="#">
              <span className="material-symbols-outlined text-[20px] filled">library_books</span>
              <span className="text-sm">My Library</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              <span className="text-sm">Thesis 2026</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              <span className="text-sm">Marketing Mgmt</span>
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Smart Folders</p>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px] text-amber-500">spark</span>
              <span className="text-sm">Priority: High</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
              <span className="text-sm">Synthesized</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm">Settings</span>
          </a>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">Alex Chen</span>
              <span className="text-[10px] text-slate-500 truncate">MBA Student</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Library</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and synthesize your academic documents.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              <span>Add Documents</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
              <span>Export BibTeX</span>
            </button>
          </div>
        </header>

        <div className="px-6 py-4 flex flex-col gap-4 shrink-0 bg-background-light dark:bg-background-dark z-10">
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
            <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm placeholder:text-slate-400" placeholder="Search title, author, key themes or content..." type="text"/>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
              <span>Year Range</span>
              <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
              <span>Document Type</span>
              <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
              <span>Status: Synthesized</span>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary underline">Clear all</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="min-w-full inline-block align-middle">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[50px]" scope="col">
                      <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white" type="checkbox"/>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                      Document Title & Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[100px]" scope="col">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[140px]" scope="col">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                      Key Themes
                    </th>
                    <th className="relative px-6 py-3 w-[60px]" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {documents.map((doc, index) => (
                    <tr key={doc.id} className={`${index === 0 ? "bg-primary/5" : ""} hover:bg-${index === 0 ? "primary/10" : "slate-50"} dark:hover:bg-slate-800 transition-colors cursor-pointer group`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input checked={index === 0} className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white" type="checkbox" readOnly/>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{doc.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{doc.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {doc.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[doc.status]}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {doc.themes.map((theme, i) => (
                            <span key={i} className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">{theme}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">5</span> of <span className="font-medium text-slate-900 dark:text-white">24</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 shadow-sm">Previous</button>
                <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Drawer */}
      <aside className="w-[400px] shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-xl z-10 hidden xl:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
          <div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">Synthesized</span>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white leading-snug">The Impact of AI on Supply Chains</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Johnson, K. & Lee, M. (2023)</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-200 dark:shadow-blue-900/20">
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            Open in Workspace
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>AI Abstract</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              This paper investigates the transformative role of Artificial Intelligence in modern supply chain management. It highlights a <span className="font-semibold text-slate-900 dark:text-white bg-yellow-100 dark:bg-yellow-900/30 px-0.5 rounded">40% increase in predictive efficiency</span> when using ML models for demand forecasting. The authors argue that integration barriers are primarily cultural rather than technological.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">format_quote</span>
              <span>Key Quotes</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative pl-4 border-l-2 border-primary/40">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">&quot;The velocity of data processing in AI-driven logistical hubs outperforms traditional models by a factor of ten.&quot;</p>
                <span className="text-xs text-slate-400 mt-1 block font-medium">Page 14, Para 2</span>
              </div>
              <div className="relative pl-4 border-l-2 border-primary/40">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">&quot;While automation reduces manual error, the lack of skilled oversight remains a critical vulnerability.&quot;</p>
                <span className="text-xs text-slate-400 mt-1 block font-medium">Page 22, Conclusion</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">File Details</h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-slate-500">File Size</div>
              <div className="text-slate-900 dark:text-white text-right font-medium">2.4 MB</div>
              <div className="text-slate-500">Uploaded</div>
              <div className="text-slate-900 dark:text-white text-right font-medium">Oct 24, 2024</div>
              <div className="text-slate-500">Type</div>
              <div className="text-slate-900 dark:text-white text-right font-medium">PDF</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <button className="text-slate-500 hover:text-red-500 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Remove
          </button>
          <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Meta
          </button>
        </div>
      </aside>
    </div>
  );
}
