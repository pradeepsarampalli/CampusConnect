const PRIMARY_KEY = "user";
const LEGACY_KEY = "campusconnect:user";

export function getCurrentUser() {
    if (typeof window === "undefined") return null;
    try {
        const rawPrimary = window.localStorage.getItem(PRIMARY_KEY);
        const rawLegacy = window.localStorage.getItem(LEGACY_KEY);
        const raw = rawPrimary || rawLegacy;
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setCurrentUser(user) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(PRIMARY_KEY, JSON.stringify(user));
    } catch {
        // ignore storage errors
    }
}

export function clearCurrentUser() {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(PRIMARY_KEY);
    } catch {
        // ignore storage errors
    }
}

