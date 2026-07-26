import { useState } from 'react';
import { Shield, Lock, FileText, X } from 'lucide-react';

export default function Footer() {
    const [modalContent, setModalContent] = useState(null);

    return (
        <>
            <footer className="w-full max-w-4xl mx-auto pt-8 border-t border-white/10 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} Portfolio Project. Built for demonstration purposes.</p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => setModalContent('legal')}
                            className="hover:text-indigo-400 transition flex items-center gap-1"
                        >
                            <Shield size={14} /> Legal Notice
                        </button>
                        <button
                            onClick={() => setModalContent('privacy')}
                            className="hover:text-indigo-400 transition flex items-center gap-1"
                        >
                            <Lock size={14} /> Privacy & Cookies
                        </button>
                        <button
                            onClick={() => setModalContent('terms')}
                            className="hover:text-indigo-400 transition flex items-center gap-1"
                        >
                            <FileText size={14} /> Terms of Service
                        </button>
                    </div>
                </div>
            </footer>

            {/* LEGAL MODAL */}
            {modalContent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto text-left shadow-2xl relative">
                        <button
                            onClick={() => setModalContent(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        {modalContent === 'legal' && (
                            <div className="space-y-3 text-sm text-gray-300">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Shield className="text-indigo-400" size={18} /> Legal Notice
                                </h3>
                                <p>This website is an <strong>open-source project and personal portfolio</strong> with no profit motive or commercial activity.</p>
                                <p>The service is provided "as is" exclusively for technical demonstration of full-stack development capabilities.</p>
                                <p>Developer / Support contact: <span className="text-indigo-400">rrosador28@gmail.com</span></p>
                            </div>
                        )}

                        {modalContent === 'privacy' && (
                            <div className="space-y-3 text-sm text-gray-300">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Lock className="text-indigo-400" size={18} /> Privacy & Cookies
                                </h3>
                                <p><strong>Data Processing:</strong> User accounts only store your email address and a securely hashed version of your password for authentication purposes.</p>
                                <p><strong>Cookies:</strong> This website only uses <em>strictly necessary technical session cookies</em> to verify requests from logged-in users. We do not use third-party tracking or analytics cookies.</p>
                                <p>You can request the deletion of your test account at any time by contacting us via email.</p>
                            </div>
                        )}

                        {modalContent === 'terms' && (
                            <div className="space-y-3 text-sm text-gray-300">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="text-indigo-400" size={18} /> Terms of Service
                                </h3>
                                <p>It is strictly prohibited to use this URL shortener to create links pointing to:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-2">
                                    <li>Phishing, malware, or malicious content websites.</li>
                                    <li>Illegal material, hate speech, or bulk SPAM.</li>
                                </ul>
                                <p>The administrator reserves the right to <strong>delete without prior notice</strong> any URL or account that violates these rules or compromises server security.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}