import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseService";
import { Navigate, useNavigate } from "react-router-dom";

export const ReturnPage: React.FC = () => {
    const [status, setStatus] = useState(null);
    const [CustomerEmail, setCustomerEmail] = useState('');
    const navigate = useNavigate();

    useEffect(()=> {
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const sessionId = urlParam.get('session_id');

        const fetchSessionStatus = async () => {
            const {data, error} = await supabase.functions.invoke('session-status', {method: "POST", body: {session_id: sessionId}});
            if(error) {
                console.error(error);
                return;
            }
            
            if (data) {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            }
        };

        fetchSessionStatus().then();
    }, []);

    const handleOnClick = () => {
        navigate('/login', {replace: true});
    }

    if (status === 'open') {
        return (
            <Navigate to="/subscribe" />
        )
    }

    if (status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {CustomerEmail}.

                    If you have any questions, please email <a href="mailto:help@reenvision.ai">help@reenvision.ai</a>
                </p>
                <button onClick={handleOnClick}>Log In</button>
            </section>
        )
    }
}