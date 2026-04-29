import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
// @ts-ignore
import { auth } from "@/firebase/config";
interface AuthContextType {
    user: User | null | undefined;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading: user === undefined }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);