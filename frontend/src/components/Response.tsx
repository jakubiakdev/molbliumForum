import { CheckCircle, Warning, WarningCircle } from "@phosphor-icons/react";

export default function Response({ message, severity }: { message: string, severity: "error" | "warning" | "info" | "success" }) {
    // TODO: Maybe change the name of this component
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
                {severity === "info" && <WarningCircle size={32} />}
                {severity === "success" && <CheckCircle size={32} />}
            </div>
            <span className="w-full">{message}</span>
        </div>
    )
}