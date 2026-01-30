"use client";

import { useState } from "react";

interface Document {
  id: string;
  name: string;
  size: string;
  status: "ready" | "processing" | "error";
}

export default function PdfUploadDashboard() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Porter_Competitive_Advantage_1985.pdf", size: "2.4 MB", status: "ready" },
    { id: "2", name: "Christensen_Innovators_Dilemma.pdf", size: "1.8 MB", status: "ready" },
    { id: "3", name: "Nonaka_Knowledge_Creation_1994.pdf", size: "3.1 MB", status: "ready" },
  ]);

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="bg-background-main font-display text-text-main antialiased min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light bg-white px-6 py-3 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]">manage_search</span>
          </div>
          <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">ResearchAI</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-50 text-text-secondary hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-50 text-text-secondary hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
              <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-border-light">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-text-main leading-none">Alex Morgan</p>
              <p className="text-xs text-text-secondary mt-1">MBA Candidate</p>
            </div>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/10 bg-gradient-to-br from-blue-400 to-indigo-500"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border-light bg-sidebar-bg p-4 gap-2 shrink-0">
          <div className="pb-4">
            <p className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Projects</p>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white shadow-sm border border-border-light text-primary font-semibold" href="#">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              Strategy & Innovation
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-white hover:shadow-sm hover:text-text-main transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">folder</span>
              Marketing Ethics
            </a>
          </div>
        </aside>

        <div className="flex-1 flex flex-col relative overflow-y-auto bg-background-main">
          <div className="px-8 pt-8 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span>Projects</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-medium">Strategy & Innovation</span>
              </div>
              <h1 className="text-3xl font-black text-text-main tracking-tight mt-2">New Literature Review</h1>
              <p className="text-text-secondary max-w-2xl">Upload your core PDF documents. Our AI will extract key themes, arguments, and generate citation traceability for your review.</p>
            </div>
          </div>

          <div className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-6">
            {/* Drop Zone */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-white hover:bg-blue-50/30 hover:border-primary transition-all cursor-pointer group relative shadow-sm">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                <div className="flex flex-col items-center gap-4 z-10 p-8 text-center">
                  <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-4 ring-blue-50/50">
                    <span className="material-symbols-outlined text-[40px] text-primary transition-colors">cloud_upload</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-text-main">Upload Research Papers</p>
                    <p className="text-text-secondary text-sm max-w-[300px]">Drag & drop your PDF files here, or click to browse from your computer.</p>
                  </div>
                  <button className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Browse Files
                  </button>
                </div>
              </div>
            </div>

            {/* Documents Queue */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col bg-white rounded-xl border border-border-light shadow-card h-fit">
              <div className="p-4 border-b border-border-light flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-main">Documents Queue</h3>
                  <span className="bg-blue-100 text-primary text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">{documents.length}</span>
                </div>
                <button className="text-xs font-medium text-text-secondary hover:text-red-600 transition-colors">Clear all</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[500px]">
                {documents.map((doc) => (
                  <div key={doc.id} className="group flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="size-10 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-main truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-secondary">{doc.size}</span>
                        <span className="size-1 rounded-full bg-gray-300"></span>
                        <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span> Ready
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border-light bg-gray-50/50 rounded-b-xl">
                <div className="flex justify-between items-center text-xs text-text-secondary mb-4 px-1 font-medium">
                  <span>Total size: 7.3 MB</span>
                  <span>Est. processing time: ~45s</span>
                </div>
                <button className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate Review
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          <div className="absolute bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-toast border border-border-light overflow-hidden">
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-text-main">Processing Documents</p>
                <p className="text-xs text-text-secondary mt-1">Generating literature review matrix...</p>
              </div>
              <div className="size-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <p className="text-xs font-semibold text-text-secondary">Analyze document structure</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-primary flex items-center justify-center text-white animate-pulse shadow-sm">
                      <span className="text-[10px] font-bold">2</span>
                    </div>
                    <p className="text-xs font-bold text-primary">Synthesizing themes</p>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">64%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="size-5 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                  <span className="text-[10px] font-bold text-gray-400">3</span>
                </div>
                <p className="text-xs font-medium text-text-secondary">Verify citations & references</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
