

import React, { useMemo } from 'react';
import { useAppContext } from './AppContext';
import { Player } from './types';

const Card = ({ children, title, className = '' }: { children: React.ReactNode, title: string, className?: string }) => (
    <div className={`bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm w-full ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="overflow-x-auto">
            {children}
        </div>
    </div>
);

const AnalyticsTableRow = ({ player, stat, statLabel }: { player: Player, stat: string | number, statLabel: string }) => (
    <tr className="border-b border-dark-gray/50">
        <td className="p-3">
            <p className="font-bold text-white">{player.name}</p>
            <p className="text-sm text-light-gray">{player.team_name}</p>
        </td>
        <td className="p-3 text-right">
            <p className="font-bold text-accent text-lg">{stat}</p>
            <p className="text-sm text-dark-gray">{statLabel}</p>
        </td>
    </tr>
)

const AnalyticsPage = () => {
    const { players, user } = useAppContext();

    const topPointsPlayers = useMemo(() => {
        return [...players].sort((a, b) => b.points - a.points).slice(0, 10);
    }, [players]);

    const valuePlayers = useMemo(() => {
        return [...players]
            .map(p => ({ ...p, ratio: p.price > 0 ? p.points / (p.price / 1_000_000) : 0 }))
            .sort((a, b) => b.ratio - a.ratio)
            .slice(0, 10);
    }, [players]);
    
    const transferInPlayers = useMemo(() => {
        return [...players].sort((a, b) => b.transfers_in - a.transfers_in).slice(0, 10);
    }, [players]);
    
    const transferOutPlayers = useMemo(() => {
        return [...players].sort((a, b) => b.transfers_out - a.transfers_out).slice(0, 10);
    }, [players]);

    // This is mock data as captaincy is not tracked per player globally
    const mostCaptainedPlayers = useMemo(() => {
        return [...players].sort((a, b) => (b.price + b.points) - (a.price + a.points)).slice(0,5);
    }, [players]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Platform Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <Card title="Top Points Scorers">
                    <table className="w-full">
                        <tbody>
                        {topPointsPlayers.map(p => (
                            <AnalyticsTableRow key={p.id} player={p} stat={p.points} statLabel="Points" />
                        ))}
                        </tbody>
                    </table>
                </Card>

                <Card title="Best Value (Points per Million)">
                     <table className="w-full">
                        <tbody>
                        {valuePlayers.map(p => (
                            <AnalyticsTableRow key={p.id} player={p} stat={(p as any).ratio.toFixed(2)} statLabel="Pts/M" />
                        ))}
                        </tbody>
                    </table>
                </Card>
                
                 <Card title="Most Transferred In">
                     <table className="w-full">
                        <tbody>
                        {transferInPlayers.map(p => (
                            <AnalyticsTableRow key={p.id} player={p} stat={p.transfers_in} statLabel="Transfers In" />
                        ))}
                        </tbody>
                    </table>
                </Card>

                 <Card title="Most Transferred Out">
                     <table className="w-full">
                        <tbody>
                        {transferOutPlayers.map(p => (
                            <AnalyticsTableRow key={p.id} player={p} stat={p.transfers_out} statLabel="Transfers Out" />
                        ))}
                        </tbody>
                    </table>
                </Card>
                
                 <Card title="Most Captained Players" className="lg:col-span-2">
                     <table className="w-full">
                        <tbody>
                        {mostCaptainedPlayers.map(p => (
                            <AnalyticsTableRow key={p.id} player={p} stat={"~" + (p.transfers_in + p.transfers_out)%20 + " times"} statLabel="Captained (demo)" />
                        ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
