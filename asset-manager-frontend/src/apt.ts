import axios from "axios";
const API_URL = "http://localhost:5000";

export const getAssets = async () => axios.get(`${API_URL}/assets`);
export const createAsset = (data: { name: string; cateogry?: string; quantity?: number }) =>
    axios.post(`${API_URL}/assets`, data);
export const updateAsset = (id: number, data: { name?: string; cateogry?: string; quantity?: number }) =>
    axios.put(`${API_URL}/assets/${id}`, data);
export const deleteAsset = (id: number) => axios.delete(`${API_URL}/assets/${id}`);