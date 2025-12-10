import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAccessToken, clearAccessToken, getCurrentUserId } from "@/services/authToken";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);
    
    useEffect(() => {
        async function initAuth() {
            const token = getAccessToken();
            if(!token) {
                setInitialized(true);
                return;
            }

            try {
                const id = getCurrentUserId();
                if(id) {
                    setUser({ id });
                } else {
                    clearAccessToken();
                }
            } catch (e) {
                console.error("초기 인증 복원 실패", e);
                clearAccessToken();
                setUser(null);
            } finally {
                setInitialized(true);
            }
        }

        initAuth();
    }, []);

    const logout = () => {
        clearAccessToken();
        setUser(null);
    }

    const value = { user, setUser, logout, initialized };

    if(!initialized) {
        return null;
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}