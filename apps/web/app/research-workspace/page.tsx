"use client";

export default function ResearchWorkspace() {
  return (
    <div className="bg-white font-display text-slate-900 overflow-hidden h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 relative">
        <div className="flex items-center gap-4">
          <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">science</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Research Assistant AI</h1>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <span className="text-sm text-slate-500 font-medium">MBA Thesis Project</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a className="hover:text-primary transition-colors" href="#">Projects</a>
            <a className="hover:text-primary transition-colors" href="#">Library</a>
            <a className="hover:text-primary transition-colors" href="#">Settings</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="size-9 rounded-full bg-cover bg-center border border-slate-200 shadow-sm bg-gradient-to-br from-blue-400 to-indigo-500"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="w-72 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col z-10">
          <div className="p-4 border-b border-slate-200">
            <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all group">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Project</span>
                <span className="text-sm font-semibold truncate w-full text-left text-slate-800">Supply Chain Resilience</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600">unfold_more</span>
            </button>
          </div>

          <div className="p-3 flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Overview</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium" href="#">
              <span className="material-symbols-outlined text-[20px] fill-1">edit_document</span>
              <span className="text-sm">Drafting</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              <span className="text-sm font-medium">Sources</span>
            </a>
          </div>

          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sources</span>
            <button className="text-primary hover:text-blue-600 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">add</span> Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            <div className="group flex items-center gap-3 p-2 rounded-lg bg-white border border-primary/20 shadow-sm cursor-pointer transition-all">
              <div className="shrink-0 size-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-rose-500">
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Smith_2019_KM.pdf</p>
                <p className="text-xs text-slate-500 truncate">Cited 4 times</p>
              </div>
              <div className="size-2 rounded-full bg-green-500 shrink-0"></div>
            </div>

            <div className="group flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all opacity-75 hover:opacity-100">
              <div className="shrink-0 size-8 rounded bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">Johnson_2021_Align.pdf</p>
                <p className="text-xs text-slate-500 truncate">Processed</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all opacity-75 hover:opacity-100">
              <div className="shrink-0 size-8 rounded bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">Chen_2023_Supply.pdf</p>
                <p className="text-xs text-slate-500 truncate">Processing...</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative">
          {/* Progress Tabs */}
          <div className="w-full bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-center shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Problem Definition</span>
              <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
              <span className="text-primary font-bold px-2 py-1 rounded bg-primary/10">Literature Review (Active)</span>
              <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
              <span className="text-slate-400">Methodology</span>
              <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
              <span className="text-slate-400">Results</span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="w-full bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-4 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[20px]">format_h1</span>
              </button>
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[20px]">format_h2</span>
              </button>
            </div>
            <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[20px]">format_bold</span>
              </button>
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[20px]">format_italic</span>
              </button>
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-100">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Rephrase Selection
              </button>
            </div>
            <div className="flex-1"></div>
            <span className="text-xs text-slate-400">Saving...</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-6 text-slate-800 leading-relaxed">
              <div>
                <h1 className="text-3xl font-bold mb-6 text-slate-900">Literature Review: Supply Chain Resilience</h1>
                <h2 className="text-xl font-bold mb-4 mt-8 text-slate-900">Theme 1: Knowledge Management Integration</h2>
                <p className="mb-4 text-slate-800">
                  The integration of Knowledge Management (KM) systems within supply chain operations has been identified as a critical factor for enhancing organizational resilience. Recent studies suggest that effective KM practices allow firms to anticipate disruptions by leveraging historical data and real-time market signals.{" "}
                  <span className="inline-flex items-center gap-1 align-baseline bg-primary/10 hover:bg-primary/20 text-primary px-1.5 py-0.5 rounded cursor-pointer transition-colors select-none ring-1 ring-primary/20" title="Click to verify source">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span className="text-sm font-medium">Smith, 2019, p.45</span>
                  </span>{" "}
                  However, the implementation of these systems often faces resistance due to siloed organizational structures.
                </p>
                <p className="mb-4 text-slate-800">
                  Furthermore, strategic alignment between IT capabilities and business goals is paramount. Without this alignment, investments in digital tools often fail to yield the expected resilience benefits.{" "}
                  <span className="inline-flex items-center gap-1 align-baseline bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors select-none ring-1 ring-slate-200">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span className="text-sm font-medium">Johnson, 2021, p.12</span>
                  </span>{" "}
                  This disconnect highlights the need for a holistic approach to digital transformation in supply chain management.
                </p>
                <h2 className="text-xl font-bold mb-4 mt-8 text-slate-900">Theme 2: Risk Mitigation Strategies</h2>
                <p className="mb-4 text-slate-800">
                  Traditional risk mitigation strategies have focused on redundancy, such as safety stock and multi-sourcing. While effective for localized disruptions, these methods prove costly and inefficient for global, systemic shocks.{" "}
                  <span className="inline-flex items-center gap-1 align-baseline bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors select-none ring-1 ring-slate-200">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span className="text-sm font-medium">Chen et al., 2023</span>
                  </span>{" "}
                  Modern frameworks advocate for agility and visibility as superior alternatives to mere redundancy.
                </p>
              </div>

              <div className="mt-12 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined">stars</span>
                  <span className="text-sm font-medium">Suggested Next Steps</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm hover:border-primary hover:text-primary transition-all shadow-sm">
                    Expand on &quot;Agility vs Redundancy&quot;
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm hover:border-primary hover:text-primary transition-all shadow-sm">
                    Synthesize findings from Chen_2023
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Input Bar */}
          <div className="absolute bottom-6 left-0 right-0 px-8 lg:px-12 flex justify-center pointer-events-none">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex items-center gap-2 pointer-events-auto ring-1 ring-black/5">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">colors_spark</span>
              </div>
              <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-900 placeholder-slate-400" placeholder="Ask Research AI to write, cite, or edit..." type="text"/>
              <button className="p-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </main>

        {/* PDF Viewer Panel */}
        <aside className="w-[480px] shrink-0 border-l border-slate-200 bg-slate-50 flex flex-col relative shadow-xl z-10 hidden xl:flex">
          <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="material-symbols-outlined text-rose-500">picture_as_pdf</span>
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]" title="Smith_2019_Knowledge_Mgmt.pdf">Smith_2019_Knowledge_Mgmt.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded px-2 py-1 gap-2 border border-slate-200">
                <button className="text-slate-500 hover:text-slate-900"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                <span className="text-xs font-mono text-slate-600">45 / 128</span>
                <button className="text-slate-500 hover:text-slate-900"><span className="material-symbols-outlined text-[16px]">add</span></button>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-[20px]">zoom_in</span></button>
              <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-[20px]">zoom_out</span></button>
              <div className="w-px h-4 bg-slate-300"></div>
              <button className="text-primary bg-primary/10 rounded px-2 py-0.5 text-xs font-medium">Highlight Mode</button>
            </div>
            <button className="text-slate-500 hover:text-primary flex items-center gap-1 text-xs font-medium">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              Open Original
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-gray-200/80">
            <div className="w-full bg-white text-black shadow-xl min-h-[800px] p-8 text-[11px] leading-relaxed font-serif relative">
              <div className="flex justify-between border-b border-gray-300 pb-2 mb-6">
                <span className="text-gray-500">Journal of Supply Chain Management</span>
                <span className="text-gray-500">Vol. 45, Issue 2</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-black">4.2 Knowledge Integration in Crisis</h3>
              <div className="columns-2 gap-6 text-justify text-gray-800">
                <p className="mb-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mb-3">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="relative mb-3">
                  <div className="absolute -inset-1 bg-yellow-200/50 rounded mix-blend-multiply pointer-events-none border-b-2 border-primary"></div>
                  <p className="relative z-10 font-semibold bg-primary/10 rounded px-1 -mx-1 text-black">
                    The integration of Knowledge Management (KM) systems within supply chain operations has been identified as a critical factor for enhancing organizational resilience. Recent studies suggest that effective KM practices allow firms to anticipate disruptions.
                  </p>
                  <div className="absolute -right-16 top-0 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm font-sans font-bold whitespace-nowrap z-20">
                    Cited
                  </div>
                </div>
                <p className="mb-3">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p className="mb-3">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-center text-gray-400 border-t border-gray-200 pt-2">
                Page 45
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
