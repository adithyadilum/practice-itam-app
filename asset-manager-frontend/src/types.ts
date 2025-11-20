export interface Asset {
    id: number
    name: string
    category?: string | null
    quantity?: number | null
}

export interface AssetPayload {
    name: string
    category?: string
    quantity?: number
}
