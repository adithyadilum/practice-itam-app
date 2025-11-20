interface StatCardProps {
    label: string
    value: string
    helper?: string
    accent?: string
}

const StatCard = ({ label, value, helper, accent }: StatCardProps) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
        <p className="mt-3 text-3xl font-semibold">{value}</p>
        {helper && <p className="mt-1 text-sm text-white/70">{helper}</p>}
        {accent && <p className="mt-3 text-xs font-medium text-white/70">{accent}</p>}
    </div>
)

export default StatCard
