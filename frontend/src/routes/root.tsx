import { UserCircle } from "@phosphor-icons/react";
import React from "react";
import { NavLink, Outlet } from "react-router";
import Notice from "../components/Notice";
import { useNotice } from "../NoticeContext";

export default function Root() {
    const notice = useNotice();
    return (
        <>
        <div className="w-full min-h-screen bg-slate-900 text-slate-50">
            <nav className="p-3 bg-slate-600 w-full sticky flex justify-between top-0">
                    <h1 className="text-2xl font-bold">Molblium Software</h1>
                    <NavLink to="user">
                        <UserCircle size={32} />
                    </NavLink>
            </nav>
            {notice.visibility && (
                <Notice message={notice.message} severity={notice.severity} />
            )} 
            <div className="px-2 pb-2 md:container mx-auto">
                <Outlet />
            </div>
        </div>
        </>
    )
}