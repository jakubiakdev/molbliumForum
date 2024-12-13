import { ReactNode } from "react";

export default function FloatingActionButton({ onClick, children }: { onClick: () => void, children: ReactNode }) {
    return (
        <button onClick={onClick} className="fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600">
            {children}
        </button>
    )
}