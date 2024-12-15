import { useAuth } from "../AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function User() {
    const user = useAuth();
    return (
        <ProtectedRoute>
            <div className="text-center py-5">
                <h1 className="text-xl">Hello {user?.user?.displayName} <span className="text-gray-500">({user?.user?.username})</span></h1>
                <button 
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => {
                    user?.logout();
                }}>Log me out</button>
            </div>
        </ProtectedRoute>
    )
}