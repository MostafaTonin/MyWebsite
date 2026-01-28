import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
            <p className="text-muted-foreground mt-4 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
