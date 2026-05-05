import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/products")
            .then(r => r.json())
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Product Store</h1>
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                />
            ))}
        </div>
    )
}

export default App