import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function RequireAuth({ children }) {
    const auth = useAuth();
    const user = auth?.user;
    const location = useLocation();

    if(!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}