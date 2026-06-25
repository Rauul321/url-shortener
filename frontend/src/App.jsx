import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import UrlForm from "./components/UrlForm.jsx"; // Asegúrate de que la ruta sea correcta

export default function App() {
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShortenUrl = async (longUrl) => {
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:3000/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      if (!response.ok) {
        throw new Error("Hubo un problema al procesar la URL. Inténtalo de nuevo.");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              <span className="text-indigo-400">URL</span> Shortener
            </h2>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
            <UrlForm onShorten={handleShortenUrl} isLoading={loading} />

            {error && (
                <p className="mt-4 text-sm text-red-400 bg-red-500/10 py-2 rounded-md border border-red-500/20">
                  {error}
                </p>
            )}

            {shortUrl && (
                <div className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-left animate-fade-in">
                  <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Your short URL is ready!
                  </label>
                  <div className="mt-2 flex items-center justify-between gap-2 bg-black/30 p-2 rounded border border-white/5">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white text-sm truncate hover:underline hover:text-indigo-300"
                    >
                      {shortUrl}
                    </a>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(shortUrl);
                          alert("Copied!");
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
