import { useState } from 'react';
import UrlForm from "./components/UrlForm.jsx";
import './index.css';
import { LogIn, LogOut, LayoutDashboard, Shield, FileText, Lock, X } from 'lucide-react';
import Footer from "./components/Footer.jsx";

export default function Home({ token, onLogout, onShortenUrl, onGenerateQr, shortUrl, error, loading }) {

    const [modalContent, setModalContent] = useState(null);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex-1 flex items-start sm:items-center justify-center">
                <div className="w-full max-w-md space-y-8 text-center my-4 sm:my-8">

                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            <span className="text-indigo-400">URL</span> Shortener
                        </h2>
                        {token ? (
                            <div className="flex flex-row items-end space-x-4">
                                <a
                                    href='/dashboard'
                                    className="text-sm text-gray-400 hover:text-white transition"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard size={20} />
                                </a>
                                <button
                                    onClick={onLogout}
                                    className="text-sm text-gray-400 hover:text-white transition"
                                    title="Cerrar sesión"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <a href="/login" className="text-sm text-indigo-400 hover:underline flex items-center gap-1" title="Iniciar sesión">
                                <LogIn size={20} />
                            </a>
                        )}
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                        <UrlForm onShorten={onShortenUrl} isLoading={loading} />

                        {error && (
                            <p className="mt-4 text-sm text-red-400 bg-red-500/10 py-2 rounded-md border border-red-500/20">
                                {error}
                            </p>
                        )}

                        {shortUrl && (
                            <div className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-left">
                                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                    ¡Tu URL acortada está lista!
                                </label>
                                <div className="mt-2 flex items-center justify-between gap-2 bg-black/30 p-2 rounded border border-white/5">
                                    <a
                                        href={shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-white text-sm truncate hover:underline hover:text-indigo-300 flex-1"
                                    >
                                        {shortUrl}
                                    </a>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(shortUrl); alert('¡Copiado!'); }}
                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
                                    >
                                        Copiar
                                    </button>
                                    <button
                                        onClick={() => { const code = shortUrl.split('/').pop(); onGenerateQr(code); }}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all duration-200"
                                        title="Generar QR"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="5" height="5" x="3" y="3" rx="1"/>
                                            <rect width="5" height="5" x="16" y="3" rx="1"/>
                                            <rect width="5" height="5" x="3" y="16" rx="1"/>
                                            <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                                            <path d="M21 21v.01"/>
                                            <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                                            <path d="M3 12h.01"/>
                                            <path d="M12 3h.01"/>
                                            <path d="M12 16v.01"/>
                                            <path d="M16 12h1"/>
                                            <path d="M21 12v.01"/>
                                            <path d="M12 21v.01"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}