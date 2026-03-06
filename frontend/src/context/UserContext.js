import { createContext, useEffect, useState } from "react";

export const Context = createContext();

export function UserContext({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("http://localhost:3001/api/auth/me", {
                    credentials: "include"
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <Context.Provider value={{ user, setUser, loading }}>
            {children}
        </Context.Provider>
    );
}