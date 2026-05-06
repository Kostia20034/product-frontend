import { useState } from "react"

function ProductCard({ id, name, price, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(name)
    const [newPrice, setNewPrice] = useState(price)

    if (editing) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="border rounded p-2 w-full mb-2"
                />
                <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="border rounded p-2 w-full mb-2"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            onUpdate(id, newName, newPrice)
                            setEditing(false)
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex-1"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <p className="text-blue-600 font-bold text-xl mt-1">${price}</p>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => setEditing(true)}
                    className="bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 flex-1"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="bg-red-500 text-white py-1 rounded hover:bg-red-600 flex-1"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ProductCard