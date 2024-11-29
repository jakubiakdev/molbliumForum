import { UserCircle } from "@phosphor-icons/react";
import React from "react";
import { NavLink, Outlet } from "react-router";

export default function Root() {
    return (
        <>
        <div className="w-full min-h-screen bg-slate-900 text-slate-50">
            <nav className="p-3 bg-slate-600 w-full sticky flex justify-between">
                    <h1 className="text-2xl font-bold">Molblium Software</h1>
                    <NavLink to="user">
                        <UserCircle size={32} />
                    </NavLink>
            </nav>
            <div className="md:p-5 md:container mx-auto">
                <Outlet />
            </div>
        </div>
        </>
    )
}