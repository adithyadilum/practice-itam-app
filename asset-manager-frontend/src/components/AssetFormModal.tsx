import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import type { Asset, AssetPayload } from "../types"

interface AssetFormModalProps {
    isOpen: boolean
    mode: "create" | "edit"
    initialValues?: Asset | null
    onClose: () => void
    onSubmit: (payload: AssetPayload) => Promise<void> | void
}

const emptyForm: AssetPayload = {
    name: "",
    category: "",
    quantity: 1,
}

const AssetFormModal = ({ isOpen, mode, initialValues, onClose, onSubmit }: AssetFormModalProps) => {
    const [form, setForm] = useState<AssetPayload>(emptyForm)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (initialValues) {
            setForm({
                name: initialValues.name,
                category: initialValues.category || "",
                quantity: initialValues.quantity ?? 1,
            })
        } else {
            setForm(emptyForm)
        }
    }, [initialValues, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        if (!form.name.trim()) return

        try {
            setSubmitting(true)
            await onSubmit({
                name: form.name.trim(),
                category: form.category?.trim() || undefined,
                quantity: form.quantity && form.quantity > 0 ? form.quantity : 1,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const updateField = <Key extends keyof AssetPayload>(field: Key, value: AssetPayload[Key]) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const title = mode === "create" ? "Add asset" : "Update asset"
    const primaryLabel = mode === "create" ? "Create asset" : "Save changes"

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{mode}</p>
                        <h2 className="text-2xl font-semibold text-white">{title}</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Give your record a name, optional category, and a quantity for tracking.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 transition hover:text-white" aria-label="Close modal">
                        ×
                    </button>
                </div>

                <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label className="text-sm font-medium text-slate-200">
                        Asset name
                        <input
                            type="text"
                            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-base text-white outline-none ring-indigo-500/0 transition focus:ring-2"
                            placeholder="e.g. Studio Camera"
                            value={form.name}
                            onChange={(evt) => updateField("name", evt.target.value)}
                            required
                        />
                    </label>

                    <label className="text-sm font-medium text-slate-200">
                        Category
                        <input
                            type="text"
                            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-base text-white outline-none ring-indigo-500/0 transition focus:ring-2"
                            placeholder="e.g. Equipment"
                            value={form.category || ""}
                            onChange={(evt) => updateField("category", evt.target.value)}
                        />
                    </label>

                    <label className="text-sm font-medium text-slate-200">
                        Quantity
                        <input
                            type="number"
                            min={1}
                            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-base text-white outline-none ring-indigo-500/0 transition focus:ring-2"
                            value={form.quantity ?? 1}
                            onChange={(evt) => updateField("quantity", Number(evt.target.value) || 1)}
                        />
                    </label>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : primaryLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AssetFormModal
