import { useState } from "react"
import API_URL from "./config"

function Auth({ onLogin }) { // function as a parameter
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = () => {
        const url = isRegister
            ? `${API_URL}/api/v1/auth/register`
            : `${API_URL}/api/v1/auth/login`

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(r => r.json())
        .then(data => {
            if (data.token) {
                onLogin(data.token) // if we got token pass it to login
            } else {
                setError("Invalid credentials")
            }
        })
        .catch(() => setError("Something went wrong")) //general response
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow p-8 w-96">
                <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                    {isRegister ? "Create Account" : "Welcome Back"}
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border rounded p-2 w-full mb-3"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 mb-3"
                >
                    {isRegister ? "Register" : "Login"}
                </button>

                <p
                    onClick={() => {
                        setIsRegister(!isRegister)
                        setError("")
                    }}
                    className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </p>
            </div>
        </div>
    )
}

export default Auth