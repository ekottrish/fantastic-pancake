

"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAppContext();
    const location = useLocation();

    const getNavItems = (role: UserRole | null | undefined) => {
        const baseItems = [
            { name: "Market", path: "/market" },
            { name: "Betting", path: "/betting" },
            { name: "Leaderboards", path: "/leaderboards" },
        ];
        
        const publicItems = [
            { name: "Leaderboards", path: "/leaderboards" },
            { name: "Analytics", path: "/analytics" },
        ]

        if (!role) {
            return [{ name: "Home", path: "/" }, ...publicItems];
        }

        switch (role) {
            case 'Admin':
                return [
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Leaderboards", path: "/leaderboards" },
                    { name: "Admin", path: "/admin" },
                ];
            case 'Player':
            case 'Manager':
                 return [
                    { name: "Dashboard", path: "/dashboard" },
                    ...baseItems,
                    { name: "Pick Team", path: "/pick-team" },
                    { name: "Analytics", path: "/analytics" },
                ];
            case 'Spectator':
                // Spectators can see everything a player can, including betting, but can't manage a team.
                return [
                    { name: "Dashboard", path: "/dashboard" },
                    ...baseItems,
                    { name: "Analytics", path: "/analytics" },
                ];
            default:
                return [{ name: "Home", path: "/" }];
        }
    }
    
    const navItems = getNavItems(user?.role);
    
    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-4 animate-fade-in-down">
            <div className="container mx-auto flex justify-between items-center bg-black/10 backdrop-blur-md rounded-full py-3 px-6 border border-white/10 shadow-lg">
                <Link to="/" className="text-xl font-bold text-white tracking-wider">
                    Kachra hi Khelega
                </Link>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link key={item.name} to={item.path} className={`text-neutral-200 hover:text-white transition-colors duration-300 ${location.pathname === item.path ? 'font-bold text-white' : ''}`}>
                            {item.name}
                        </Link>
                    ))}
                    {user ? (
                         <button onClick={handleLogout} className="bg-red-600/50 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition duration-300">
                            Logout
                         </button>
                    ) : (
                         <Link to="/login" className="bg-accent/80 text-white font-semibold py-2 px-4 rounded-full hover:bg-accent transition duration-300">
                            Login
                         </Link>
                    )}
                </div>
                
                {/* Mobile Nav Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none p-2 -mr-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-2 container mx-auto">
                    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 space-y-2 border border-white/10">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block text-center text-neutral-200 hover:text-white transition-colors duration-300 py-2 rounded-lg ${location.pathname === item.path ? 'bg-white/10' : ''}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user ? (
                            <button onClick={handleLogout} className="w-full text-center bg-red-600/50 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 mt-2">
                                Logout
                            </button>
                        ) : (
                             <Link 
                                to="/login" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-center bg-accent/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-accent transition duration-300 mt-2"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
