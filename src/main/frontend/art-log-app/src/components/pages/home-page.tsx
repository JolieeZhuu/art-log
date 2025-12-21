// Internal imports
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen justify-center items-center place-content-center">
            <div className="bg-gray-200 p-50 space-y-10 rounded-md">
                <p className="text-6xl">Welcome to Art Log</p>
                <div className="flex gap-4 justify-center mt-4">
                    <Button onClick={() => navigate('/signup')} variant="outline">Go to Signup</Button>
                    <Button onClick={() => navigate('/login')} variant="outline">Go to Login</Button>
                </div>
            </div>
        </div>
    )
};
