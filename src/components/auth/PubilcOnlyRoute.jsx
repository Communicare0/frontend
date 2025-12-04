import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
    const auth = useAuth();
    const user = auth?.user;

    if(user) {
        return <Navigate to="/" replace />;
    }

    return children;
}