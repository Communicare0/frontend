import { Outlet, Link } from "react-router-dom";

export default function App() {
    return (
        <div>
            <nav style={{ display: "flex", gap: 12 }}>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
            <Outlet />
        </div>
    );
}