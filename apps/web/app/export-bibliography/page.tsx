"use client";

import { useState } from "react";

export default function ExportBibliography() {
  const [citationStyle, setCitationStyle] = useState("apa7");
  const [fileFormat, setFileFormat] = useState("docx");
  const [includeAISummaries, setIncludeAISummaries] = useState(false);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 md:p-8 font-display antialiased text-slate-900 dark:text-white transition-colors duration-200">
      <div className="w-full max-w-6xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800 h-[85vh] lg:h-auto lg:min-h-[600px]">
        {/* Left Panel: Configuration */}
        <div className="flex-1 flex flex-col p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">ios_share</span>
              Export Bibliography
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Configure formatting and details for your research citations.</p>
          </div>

          <form className="flex flex-col flex-1 gap-8" onSubmit={(e) => e.preventDefault()}>
            {/* Style Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Citation Style</label>
              <div className="relative group">
                <select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-shadow"
                >
                  <option value="apa7">APA 7th Edition</option>
                  <option value="harvard">Harvard</option>
                  <option value="chicago">Chicago Manual of Style (17th Ed.)</option>
                  <option value="mla9">MLA 9th Edition</option>
                  <option value="vancouver">Vancouver</option>
                  <option value="ieee">IEEE</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* File Format Options */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">File Format</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg w-full">
                {[
                  { value: "docx", icon: "description", label: ".docx" },
                  { value: "bib", icon: "code", label: ".bib" },
                  { value: "txt", icon: "text_snippet", label: ".txt" },
                ].map((format) => (
                  <label key={format.value} className="flex-1 relative cursor-pointer group">
                    <input
                      className="peer sr-only"
                      name="format"
                      type="radio"
                      value={format.value}
                      checked={fileFormat === format.value}
                      onChange={(e) => setFileFormat(e.target.value)}
                    />
                    <div className="h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 text-slate-500 dark:text-slate-400 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 peer-checked:hover:bg-primary-hover">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">{format.icon}</span>
                        {format.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Inclusion Settings */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Inclusion Settings</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800 transition-colors"
                      type="checkbox"
                      checked={includeAISummaries}
                      onChange={(e) => setIncludeAISummaries(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Include AI-generated summaries</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">Appends a brief analysis paragraph after each citation.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800 transition-colors"
                      type="checkbox"
                      checked={includePageNumbers}
                      onChange={(e) => setIncludePageNumbers(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Include exact page numbers</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">Adds pagination details for direct quotes.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800 transition-colors"
                      type="checkbox"
                      checked={includeLinks}
                      onChange={(e) => setIncludeLinks(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Include links to source PDFs</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">Direct hyperlinks to stored documents.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex-1"></div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 h-12 px-6 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                type="button"
              >
                <span className="material-symbols-outlined">download</span>
                Download Bibliography
              </button>
              <button
                className="sm:flex-none h-12 px-6 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined">content_copy</span>
                Copy to Clipboard
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:w-[55%] bg-slate-50 dark:bg-[#0B1116] flex flex-col p-6 md:p-10 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Real-time Preview</h2>
            <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
              {citationStyle === "apa7" ? "APA 7th Ed." : citationStyle.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-8 md:p-12 overflow-hidden flex flex-col relative group">
            <div className="w-full h-2 mb-8 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-full"></div>

            <div className="preview-scroll flex-1 overflow-y-auto pr-4 -mr-4 font-serif text-[15px] leading-7 text-slate-800 dark:text-slate-300">
              <p className="text-center font-bold mb-8 text-lg">References</p>

              <div className="bib-entry mb-6 pl-8 -indent-8">
                Nonaka, I. (1994). A dynamic theory of organizational knowledge creation.{" "}
                <i>Organization Science</i>, 5(1), 14–37. https://doi.org/10.1287/orsc.5.1.14
              </div>

              <div className="bib-entry mb-6 pl-8 -indent-8">
                Porter, M. E. (2008). The five competitive forces that shape strategy.{" "}
                <i>Harvard Business Review</i>, 86(1), 78–93.
              </div>

              <div className="bib-entry mb-6 pl-8 -indent-8">
                Christensen, C. M., Raynor, M. E., & McDonald, R. (2015). What is disruptive innovation?{" "}
                <i>Harvard Business Review</i>, 93(12), 44–53.
              </div>

              <div className="bib-entry mb-6 pl-8 -indent-8">
                Eisenhardt, K. M. (1989). Building theories from case study research.{" "}
                <i>The Academy of Management Review</i>, 14(4), 532–550. https://doi.org/10.2307/258557
              </div>

              <div className="bib-entry mb-6 pl-8 -indent-8">
                Barney, J. (1991). Firm resources and sustained competitive advantage.{" "}
                <i>Journal of Management</i>, 17(1), 99–120.
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">Preview generated from your 24 active citations.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .preview-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .preview-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .preview-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
        .bib-entry {
          padding-left: 2rem;
          text-indent: -2rem;
        }
      `}</style>
    </div>
  );
}
