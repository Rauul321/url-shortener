import { useState } from 'react'; // Corregido el import
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';

import UrlForm from "./components/UrlForm.jsx";

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

  const handleGenerateQr = async (code) => {
    try {
      const response = await fetch(`http://localhost:3000/${code}/qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Error downloading the file");
      }

      // Corregido: Faltaba obtener el blob de la respuesta
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr.pdf';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error);
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
                        className="text-white text-sm truncate hover:underline hover:text-indigo-300 flex-1"
                    >
                      {shortUrl}
                    </a>

                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(shortUrl);
                          alert("Copied!");
                        }}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
                    >
                      Copy
                    </button>

                    <button
                        onClick={() => {
                          const code = shortUrl.split('/').pop();
                          handleGenerateQr(code);
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
  );
}
