export default function UrlCard({ originalUrl, shortUrl, clicks, onDelete}) {
    return(
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="truncate flex-1">
                <p className="text-xs text-gray-400 truncate" title={originalUrl}>
                    {originalUrl}
                </p>
                <a
                    href={shortUrl}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className="text-sm font-medium text-indigo-400 hover:underline truncate block"
                >
                    {shortUrl}
                </a>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                    <span className="block text-s font-bold text-white">{clicks}</span>
                    <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Clicks</span>
                </div>

                <button
                    onClick={onDelete}
                    className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}