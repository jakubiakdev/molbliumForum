import { NavLink } from "react-router";

export default function Error() {
    return (
        <div className="py-8 flex flex-col items-center gap-8">
            <h2 className="text-2xl">The page you were trying to find does not exist</h2>
            <NavLink to="/" className="bg-slate-800 hover:bg-blue-900 font-semibold shadow transition-all duration-200 py-3 px-5 w-fit rounded-sm">Go back</NavLink>
        </div>
    )
}