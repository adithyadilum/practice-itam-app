import { useEffect, useState } from "react";
import { getAssets, createAsset, deleteAsset, updateAsset } from "./api";

interface Asset {
  id: number;
  name: string;
  category?: string;
  quantity?: number;
}

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await getAssets();
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!name) return alert("Name is required");
    try {
      await createAsset({ name, category, quantity });
      setName("");
      setCategory("");
      setQuantity(1);
      setModalOpen(false); // Close modal
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (asset: Asset) => {
    setEditAsset(asset);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Asset Manager</h1>

      {/* Add Asset Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Asset
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Asset</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border p-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Asset</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                value={editAsset.name}
                onChange={(e) => setEditAsset({ ...editAsset, name: e.target.value })}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={editAsset.category}
                onChange={(e) => setEditAsset({ ...editAsset, category: e.target.value })}
                className="border p-2"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={editAsset.quantity}
                onChange={(e) => setEditAsset({ ...editAsset, quantity: Number(e.target.value) })}
                className="border p-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditAsset(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!editAsset) return;
                    await updateAsset(editAsset.id, {
                      name: editAsset.name,
                      category: editAsset.category,
                      quantity: editAsset.quantity,
                    });
                    setEditAsset(null);
                    fetchAssets();
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded p-4 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="border border-gray-300 px-4 py-2">{asset.id}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.name}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.category}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(asset)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
