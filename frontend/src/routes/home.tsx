import { NavLink } from "react-router";

export default function Home() {
    return (
        <div
            className="flex flex-col items-center justify-center h-full gap-6"
            style={{ minHeight: 'calc(100vh - 4rem - 0.25rem - 0.5rem)' }}
            //                        screen- nav  - loading - bottom padding           
        >
            <div>
                <h1 className="text-4xl">Welcome to Molblium</h1>
                <em>The worst forum board software ever created&trade;</em>
            </div>
            <NavLink to="/threads" className="px-8 py-5 bg-blue-600 rounded">Explore the community</NavLink>
        </div>
    )
}