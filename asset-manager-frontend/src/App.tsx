import { useCallback, useEffect, useMemo, useState } from "react"
import { createAsset, deleteAsset, getAssets, updateAsset } from "./api"
import AppShell from "./components/AppShell"
import AssetFormModal from "./components/AssetFormModal"
import AssetTable from "./components/AssetTable"
import StatCard from "./components/StatCard"
import type { Asset, AssetPayload } from "./types"

const App = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [pendingActionId, setPendingActionId] = useState<number | null>(null)

  const fetchAssets = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      const { data } = await getAssets()
      setAssets(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch assets", err)
      setError("Unable to load assets right now. Please retry in a moment.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const stats = useMemo(() => {
    const categories = new Set(assets.map((asset) => asset.category).filter(Boolean))
    const totalQuantity = assets.reduce((sum, asset) => sum + (asset.quantity ?? 0), 0)
    const avgQuantity = assets.length ? Math.round(totalQuantity / assets.length) : 0

    return {
      total: assets.length,
      categories: categories.size,
      quantity: totalQuantity,
      avgQuantity,
    }
  }, [assets])

  const handleCreate = async (payload: AssetPayload) => {
    try {
      await createAsset(payload)
      setCreateOpen(false)
      await fetchAssets({ silent: true })
    } catch (err) {
      console.error("Failed to create asset", err)
      setError("Could not create the asset. Please try again.")
    }
  }

  const handleUpdate = async (payload: AssetPayload) => {
    if (!editingAsset) return
    try {
      setPendingActionId(editingAsset.id)
      await updateAsset(editingAsset.id, payload)
      setEditingAsset(null)
      await fetchAssets({ silent: true })
    } catch (err) {
      console.error("Failed to update asset", err)
      setError("Could not update the asset. Please try again.")
    } finally {
      setPendingActionId(null)
    }
  }

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`Delete ${asset.name}? This action cannot be undone.`)) return
    try {
      setPendingActionId(asset.id)
      await deleteAsset(asset.id)
      await fetchAssets({ silent: true })
    } catch (err) {
      console.error("Failed to delete asset", err)
      setError("Could not delete the asset. Please try again.")
    } finally {
      setPendingActionId(null)
    }
  }

  const actionButton = (
    <button
      className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/20"
      onClick={() => setCreateOpen(true)}
    >
      + New asset
    </button>
  )

  const statCards = (
    <>
      <StatCard label="Tracked assets" value={stats.total.toString()} helper="Active records" />
      <StatCard label="Categories" value={stats.categories.toString()} helper="Classification groups" />
      <StatCard label="Total quantity" value={stats.quantity.toString()} helper="Units across all assets" />
      <StatCard label="Avg. quantity" value={stats.avgQuantity.toString()} helper="Per asset" />
    </>
  )

  return (
    <AppShell
      title="Asset Management Console"
      subtitle="Track equipment, quantify inventory, and manage resources with ease."
      actions={actionButton}
      stats={statCards}
    >
      {error && (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-100">
          <span>{error}</span>
          <button
            className="rounded-full border border-rose-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-100"
            onClick={() => fetchAssets()}
          >
            Retry
          </button>
        </div>
      )}

      <AssetTable
        assets={assets}
        loading={loading}
        pendingActionId={pendingActionId}
        onEdit={(asset) => setEditingAsset(asset)}
        onDelete={handleDelete}
      />

      <AssetFormModal
        isOpen={createOpen}
        mode="create"
        initialValues={null}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <AssetFormModal
        isOpen={Boolean(editingAsset)}
        mode="edit"
        initialValues={editingAsset}
        onClose={() => setEditingAsset(null)}
        onSubmit={handleUpdate}
      />
    </AppShell>
  )
}

export default App
