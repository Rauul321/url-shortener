import UrlForm from "./components/UrlForm.jsx";
import './index.css'
import { ArrowLeft, User, Trash2, Home } from 'lucide-react';
import UrlCard from "./components/UrlCard.jsx";
import {useEffect} from "react";
import Footer from "./components/Footer.jsx";

export default function Dashboard({username, urls, onBackHome, onDeleteUrl, onDeleteAccount}) {
    const BACK_URL = import.meta.env.VITE_BACK_URL;

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-between items-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <button
                        onClick={onBackHome}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} /> <Home size={18} />
                    </button>

                    <div className="flex items-center gap-2 text-white">
                        <User size={18} className="text-indigo-400" />
                        <span className="font-semibold">
                            {username}
                        </span>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md space-y-6">
                    <h3 className="text-xl font-bold text-white text-left">Your active URLs</h3>

                    <div className="space-y-4">
                        {urls && urls.length > 0 ? (
                            urls.map((item) => (
                                <UrlCard
                                    key={item.code}
                                    shortUrl={`${BACK_URL}/${item.code}`} // CHAPUZA TEMPORAL
                                    clicks={item.clicks || 0} // Si luego agregas los clics
                                    onDelete={() => onDeleteUrl(item.code)}
                                />
                        ))
                        ) : (
                            <p className="text-gray-400 text-sm py-8 text-center">
                                You don't have any URL
                            </p>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}