import type { Asset } from "../types"

interface AssetTableProps {
    assets: Asset[]
    loading: boolean
    pendingActionId?: number | null
    onEdit: (asset: Asset) => void
    onDelete: (asset: Asset) => void
}

const AssetTable = ({ assets, loading, pendingActionId, onEdit, onDelete }: AssetTableProps) => {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-300">
                Loading the latest assets...
            </div>
        )
    }

    if (!assets.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
                <p className="text-lg font-medium text-white">No assets yet</p>
                <p className="mt-2 text-sm text-slate-400">Start by adding your first piece of inventory.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-slate-950/30">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-200">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, idx) => {
                            const isBusy = pendingActionId === asset.id
                            return (
                                <tr
                                    key={asset.id}
                                    className={idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/50"}
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{asset.id.toString().padStart(4, "0")}</td>
                                    <td className="px-6 py-4 text-base font-medium text-white">{asset.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300">{asset.category || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-100">{asset.quantity ?? 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(asset)}
                                                disabled={isBusy}
                                                className="rounded-full border border-amber-400/30 px-4 py-1 text-sm font-medium text-amber-200 transition hover:border-amber-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(asset)}
                                                disabled={isBusy}
                                                className="rounded-full border border-rose-500/30 px-4 py-1 text-sm font-medium text-rose-200 transition hover:border-rose-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isBusy ? "Working..." : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AssetTable
