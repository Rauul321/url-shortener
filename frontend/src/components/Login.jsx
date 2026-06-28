import { useState } from 'react'


export default function Login({onLogin}) {
    const [email, setEmail] = useState('')
    const [passwd, setPasswd] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')

    const handleSubmit = async () => {

        setLoading(true)
        setError('')

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, passwd})
            })

            if(!response.ok) {
                const msg = await response.text()
                throw new Error(msg)
            }

            const data = await response.json()
            onLogin(data.token)
        } catch(err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6">
                <h2 className="text-4xl font-extrabold text-white text-center">
                    Log <span className={"text-indigo-400"}>in</span>
                </h2>

                <div className={"bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4"}>
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
                        <p className={"text-sm text-red-400 bg-red-500/10 py-2 px-3 rounded-md border border-red-500/20"}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={"w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition disabled:opacity-50"}
                    >
                        {loading ? 'Validating...' : 'Log in'}
                    </button>

                    <p className={"text-center text-sm text-gray-400"}>
                        Don't have an account?{' '}
                        <a href="/signup" className="text-indigo-400 hover_underline"> Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}