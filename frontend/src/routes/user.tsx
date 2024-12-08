import { useAuth } from "../AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function User() {
    const user = useAuth();
    return (
        <ProtectedRoute>
            <h1>User profile!</h1>
            <p>Yo token: {user!.getToken()}</p>
            <p>Yo user {JSON.stringify(user?.user)}</p>
            <button onClick={() => {
                user?.logout();
            }}>log out plez</button>
        </ProtectedRoute>
    )
}