import { createContext, useContext, useMemo, useState, useRef } from "react";

interface NoticeContextType {
    visibility: boolean
    message: string
    severity: "error" | "warning" | "info" | "success"
    setMessage: (message: string, severity: "error" | "warning" | "info" | "success", duration: number) => void
}

export const NoticeContext = createContext<NoticeContextType>({
    visibility: false,
    message: '',
    severity: 'info',
    setMessage: () => {}
});

const NoticeProvider = ({ children }: { children: any }) => {
    const [content, setContent] = useState('');
    const [severity, setSeverity] = useState<"error" | "warning" | "info" | "success">('info');
    const [visibility, setVisibility] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const setMessage = (message: string, severity: "error" | "warning" | "info" | "success", duration: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setVisibility(true);
        setContent(message);
        setSeverity(severity);
        
        timeoutRef.current = setTimeout(() => {
            setVisibility(false);
        }, duration);
    }

    const contextValue = useMemo(
        () => ({
            visibility,
            message: content,
            severity,
            setMessage
        }),
        [visibility, content, severity]
    );

    return (
        <NoticeContext.Provider value={contextValue}>
            {children}
        </NoticeContext.Provider>
    );
};

export const useNotice = () => {
    return useContext(NoticeContext);
};

export default NoticeProvider;