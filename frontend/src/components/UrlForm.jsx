
import React, { useState } from "react"; // CORRECCIÓN 1: Importar useState

export default function UrlForm({ onShorten, isLoading }) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;

        onShorten(url);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl text-left">
            <div className="grid grid-cols-1 gap-y-6">
                <div>
                    <label htmlFor="url" className="block text-sm font-semibold text-white">
                        Origin URL
                    </label>
                    <div className="mt-2.5">
                        <input
                            type="url"
                            id="url"
                            name="url"
                            required
                            placeholder="https://example.com/your-long-link-here"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="block w-full rounded-lg bg-white/5 px-5 py-4 text-lg text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? "Processing..." : "Short URL"}
                </button>
            </div>
        </form>
    );
}

