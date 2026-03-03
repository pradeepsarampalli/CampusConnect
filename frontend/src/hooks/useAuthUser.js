import { useEffect, useState } from "react";

export function useAuthUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    async function fetchUser() {
        try {
            const res = await fetch("http://localhost:3001/api/auth/me", {credentials: "include"});
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
        setLoading(false);
    }
    fetchUser();
}, []);
    return { user, loading };
}