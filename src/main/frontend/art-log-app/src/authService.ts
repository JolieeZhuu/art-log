import axios from "axios";

const authService = {
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await axios('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: credentials,
            });

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                return { success: true };
            } else {
                const errorData = response.data;
                return { success: false, message: errorData.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'An error occurred during login' };
        }
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    getToken: () => {
        return localStorage.getItem('token');
    },
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        return true;
        /*
        // check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }*/
    },
}

export default authService;