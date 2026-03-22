import type { ReactNode } from 'react'

interface AppShellProps {
  header: ReactNode
  main: ReactNode
  footer: ReactNode
}

export function AppShell({ header, main, footer }: AppShellProps) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] transition-colors duration-700">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg"
      >
        Skip to main content
      </a>

      <header className="flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
        {header}
      </header>

      <main id="main-content" className="flex items-start justify-center px-6 pb-8 overflow-y-auto">
        {main}
      </main>

      <footer className="px-6 pb-6 md:px-10 md:pb-8">
        {footer}
      </footer>
    </div>
  )
}
