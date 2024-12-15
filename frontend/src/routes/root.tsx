import { UserCircle } from "@phosphor-icons/react";
import { NavLink, Outlet } from "react-router";
import Notice from "../components/Notice";
import { useNotice } from "../NoticeContext";
import { useAuth } from "../AuthContext";
import { useIsFetching } from "@tanstack/react-query";
import styles from './root.module.css'

export default function Root() {
    const notice = useNotice();
    const user = useAuth();

    const isFetching = useIsFetching()

    return (
        <>
        <div className="w-full min-h-screen bg-slate-900 text-slate-50">
            <nav className="px-2 bg-slate-600 w-full sticky flex top-0 items-center gap-2">
                    <h1 className="text-2xl font-bold border-b-4 border-transparent">Molblium Software</h1>
                    <NavLink to="/" className="flex items-center gap-2 border-b-4 border-transparent aria-[current=page]:border-white h-16">Home</NavLink>
                    <NavLink to="threads" className="flex items-center gap-2 border-b-4 border-transparent aria-[current=page]:border-white h-16">Threads</NavLink>
                    <NavLink to="user" className="flex items-center gap-2 ml-auto bg-slate-500 py-1 px-2 rounded border-b-4 border-transparent">
                        {user?.getToken() ? `Hi ${user?.user?.displayName}` : ''}
                        <UserCircle size={32} />
                    </NavLink>
            </nav>
            <div className={`${isFetching ? styles.loadingBar : "h-1"}`}>
            </div>
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