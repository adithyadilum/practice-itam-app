import { ReactNode } from "react"

interface AppShellProps {
    title: string
    subtitle?: string
    actions?: ReactNode
    stats?: ReactNode
    children: ReactNode
}

const AppShell = ({ title, subtitle, actions, stats, children }: AppShellProps) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <div className="relative isolate overflow-hidden bg-linear-to-br from-indigo-500/30 via-slate-900 to-slate-950">
                <div className="pointer-events-none absolute inset-0 opacity-50">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.4),transparent_60%)]" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200/80">
                                Asset Platform
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
                            {subtitle && <p className="mt-3 max-w-2xl text-base text-indigo-100/80">{subtitle}</p>}
                        </div>
                        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
                    </div>
                    {stats && <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats}</div>}
                </div>
            </div>
            <main className="mx-auto -mt-12 w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pt-20 lg:px-8">
                {children}
            </main>
        </div>
    )
}

export default AppShell
