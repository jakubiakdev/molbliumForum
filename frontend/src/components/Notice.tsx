import { CheckCircle, Info, Warning, WarningCircle } from "@phosphor-icons/react";

export default function Notice({ message, severity }: { message: string, severity: "error" | "warning" | "info" | "success" }) {
    const bgColors = {
        error: "bg-red-600",
        warning: "bg-yellow-600",
        info: "bg-blue-600",
        success: "bg-green-600"
    };
    return (
        <div className={`p-2 rounded-sm flex items-center ${bgColors[severity]}`}>
            <div className="p-4">
                {severity === "error" && <Warning size={32} />}
                {severity === "warning" && <WarningCircle size={32} />}
                {severity === "info" && <Info size={32} />}
                {severity === "success" && <CheckCircle size={32} />}
            </div>
            <span className="w-full">{message}</span>
        </div>
    )
}