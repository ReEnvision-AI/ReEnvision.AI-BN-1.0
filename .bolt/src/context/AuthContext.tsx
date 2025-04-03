import React, { createContext, useState, useEffect, useContext, ReactNode} from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types";

interface AuthContextInterface {
    isAuthenticated: boolean;
    //updateActiveSubscription: () => void;
    hasActiveSubscription: () => boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
    user: User | null
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
    const [subscribed, setSubscribed] = useState(false);
    //const user = useAuthStore((state) => state.user);
    const {user, signIn, signOut, signUp, setUser} = useAuthStore();

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
            if(user.activeSubscription) {
                setSubscribed(true);
            } else {
                setSubscribed(false);
            }
        } else {
            setIsAuthenticated(false);
            setSubscribed(false);
        }
    }, [user]);

    const value = {
        isAuthenticated,
        hasActiveSubscription: () => {return subscribed},
        signIn,
        signUp,
        signOut,
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
