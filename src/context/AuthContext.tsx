import React, { createContext, useState, useEffect, useContext, ReactNode} from "react";
import { useAuthStore } from "../store/useAuthStore";

interface AuthContextInterface {
    isAuthenticated: boolean;
    hasActiveSubscription: boolean;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
            if(user.activeSubscription) {
                setHasActiveSubscription(true);
            } else {
                setHasActiveSubscription(false);
            }
        } else {
            setIsAuthenticated(false);
            setHasActiveSubscription(false);
        }
    }, [user]);

    const value = {
        isAuthenticated,
        hasActiveSubscription,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};