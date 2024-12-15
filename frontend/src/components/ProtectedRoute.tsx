import React, { ReactNode, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
      if(!auth?.getToken()) navigate('/login', { state: { redirectAfter: location ,message: 'You need to be logged in to view this page.', severity: 'warning' } });
    }, [auth, location, navigate]);
    return <>{children}</>;
}