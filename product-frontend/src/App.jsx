import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [search,setSearch] = useState("")

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/products")
            .then(r => r.json())
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
    }, [])

    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/v1/products/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            setProducts(products.filter(p => p.id !== id))
        })
    }

    const createProduct = () => {
        fetch("http://localhost:8080/api/v1/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, price: price })
        })
        .then(r => r.json())
        .then(newProduct => {
            setProducts([...products, newProduct])
            setName("")
            setPrice("")
        })
    }

    const updateProduct = (id, name, price) => {
    fetch(`http://localhost:8080/api/v1/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, price: price })
    })
    .then(r => r.json())
    .then(updated => {
        setProducts(products.map(p => p.id === id ? updated : p))
    })
}
    const searchProduct = () => {
        fetch(`http://localhost:8080/api/v1/products/search?name=${search}`)
        .then(r => r.json())
        .then(data => {setProducts(data)
        setSearch("")})
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl text-gray-500">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-white shadow p-4 mb-8">
                <h1 className="text-2xl font-bold text-blue-600">
                    Product Store
                </h1>
            </nav>
        <div className="flex gap-2 mb-6">
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded p-2 flex-1"
            />
            <button
                onClick={searchProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Search
            </button>
        </div>
            <div className="max-w-4xl mx-auto px-4">

                {/* Create form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                        Add New Product
                    </h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Product name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border rounded p-2 flex-1"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="border rounded p-2 w-32"
                        />
                        <button
                            onClick={createProduct}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Product list */}
                <div className="grid grid-cols-3 gap-4">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            onDelete={deleteProduct}
                            onUpdate={updateProduct}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}

export default App