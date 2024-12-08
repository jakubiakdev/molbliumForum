import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
      if(!auth?.getToken()) navigate('/login'); // TODO: maybe an auth state?
    }, [auth, navigate]);
    return <>{children}</>;
}