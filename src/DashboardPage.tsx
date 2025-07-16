


import React from 'react';
import { useAppContext } from './AppContext';
import { Player, Position } from './types';
import { POINTS_STRUCTURE, EMPTY_TEAM } from './constants';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const PlayerRow = ({ player, isCaptain, isBenched }: { player: Player, isCaptain: boolean, isBenched: boolean }) => (
    <div className={`flex items-center justify-between p-3 bg-background-dark/50 rounded-lg ${isBenched ? 'opacity-60' : ''}`}>
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center font-bold text-white ${player.position === Position.FWD ? 'bg-red-500' : player.position === Position.MID ? 'bg-green-500' : player.position === Position.DEF ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                {player.position.slice(0,1)}
            </div>
            <div>
                <p className="font-bold text-white">{player.name}</p>
                <p className="text-sm text-light-gray">{player.team_name}</p>
            </div>
        </div>
        <div className="text-right">
             <p className="font-bold text-white text-lg">{player.points} pts</p>
             {isCaptain && <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">Captain</span>}
             {isBenched && <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">Bench</span>}
        </div>
    </div>
);

const DashboardPage = () => {
    const { user, budget, teamValue } = useAppContext();

    if (!user) return null;
    
    // Use a safe fallback for the user's team to prevent crashes.
    const safeTeam = user.team ?? EMPTY_TEAM;

    const calculateTotalPoints = () => {
        let total = 0;
        
        safeTeam.starters.forEach(p => {
            if (p) { // Guard against null players in array
                total += (p.id === safeTeam.captain_id ? p.points * 2 : p.points);
            }
        });
        
        safeTeam.bench.forEach(p => {
             if (p) { // Guard against null players in array
                total += Math.floor(p.points / 2);
             }
        });
        
        return total;
    }

    const totalPoints = calculateTotalPoints();

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Welcome, {user.username} ({user.role})</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-light-gray mb-2">Total Points</h2>
                    <p className="text-4xl font-bold text-white">{totalPoints}</p>
                </Card>
                <Card>
                    <h2 className="text-lg font-semibold text-light-gray mb-2">Remaining Budget</h2>
                    <p className="text-4xl font-bold text-white">${(budget / 1_000_000).toFixed(2)}M</p>
                </Card>
                <Card>
                    <h2 className="text-lg font-semibold text-light-gray mb-2">Team Value</h2>
                    <p className="text-4xl font-bold text-white">${(teamValue / 1_000_000).toFixed(2)}M</p>
                </Card>
                <Card>
                    <h2 className="text-lg font-semibold text-light-gray mb-2">Za Balance</h2>
                    <p className="text-4xl font-bold text-white">{user.za_balance} Za</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-2xl font-bold text-white mb-4">My Team</h2>
                {safeTeam.starters.length + safeTeam.bench.length > 0 ? (
                    <div className="space-y-3">
                        <h3 className="text-lg text-accent font-bold">Starters</h3>
                        {safeTeam.starters.map(player => (
                            <PlayerRow key={player.id} player={player} isCaptain={safeTeam.captain_id === player.id} isBenched={false} />
                        ))}
                         <h3 className="text-lg text-accent font-bold mt-4">Bench</h3>
                         {safeTeam.bench.map(player => (
                            <PlayerRow key={player.id} player={player} isCaptain={false} isBenched={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-light-gray">Your team is empty.</p>
                        <p className="text-light-gray">Visit the Market to start building your squad!</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DashboardPage;