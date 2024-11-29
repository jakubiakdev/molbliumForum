import { NavLink } from "react-router";

export default function Home() {
    return (
        <div>
            <p>home page</p>
            <NavLink to="user">User</NavLink>
            <br />
            <NavLink to="login">Login</NavLink>
            <br />
            <NavLink to="threads">Threads</NavLink>
            </div>
    )
}