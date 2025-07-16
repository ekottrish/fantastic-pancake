import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const HomePage = () => {
    const { user } = useAppContext();

    return (
        // The main container for the homepage, with a gradient background
        // It fills the screen and centers its content, with padding top for the navbar
        <div className="min-h-screen w-full bg-gradient-to-br from-primary-deep via-background-dark to-zinc-900 text-white flex flex-col items-center justify-center text-center p-4 pt-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex flex-col items-center"
            >
                <h1 className="font-doto text-7xl md:text-9xl font-bold tracking-wider mb-4">
                    Kachra hi Khelega
                </h1>
                <p className="text-3xl md:text-5xl font-display font-bold text-accent mb-12">
                    Season 1
                </p>
                <p className="text-lg md:text-xl text-light-gray max-w-2xl mb-12">
                    The ultimate fantasy football and betting experience for the chosen few. Build your squad, place your bets, and claim your glory.
                </p>
                
                <Link 
                    to={user ? "/dashboard" : "/login"} 
                    className="bg-accent text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 text-lg"
                >
                   {user ? 'Go to Dashboard' : 'Enter the Arena'}
                </Link>
            </motion.div>
        </div>
    );
};
