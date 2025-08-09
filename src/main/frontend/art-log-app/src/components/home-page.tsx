// Internal imports
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function HomePage() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <div className="flex gap-4">
                <Button onClick={() => navigate('/signup')}>Go to Signup</Button>
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </div>
        </div>
    )
};
