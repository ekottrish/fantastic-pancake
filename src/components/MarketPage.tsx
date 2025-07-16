

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Player, Position } from '../types';
import { MAX_TEAM_SIZE, MAX_PLAYERS_PER_TEAM, EMPTY_TEAM } from '../constants';

const PlayerCard = ({ player, onBuy, onSell, inTeam, isTeamFull, canAfford, transfersEnabled, hasTooManyFromTeam }: { player: Player, onBuy: (p: Player) => void, onSell: (p: Player) => void, inTeam: boolean, isTeamFull: boolean, canAfford: boolean, transfersEnabled: boolean, hasTooManyFromTeam: boolean }) => (
    <div className="bg-primary-deep/60 p-4 rounded-lg shadow-lg flex flex-col justify-between transition-all duration-300 hover:scale-105">
        <div>
            <div className="flex justify-between items-start">
                <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${player.position === Position.FWD ? 'bg-red-500' : player.position === Position.MID ? 'bg-green-500' : player.position === Position.DEF ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                    {player.position}
                </span>
                <p className="text-xl font-bold text-white">${(player.price / 1_000_000).toFixed(1)}M</p>
            </div>
            <h3 className="text-lg font-bold mt-2 text-white">{player.name}</h3>
            <p className="text-sm text-light-gray">{player.team_name}</p>
            <p className="text-sm text-light-gray mt-1">Points: {player.points}</p>
        </div>
        <div className="mt-4">
            {inTeam ? (
                <button onClick={() => onSell(player)} disabled={!transfersEnabled} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-dark-gray disabled:cursor-not-allowed">
                    Sell
                </button>
            ) : (
                <button onClick={() => onBuy(player)} disabled={isTeamFull || !canAfford || !transfersEnabled || hasTooManyFromTeam} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-dark-gray disabled:cursor-not-allowed">
                    {!transfersEnabled ? 'Transfers Closed' : isTeamFull ? 'Team Full' : hasTooManyFromTeam ? 'Team Limit Met' : !canAfford ? 'Too Expensive' : 'Buy'}
                </button>
            )}
        </div>
    </div>
);

const MyTeamPanel = () => {
    const { user, sellPlayer, teamValue, budget, transfersEnabled } = useAppContext();
    const navigate = useNavigate();
    if (!user) return null;

    const safeTeam = user.team ?? EMPTY_TEAM;
    const allPlayers = [...safeTeam.starters, ...safeTeam.bench];
    const budgetExceeded = budget < 0;

    useEffect(() => {
        if (budgetExceeded) {
            alert("Budget exceeded. Please readjust team and get cheaper kachras.");
        }
    }, [budgetExceeded]);

    return (
        <div className="w-full lg:w-1/3 xl:w-1/4 p-4 bg-primary-deep/50 rounded-xl shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-white">Your Squad ({allPlayers.length}/{MAX_TEAM_SIZE})</h2>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-light-gray"><span>Team Value:</span> <span className="font-bold text-white">${(teamValue / 1_000_000).toFixed(1)}M</span></div>
                <div className={`flex justify-between text-light-gray ${budgetExceeded ? 'text-red-500' : ''}`}>
                    <span>Budget Left:</span> 
                    <span className="font-bold">${(budget / 1_000_000).toFixed(1)}M</span>
                </div>
            </div>

            {!transfersEnabled && (
                <div className="p-3 text-center bg-yellow-500/20 text-yellow-300 rounded-lg mb-4">
                    Transfers are currently disabled by the admin.
                </div>
            )}
            
            <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                {allPlayers.length > 0 ? allPlayers.map(player => (
                    <div key={player.id} className="p-3 bg-background-dark/50 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">{player.name}</p>
                            <p className="text-xs text-light-gray">{player.position}</p>
                        </div>
                        <button onClick={() => sellPlayer(player)} disabled={!transfersEnabled} title="Sell Player" className="w-7 h-7 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg disabled:cursor-not-allowed">
                            &times;
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-8 text-light-gray">
                        <p>Your squad is empty.</p>
                        <p>Buy players from the market.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-4">
                 <button 
                    onClick={() => navigate('/pick-team')} 
                    className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 disabled:bg-dark-gray disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={allPlayers.length === 0 || !transfersEnabled}
                >
                    Confirm Transfers & Pick Team
                </button>
            </div>
        </div>
    );
};


export const MarketPage = () => {
    const { players, user, buyPlayer, sellPlayer, budget, transfersEnabled } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState<Position | 'all'>('all');
    const [sort, setSort] = useState('price_desc');
    
    const safeTeam = useMemo(() => user?.team ?? EMPTY_TEAM, [user]);

    const teamPlayerIds = useMemo(() => {
        if (!user) return new Set<number>();
        return new Set([...safeTeam.starters.map(p => p.id), ...safeTeam.bench.map(p => p.id)]);
    }, [user, safeTeam]);

    const teamCounts = useMemo(() => {
        if (!user) return new Map<string, number>();
        const counts = new Map<string, number>();
        [...safeTeam.starters, ...safeTeam.bench].forEach(p => {
            counts.set(p.team_name, (counts.get(p.team_name) || 0) + 1);
        });
        return counts;
    }, [user, safeTeam]);

    const filteredAndSortedPlayers = useMemo(() => {
        return players
            .filter(player => {
                const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
                const positionMatch = positionFilter === 'all' || player.position === positionFilter;
                return nameMatch && positionMatch;
            })
            .sort((a, b) => {
                switch (sort) {
                    case 'price_asc': return a.price - b.price;
                    case 'price_desc': return b.price - a.price;
                    case 'points_desc': return b.points - a.points;
                    case 'name_asc': return a.name.localeCompare(b.name);
                    default: return 0;
                }
            });
    }, [players, searchTerm, positionFilter, sort]);

    if (!user) return null;
    
    const isTeamFull = safeTeam.starters.length + safeTeam.bench.length >= MAX_TEAM_SIZE;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4 text-white">Player Market</h1>
                <div className="p-4 bg-primary-deep/50 rounded-xl mb-6 flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search player..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-background-dark text-white placeholder-gray-400 rounded-lg px-4 py-2 border border-dark-gray focus:ring-accent focus:border-accent"
                    />
                    <select value={positionFilter} onChange={e => setPositionFilter(e.target.value as Position | 'all')} className="bg-background-dark text-white rounded-lg px-4 py-2 border border-dark-gray focus:ring-accent focus:border-accent">
                        <option value="all">All Positions</option>
                        {Object.values(Position).map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                     <select value={sort} onChange={e => setSort(e.target.value)} className="bg-background-dark text-white rounded-lg px-4 py-2 border border-dark-gray focus:ring-accent focus:border-accent">
                        <option value="price_desc">Price: High to Low</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="points_desc">Points: High to Low</option>
                        <option value="name_asc">Name: A-Z</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filteredAndSortedPlayers.map(player => {
                        const inTeam = teamPlayerIds.has(player.id);
                        const hasTooManyFromTeam = !inTeam && (teamCounts.get(player.team_name) || 0) >= MAX_PLAYERS_PER_TEAM;

                        return (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onBuy={buyPlayer}
                                onSell={sellPlayer}
                                inTeam={inTeam}
                                isTeamFull={isTeamFull}
                                canAfford={budget >= player.price}
                                transfersEnabled={transfersEnabled}
                                hasTooManyFromTeam={hasTooManyFromTeam}
                            />
                        );
                    })}
                </div>
            </div>
            <MyTeamPanel />
        </div>
    );
};