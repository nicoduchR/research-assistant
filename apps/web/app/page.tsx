import Link from "next/link";

const pages = [
  {
    id: 1,
    title: "Project Scope Setup",
    description: "Define research scope, objectives, and methodology",
    href: "/project-scope-setup",
    icon: "folder_open",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "PDF Upload",
    description: "Upload research papers for analysis",
    href: "/pdf-upload",
    icon: "cloud_upload",
    color: "bg-indigo-500",
  },
  {
    id: 3,
    title: "PDF Processing",
    description: "View PDF processing status and errors",
    href: "/pdf-processing",
    icon: "sync",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Research Workspace",
    description: "Write and cite with AI-powered assistance",
    href: "/research-workspace",
    icon: "edit_document",
    color: "bg-pink-500",
  },
  {
    id: 5,
    title: "Research Library",
    description: "Manage your document library",
    href: "/research-library",
    icon: "library_books",
    color: "bg-rose-500",
  },
  {
    id: 6,
    title: "Literature Synthesis",
    description: "Synthesize themes and identify patterns",
    href: "/literature-synthesis",
    icon: "analytics",
    color: "bg-orange-500",
  },
  {
    id: 7,
    title: "Research Gaps",
    description: "Identify and analyze research gaps",
    href: "/research-gaps",
    icon: "search_off",
    color: "bg-amber-500",
  },
  {
    id: 8,
    title: "Export Bibliography",
    description: "Generate formatted citations and bibliography",
    href: "/export-bibliography",
    icon: "ios_share",
    color: "bg-green-500",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-[28px]">school</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ResearchAI</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">AI-powered literature review generation tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">All Application Screens</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore all pages of the Research Assistant application. Each screen demonstrates different features of the literature review workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${page.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[24px]">{page.icon}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {page.id}/8
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {page.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {page.description}
                </p>

                {/* Arrow icon */}
                <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View page</span>
                  <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                About This Project
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                ResearchAI is a comprehensive literature review tool designed for MBA students and researchers. It uses AI to help you analyze academic papers, synthesize themes, identify research gaps, and generate properly formatted bibliographies.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">Next.js 15</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">TypeScript</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">Tailwind CSS</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">App Router</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">route</span>
                Workflow Overview
              </h3>
              <ol className="space-y-2">
                {[
                  "Define research scope and objectives",
                  "Upload and process PDF documents",
                  "Write with AI-powered citations",
                  "Synthesize literature themes",
                  "Identify research gaps",
                  "Export formatted bibliography",
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Built with Next.js 15, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
