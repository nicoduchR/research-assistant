"use client";

import { useState } from "react";

export default function ProjectScopeSetup() {
  const [problematique, setProblematique] = useState("");
  const [objectives, setObjectives] = useState([
    "Identify key factors influencing AI adoption in traditional banking institutions.",
    "Evaluate the correlation between automated HR tools and employee satisfaction scores.",
  ]);
  const [newObjective, setNewObjective] = useState("");
  const [keywords, setKeywords] = useState(["Artificial Intelligence", "FinTech"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [methodology, setMethodology] = useState("quantitative");

  const addObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newKeyword.trim()) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 h-full flex flex-col bg-white dark:bg-slate-850 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">ResearchAI</h1>
              <p className="text-slate-500 text-xs font-normal mt-1">MBA Assistant</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20" href="#">
              <span className="material-symbols-outlined fill-1">folder_open</span>
              <p className="text-sm font-medium">Projects</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">search</span>
              <p className="text-sm font-medium">Literature Search</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">bar_chart</span>
              <p className="text-sm font-medium">Analysis</p>
            </a>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </a>
          <div className="flex items-center gap-3 px-3 py-4 mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 overflow-hidden"></div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Alex Morgan</p>
              <p className="text-xs text-slate-500">MBA Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Header */}
        <header className="w-full px-8 py-6 bg-background-light dark:bg-background-dark z-10 sticky top-0">
          <div className="max-w-[960px] mx-auto w-full">
            <div className="flex items-center text-sm mb-4">
              <a className="text-slate-500 hover:text-primary transition-colors font-medium" href="#">Home</a>
              <span className="text-slate-400 mx-2">/</span>
              <a className="text-slate-500 hover:text-primary transition-colors font-medium" href="#">New Project</a>
              <span className="text-slate-400 mx-2">/</span>
              <span className="text-slate-900 dark:text-white font-semibold">Scope Definition</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Define Your Research Scope</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">Let&apos;s set the boundaries for your literature review and synthesis engine.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Save Draft</button>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-primary">Step 1 of 4: Definition</span>
                <span className="text-slate-400">25% Completed</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/4 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-20">
          <div className="max-w-[960px] mx-auto w-full flex flex-col gap-6 pt-2">
            {/* Problématique Section */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 relative group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Research Problématique</h2>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-help hover:text-primary transition-colors" title="The central question or problem your research aims to address.">info</span>
                </div>
              </div>
              <div className="relative">
                <textarea
                  className="w-full min-h-[140px] p-4 text-base rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed transition-all"
                  placeholder="e.g., How does the adoption of AI-driven analytics in the fin-tech sector impact mid-level management decision-making processes regarding employee retention?"
                  value={problematique}
                  onChange={(e) => setProblematique(e.target.value)}
                />
                <div className="absolute bottom-3 right-3">
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-primary border border-primary/20 hover:border-primary/50 shadow-sm px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:shadow-md active:scale-95">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    AI Refine
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400 text-right">{problematique.split(" ").filter(w => w.length > 0).length} / 300 words</p>
            </div>

            {/* Objectives & Hypotheses */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Research Objectives</h2>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-help hover:text-primary transition-colors" title="Specific sub-goals or hypotheses to test.">info</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary ml-1"></div>
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{objective}</p>
                    <button
                      onClick={() => removeObjective(index)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
                {/* Add New Input */}
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Add a specific objective or hypothesis..."
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addObjective()}
                  />
                  <button
                    onClick={addObjective}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Scope Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Keywords */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Key Themes</label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded border border-primary/10">{keyword}</span>
                  ))}
                </div>
                <input
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Type & press Enter"
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={addKeyword}
                />
              </div>

              {/* Industry */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Target Industries</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                    <option>Financial Services</option>
                    <option>Healthcare</option>
                    <option>Technology</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Helps contextualize case studies.</p>
              </div>

              {/* Region */}
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Geographic Focus</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                    <option>Global</option>
                    <option>North America</option>
                    <option>Europe (EMEA)</option>
                    <option>Asia Pacific (APAC)</option>
                    <option>Latin America</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">public</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Filters regulatory environments.</p>
              </div>
            </div>

            {/* Methodology & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[20px]">science</span>
                  <h3 className="font-bold text-slate-900 dark:text-white">Methodology Context</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select your intended approach to help the AI highlight relevant methodological debates.</p>
                <div className="grid grid-cols-3 gap-3">
                  {["qualitative", "quantitative", "mixed"].map((method) => (
                    <label key={method} className="cursor-pointer relative">
                      <input
                        className="peer sr-only"
                        name="method"
                        type="radio"
                        value={method}
                        checked={methodology === method}
                        onChange={(e) => setMethodology(e.target.value)}
                      />
                      <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 transition-all text-center h-full">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 peer-checked:text-primary capitalize">{method}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[20px]">rule</span>
                  <h3 className="font-bold text-slate-900 dark:text-white">Academic Requirements</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Target Word Count</label>
                    <div className="relative">
                      <input className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" type="number" defaultValue="5000"/>
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">words</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Citation Style</label>
                    <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                      <option>APA 7th Ed.</option>
                      <option>Harvard</option>
                      <option>MLA</option>
                      <option>Chicago</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  <p>Citations will be automatically formatted and tracked for traceability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-slate-850/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-4 z-30">
          <div className="max-w-[960px] mx-auto flex justify-end items-center gap-4">
            <button className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2">
              <span>Generate Framework</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
