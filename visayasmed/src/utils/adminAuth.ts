// Admin authentication utilities
export const adminAuth = {
    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("adminToken");
    },

    // Get admin token
    getToken: (): string | null => {
        return localStorage.getItem("adminToken");
    },

    // Get admin email
    getAdminEmail: (): string | null => {
        return localStorage.getItem("adminEmail");
    },

    // Logout
    logout: (): void => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
    },

    // Verify token
    verifyToken: (token: string): boolean => {
        // This would typically be done server-side
        return token === localStorage.getItem("adminToken");
    }
};
