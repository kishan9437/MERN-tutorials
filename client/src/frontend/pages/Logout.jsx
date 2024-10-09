import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Logout() {
    const {LogoutUser}=useAuth();
    useEffect(() => {
        LogoutUser();
    }, [LogoutUser])
    return (
        <>
            <Navigate to={'/login'}></Navigate>
        </>
    )
}
