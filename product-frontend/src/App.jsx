import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import Auth from "./Auth"

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [search, setSearch] = useState("")
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // reusable function
    const authHeader = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    })

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/products?page=${currentPage}&size=10`)
            .then(r => r.json())
            .then(data => {
                setProducts(data.content)
                setTotalPages(data.totalPages)
                setLoading(false)
            })
    }, [currentPage])

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken)  // save to localStorage
        setToken(newToken)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setToken(null)
    }

    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/v1/products/${id}`, {
            method: "DELETE",
            headers: authHeader()  // ← send token
        })
        .then(() => {
            setProducts(products.filter(p => p.id !== id))
        })
    }

    const createProduct = () => {
        fetch("http://localhost:8080/api/v1/products", {
            method: "POST",
            headers: authHeader(),  // ← send token
            body: JSON.stringify({ name, price })
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
            headers: authHeader(),  // ← send token
            body: JSON.stringify({ name, price })
        })
        .then(r => r.json())
        .then(updated => {
            setProducts(products.map(p => p.id === id ? updated : p))
        })
    }

    const searchProducts = () => {
        fetch(`http://localhost:8080/api/v1/products/search?name=${search}&page=0&size=5`)
            .then(r => r.json())
            .then(data => {setProducts(data.content)
                           setTotalPages(data.totalPages)})
    }

    // not logged in → show auth form
    if (!token) return <Auth onLogin={handleLogin} />

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl text-gray-500">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-white shadow p-4 mb-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Product Store</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-4">

                {/* Search */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded p-2 flex-1"
                    />
                    <button
                        onClick={searchProducts}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => {
                            setSearch("")
                            fetch("http://localhost:8080/api/v1/products")
                                .then(r => r.json())
                                .then(data => setProducts(data))
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Clear
                    </button>
                </div>

                {/* Create form — only show if logged in */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
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

                {/* Products */}
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
            <div className="flex justify-center items-center gap-4 mt-6 mb-6">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button>

                <span className="text-gray-600 font-medium">
                    Page {currentPage + 1} of {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}

export default App