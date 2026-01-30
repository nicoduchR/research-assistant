"use client";

const themes = [
  {
    id: 1,
    title: "Digital Transformation in SMEs",
    badge: "Dominant Theme",
    badgeColor: "bg-blue-100 text-blue-700",
    relevance: "98%",
    consensus: "High initial cost is unanimously cited as the primary barrier to entry for manufacturing SMEs across all regions.",
    conflict: "Role of employee resistance: Cultural (Europe) vs. Technical Capability (Asia).",
    citations: 12,
  },
  {
    id: 2,
    title: "Barriers to AI Adoption",
    badge: "Emerging Theme",
    badgeColor: "bg-purple-100 text-purple-700",
    relevance: "85%",
    consensus: "Data privacy concerns are universal regardless of firm size.",
    conflict: "Impact of regulatory frameworks: Driver of innovation vs. Stifling bureaucracy.",
    citations: 8,
  },
  {
    id: 3,
    title: "Resource-Based View (RBV)",
    badge: "Theoretical",
    badgeColor: "bg-indigo-100 text-indigo-700",
    relevance: "72%",
    consensus: "Digital capabilities must be viewed as strategic resources that confer competitive advantage.",
    conflict: null,
    citations: 15,
  },
];

export default function LiteratureSynthesis() {
  return (
    <div className="bg-white text-slate-900 font-display min-h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-sidebar-bg px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">LitSynth<span className="text-primary">.ai</span></h2>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">MBA Thesis: Digital Transformation</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <a className="text-slate-600 text-sm font-medium hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="text-slate-900 text-sm font-bold border-b-2 border-primary pb-0.5" href="#">Synthesis</a>
            <a className="text-slate-600 text-sm font-medium hover:text-primary transition-colors" href="#">Library</a>
            <a className="text-slate-600 text-sm font-medium hover:text-primary transition-colors" href="#">Traceability</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex w-64 items-center rounded-lg bg-white border border-slate-200 px-3 h-9 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input className="w-full bg-transparent border-none text-sm px-2 text-slate-900 placeholder:text-slate-400 focus:ring-0" placeholder="Search citations or themes..."/>
          </div>
          <button className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="size-9 rounded-full bg-cover bg-center border border-slate-200 shadow-sm bg-gradient-to-br from-blue-400 to-indigo-500"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-white">
          <div className="w-full px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-blue-50/80 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">Papers Analyzed</p>
                  <span className="material-symbols-outlined text-primary text-2xl">library_books</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold mt-2">15</p>
                <p className="text-xs text-slate-500 mt-1">+3 added this week</p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-blue-50/80 border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">Core Themes</p>
                  <span className="material-symbols-outlined text-primary text-2xl">category</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold mt-2 relative z-10">4</p>
                <p className="text-xs text-slate-500 mt-1 relative z-10">Consolidated from 21 tags</p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-blue-50/80 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">Key Arguments</p>
                  <span className="material-symbols-outlined text-primary text-2xl">forum</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold mt-2">82</p>
                <p className="text-xs text-slate-500 mt-1">9 conflicts detected</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Thematic Analysis
              </h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">sort</span> Sort
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {themes.map((theme) => (
                <div key={theme.id} className="flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${theme.badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>{theme.badge}</span>
                        <span className="text-xs text-slate-400">Relevance: {theme.relevance}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{theme.title}</h3>
                    </div>
                    <button className="text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> CONSENSUS
                      </p>
                      <p className="text-sm text-slate-800 leading-relaxed">{theme.consensus}</p>
                    </div>
                    {theme.conflict && (
                      <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                        <p className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">warning</span> CONFLICT
                        </p>
                        <p className="text-sm text-slate-800 leading-relaxed">{theme.conflict}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Key Authors:</span>
                      <div className="flex -space-x-2">
                        {[...Array(Math.max(1, Math.min(Math.floor(theme.citations / 4), 4)))].map((_, i) => (
                          <div key={i} className={`size-6 rounded-full bg-slate-${(i + 3) * 100} ring-2 ring-white`}></div>
                        ))}
                      </div>
                    </div>
                    <button className="text-primary text-sm font-medium hover:underline">View {theme.citations} Citations</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[100px] text-amber-500">lightbulb</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-600">search_off</span>
                Research Gaps Identified
              </h3>
              <p className="text-slate-800 text-sm max-w-3xl mb-4">
                Based on the current selection of 15 papers, there is significantly thin evidence regarding <strong className="text-amber-800">Post-implementation ROI in Emerging Markets</strong>. Most studies focus on North American or Western European contexts.
              </p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-900 text-sm font-medium hover:bg-amber-200 transition-colors border border-amber-200">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span> Find Papers for this Gap
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-amber-300 text-amber-900 text-sm font-medium hover:bg-amber-100 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
            <div className="h-10"></div>
          </div>
        </main>

        <aside className="w-80 bg-sidebar-bg border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-sm lg:shadow-none">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Review Outline</h3>
            <span className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded">Draft v1</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Structure</p>
            <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-all">
              <span className="text-slate-400 mt-0.5 material-symbols-outlined text-[16px]">drag_indicator</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">I. Introduction</p>
                <p className="text-xs text-slate-500 mt-1">Scope, Research Question, Methodology</p>
              </div>
            </div>
            <div className="group flex items-start gap-3 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer transition-colors shadow-sm">
              <span className="text-slate-400 mt-0.5 material-symbols-outlined text-[16px]">drag_indicator</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">II. Theoretical Framework</p>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                    Resource-Based View
                    <span className="material-symbols-outlined text-[14px] text-slate-400 hover:text-red-500">close</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-all">
              <span className="text-slate-400 mt-0.5 material-symbols-outlined text-[16px]">drag_indicator</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">III. Barriers to Adoption</p>
                <p className="text-xs text-slate-500 mt-1 italic">Drag themes here to populate</p>
              </div>
            </div>
            <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-all">
              <span className="text-slate-400 mt-0.5 material-symbols-outlined text-[16px]">drag_indicator</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">IV. Conclusion & Gaps</p>
                <p className="text-xs text-slate-500 mt-1">Future research directions</p>
              </div>
            </div>
            <div className="border-t border-dashed border-slate-300 my-4"></div>
            <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-slate-400 text-sm hover:border-primary hover:text-primary hover:bg-blue-50 cursor-pointer transition-colors">
              + Add Section
            </div>
          </div>
          <div className="p-5 border-t border-slate-200 bg-sidebar-bg">
            <button className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
              <span className="material-symbols-outlined text-[20px]">description</span>
              Export to Draft
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
