"use client";

import { useState } from "react";

interface Gap {
  id: string;
  number: string;
  title: string;
  description: string;
  priority: "high" | "medium";
  active?: boolean;
}

const gaps: Gap[] = [
  { id: "1", number: "#Gap-01", title: "Lack of longitudinal studies in SMEs", description: "Current literature mostly focuses on short-term quarterly results, neglecting 5+ year trends.", priority: "high", active: true },
  { id: "2", number: "#Gap-02", title: "Geographic bias in European data", description: "Existing datasets heavily favor Western European demographics, leaving Eastern markets underrepresented.", priority: "medium" },
  { id: "3", number: "#Gap-03", title: "Oversimplification of remote work impact", description: "Nuance regarding hybrid models is missing in 2020-2022 studies.", priority: "high" },
  { id: "4", number: "#Gap-04", title: "Digital transformation failure rates", description: "No consensus on failure definitions in manufacturing sector.", priority: "medium" },
];

export default function ResearchGaps() {
  const [selectedGap] = useState(gaps[0]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main antialiased h-screen flex flex-col overflow-hidden">
      <header className="flex-none bg-white dark:bg-slate-900 border-b border-border-color dark:border-slate-800 z-20">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">science</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Research Assistant AI</h2>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <a className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">Dashboard</a>
              <a className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">Literature Review</a>
              <a className="px-3 py-2 text-primary bg-primary/5 dark:bg-primary/20 dark:text-primary-300 text-sm font-medium rounded-md" href="#">Gaps Analysis</a>
              <a className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">Methodology</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20" placeholder="Search references..." type="text"/>
            </div>
            <button className="size-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
              <div className="w-full h-full object-cover rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden w-full max-w-[1600px] mx-auto">
        <aside className="w-full md:w-[400px] flex-none flex flex-col border-r border-border-color dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="p-6 pb-2 border-b border-border-color dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Research Gaps</h1>
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">12 Found</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px]">sort</span> Priority
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px]">filter_list</span> Relevance
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px]">category</span> Category
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className={`group relative rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  gap.active
                    ? "bg-white dark:bg-slate-800 border-2 border-primary"
                    : "bg-white dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    gap.priority === "high"
                      ? "bg-accent-amber-light text-accent-amber-700 border border-accent-amber/20"
                      : "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  }`}>
                    {gap.priority === "high" ? "High" : "Medium"} Priority
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{gap.number}</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-2 leading-snug">{gap.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{gap.description}</p>
                {gap.active && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-100 text-primary">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-black overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-semibold bg-accent-amber text-white shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">priority_high</span> High Priority
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Identified from 24 sources</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {selectedGap.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  The current academic landscape is saturated with cross-sectional data. There is a <span className="bg-accent-amber/10 text-amber-700 dark:text-amber-400 px-1 rounded font-medium border-b border-accent-amber/30">critical absence</span> of studies tracking SME performance over periods longer than 3 years, specifically regarding post-digital adoption growth.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex gap-5">
                  <div className="flex-none pt-1">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined filled">lightbulb</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Why this matters for your Problématique</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your thesis aims to explore &quot;5-year sustainable growth strategies&quot;. Current literature (Smith et al., 2021; Doe, 2022) does not support long-term projections without extrapolating short-term data. Addressing this gap creates a strong justification for your primary research component.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">compare_arrows</span>
                    Opposing Viewpoints Found
                  </h3>
                  <ul className="space-y-4 flex-1">
                    <li className="flex gap-3 text-sm">
                      <div className="flex-none mt-1 size-1.5 rounded-full bg-slate-400"></div>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-900 dark:text-slate-200">Short-term is sufficient:</span> Some scholars argue that in the volatile digital age, 5-year plans are obsolete (Johnson, 2023).
                        <a className="text-primary hover:underline text-xs ml-1" href="#">[Ref]</a>
                      </p>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <div className="flex-none mt-1 size-1.5 rounded-full bg-slate-400"></div>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-900 dark:text-slate-200">Data availability issues:</span> SMEs rarely maintain consistent data records suitable for academic longitudinal study (Perez, 2021).
                        <a className="text-primary hover:underline text-xs ml-1" href="#">[Ref]</a>
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-slate-700 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">assistant</span>
                    AI Suggested Action
                  </h3>
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      To bridge this gap effectively, consider conducting qualitative interviews to reconstruct historical performance data.
                    </p>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Recommended Method</p>
                      <p className="text-sm font-semibold text-primary">Primary Semi-structured Interviews</p>
                      <p className="text-xs text-slate-500 mt-1">Target: SME Founders operating &gt;10 years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-none p-6 bg-white dark:bg-slate-900 border-t border-border-color dark:border-slate-800 z-20">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>This gap was last updated on Oct 24, 2023</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  Search EBSCO
                </button>
                <button className="flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 flex">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                  Add to Methodology
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
