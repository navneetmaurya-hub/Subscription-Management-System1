import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafafa]">
            <h1 className="text-6xl font-black text-gray-900">404</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                The requested page or resource could not be found.
            </p>
            <div className="mt-6">
                <Link to="/">
                    <Button>Return to App</Button>
                </Link>
            </div>
        </div>
    );
}

