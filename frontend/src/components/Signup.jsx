import { useState } from 'react'
import { ArrowLeft, Home, Shield, FileText, Lock, X } from "lucide-react";
import Footer from "./Footer.jsx";

export default function Signup({ onSignup, onBackHome }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [passwd, setPasswd] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [modalContent, setModalContent] = useState(null)

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, passwd })
            })

            if (!response.ok) {
                const msg = await response.text()
                throw new Error(msg)
            }

            onSignup()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-between px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Main Content Area */}
            <div className="flex-1 flex items-start sm:items-center justify-center">
                <div className="w-full max-w-md space-y-6 my-4 sm:my-8">

                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <h2 className="text-4xl font-extrabold text-white text-center">
                            Sign <span className="text-indigo-400">up</span>
                        </h2>

                        <button
                            onClick={onBackHome}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                            title="Go back home"
                        >
                            <ArrowLeft size={18} /> <Home size={18} />
                        </button>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4 backdrop-blur-md">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={passwd}
                            onChange={e => setPasswd(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        {error && (
                            <p className="text-sm text-red-400 bg-red-500/10 py-2 px-3 rounded-md border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>

                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <a href="/login" className="text-indigo-400 hover:underline">Log in</a>
                        </p>

                        <p className="text-center text-xs text-gray-500 pt-2 border-t border-white/5">
                            <strong>Demo environment.</strong> <br /> You can sign up with a fake test email if you want.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}