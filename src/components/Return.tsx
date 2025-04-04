import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseService";
import { Navigate, useNavigate } from "react-router-dom";
import { ReEnvisionLogo } from "./icons/ReEnvisionLogo"; // Import the logo
import { Download, LogIn } from "lucide-react"; // Import icons

export const ReturnPage: React.FC = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const navigate = useNavigate();

    useEffect(()=> {
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const sessionId = urlParam.get('session_id');

        if (!sessionId) {
            // Redirect if no session ID is present
            navigate('/login');
            return;
        }

        const fetchSessionStatus = async () => {
            try {
                const {data, error} = await supabase.functions.invoke('session-status', {method: "POST", body: {session_id: sessionId}});
                if(error) {
                    console.error(error);
                    setStatus('error'); // Set an error status
                    return;
                }

                if (data) {
                    setStatus(data.status);
                    setCustomerEmail(data.customer_email);
                } else {
                    setStatus('error'); // Handle case where data is null
                }
            } catch (err) {
                console.error("Error fetching session status:", err);
                setStatus('error');
            }
        };

        fetchSessionStatus();
    }, [navigate]); // Add navigate to dependency array

    const handleLoginClick = () => {
        navigate('/login', {replace: true});
    }

    if (status === null) {
        // Show loading state
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#050b16] to-[#1a365d] flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    if (status === 'open') {
        // Redirect to subscription page if payment wasn't completed
        return <Navigate to="/subscribe" replace />;
    }

    if (status === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#050b16] to-[#1a365d] flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg border border-blue-900/50 text-center">
                    <ReEnvisionLogo className="w-24 h-24 mx-auto mb-6" /> {/* Add the logo */}
                    <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                    <p className="text-gray-300 mb-6">
                        We appreciate your business! A confirmation email will be sent to <b className="text-blue-300">{customerEmail}</b>.
                    </p>
                    <p className="text-gray-300 mb-6">
                        <a
                            href="https://www.ReEnvision.AI/download"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                        >
                            <Download className="w-4 h-4" />
                            Click here to download and install
                        </a>
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                        If you have any questions, please email <a href="mailto:help@reenvision.ai" className="text-blue-400 hover:text-blue-300 underline">help@reenvision.ai</a>
                    </p>
                    <button
                        onClick={handleLoginClick}
                        className="w-full py-2 px-4 bg-blue-600/90 hover:bg-blue-700/90 text-white font-semibold
                        rounded-lg shadow-md backdrop-blur transition-all hover:scale-[1.02]
                        border border-blue-900/50 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // Handle error or unexpected status
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050b16] to-[#1a365d] flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg border border-red-900/50 text-center">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                <p className="text-gray-300 mb-6">
                    There was an issue retrieving your session status. Please try logging in again or contact support.
                </p>
                <button
                    onClick={handleLoginClick}
                    className="w-full py-2 px-4 bg-gray-600/90 hover:bg-gray-700/90 text-white font-semibold
                    rounded-lg shadow-md backdrop-blur transition-all hover:scale-[1.02]
                    border border-gray-900/50 flex items-center justify-center gap-2"
                >
                    <LogIn className="w-5 h-5" />
                    Back to Login
                </button>
            </div>
        </div>
    );
}
