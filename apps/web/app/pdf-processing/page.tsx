"use client";

import { useState } from "react";

interface Document {
  id: string;
  name: string;
  size: string;
  status: "ready" | "processing" | "error";
  error?: string;
}

export default function PdfProcessingDashboard() {
  const [documents] = useState<Document[]>([
    { id: "1", name: "Porter_Competitive_Advantage_1985.pdf", size: "2.4 MB", status: "ready" },
    { id: "2", name: "Smith_2019_scan.pdf", size: "1.8 MB", status: "error", error: "Unable to extract text reliably - document may be image-based." },
    { id: "3", name: "Christensen_Innovators_Dilemma.pdf", size: "1.8 MB", status: "ready" },
    { id: "4", name: "Nonaka_Knowledge_Creation_1994.pdf", size: "3.1 MB", status: "ready" },
  ]);

  const readyCount = documents.filter(d => d.status === "ready").length;

  return (
    <div className="bg-background-light font-display text-text-dark antialiased min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]">manage_search</span>
          </div>
          <h2 className="text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">ResearchAI</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-text-dark leading-none">Alex Morgan</p>
              <p className="text-xs text-slate-500 mt-1">MBA Candidate</p>
            </div>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-slate-100 bg-gradient-to-br from-blue-400 to-indigo-500"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-sidebar-light p-4 gap-2 shrink-0">
          <div className="pb-4">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Projects</p>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-slate-200 shadow-sm text-primary font-medium" href="#">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              Strategy & Innovation
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              Marketing Ethics
            </a>
          </div>
        </aside>

        <div className="flex-1 flex flex-col relative overflow-y-auto">
          <div className="px-8 pt-8 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span>Projects</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-medium">Strategy & Innovation</span>
              </div>
              <h1 className="text-3xl font-black text-text-dark tracking-tight mt-2">New Literature Review</h1>
              <p className="text-slate-600 max-w-2xl">Upload your core PDF documents. Our AI will extract key themes, arguments, and generate citation traceability for your review.</p>
            </div>
          </div>

          <div className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-6">
            {/* Drop Zone */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-white hover:bg-slate-50/50 hover:border-primary transition-all cursor-pointer group relative">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                <div className="flex flex-col items-center gap-4 z-10 p-8 text-center">
                  <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[40px] text-primary group-hover:text-blue-600 transition-colors">cloud_upload</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-text-dark">Upload Research Papers</p>
                    <p className="text-slate-500 text-sm max-w-[300px]">Drag & drop your PDF files here, or click to browse from your computer.</p>
                  </div>
                  <button className="mt-4 px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Browse Files
                  </button>
                </div>
              </div>
            </div>

            {/* Documents Queue */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-dark">Documents Queue</h3>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{documents.length}</span>
                </div>
                <button className="text-xs font-medium text-slate-500 hover:text-red-500 transition-colors">Clear all</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[500px] bg-slate-50/50">
                {documents.map((doc) => (
                  <div key={doc.id} className={`group flex items-${doc.status === "error" ? "start" : "center"} gap-3 p-3 rounded-lg ${
                    doc.status === "error"
                      ? "bg-error-bg border border-red-300 shadow-sm"
                      : "bg-white border border-slate-200 hover:border-primary/30 hover:shadow-subtle"
                  } transition-all`}>
                    <div className={`size-10 rounded ${
                      doc.status === "error"
                        ? "bg-white/50 text-red-600"
                        : "bg-red-50 text-red-600"
                    } flex items-center justify-center shrink-0 ${doc.status === "error" ? "mt-0.5" : ""}`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {doc.status === "error" ? "warning" : "picture_as_pdf"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-${doc.status === "error" ? "bold" : "semibold"} ${
                        doc.status === "error" ? "text-red-900" : "text-text-dark"
                      } truncate`}>{doc.name}</p>
                      <div className={`flex ${doc.status === "error" ? "flex-col" : "items-center"} gap-${doc.status === "error" ? "1" : "2"} mt-${doc.status === "error" ? "1" : "0.5"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${doc.status === "error" ? "text-red-700/70" : "text-slate-500"}`}>{doc.size}</span>
                          <span className={`size-1 rounded-full ${doc.status === "error" ? "bg-red-400" : "bg-slate-300"}`}></span>
                          <span className={`text-xs flex items-center gap-1 ${
                            doc.status === "error"
                              ? "text-red-700 font-bold"
                              : "text-green-600"
                          }`}>
                            <span className="material-symbols-outlined text-[12px]">
                              {doc.status === "error" ? "error" : "check_circle"}
                            </span>
                            {doc.status === "error" ? "Failed" : "Ready"}
                          </span>
                        </div>
                        {doc.error && (
                          <p className="text-[11px] leading-tight text-red-800 font-medium">{doc.error}</p>
                        )}
                      </div>
                    </div>
                    {doc.status === "error" ? (
                      <div className="flex flex-col gap-1">
                        <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-200/50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                        <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-200/50 rounded-lg transition-colors" title="Retry">
                          <span className="material-symbols-outlined text-[20px]">refresh</span>
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-4 px-1">
                  <span>Total size: 9.1 MB</span>
                  <span>Est. processing time: ~60s</span>
                </div>
                <button className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate Review
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Toast */}
          <div className="absolute bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-toast border border-slate-200 overflow-hidden">
            <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-800">Processing Paused</p>
                <p className="text-xs text-red-600 mt-1 font-medium">Issues detected in queue</p>
              </div>
              <div className="size-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">priority_high</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-slate-600">
                1 document failed to process due to OCR limitations. You can remove it to proceed with the remaining papers.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Total Progress</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">25%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[25%] rounded-full relative"></div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Review Issues
                </button>
                <button className="flex-1 py-2 px-3 bg-primary hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
                  Continue with {readyCount} papers
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
