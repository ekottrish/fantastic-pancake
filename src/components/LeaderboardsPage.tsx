

import { useMemo } from 'react';
import { LeaderboardEntry, BettingLeaderboardEntry, TeamStanding, User, Bet } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { EMPTY_TEAM } from '@/constants';

const Card = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm w-full">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        {children}
    </div>
);

const FantasyLeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => (
    <div className="flex items-center p-3 bg-background-dark/50 rounded-lg transition-colors hover:bg-background-dark/80">
        <span className="w-10 text-xl font-bold text-light-gray text-center">{entry.rank}</span>
        <div className="flex-1 ml-4">
            <p className="font-bold text-white">{`Team ${entry.manager_name}`}</p>
            <p className="text-sm text-light-gray">{entry.manager_name}</p>
        </div>
        <div className="text-xl font-bold text-accent">
            {entry.total_points} pts
        </div>
    </div>
);

const BettingLeaderboardRow = ({ entry }: { entry: BettingLeaderboardEntry }) => (
     <div className="flex items-center p-3 bg-background-dark/50 rounded-lg transition-colors hover:bg-background-dark/80">
        <span className="w-10 text-xl font-bold text-light-gray text-center">{entry.rank}</span>
        <div className="flex-1 ml-4">
            <p className="font-bold text-white">{entry.manager_name}</p>
            <p className="text-sm text-light-gray">Biggest Win: {entry.biggest_win.toFixed(2)} Za</p>
        </div>
        <div className="text-xl font-bold text-green-400">
            {entry.za_balance.toFixed(2)} Za
        </div>
    </div>
);

const StandingsRow = ({ standing, rank }: { standing: TeamStanding, rank: number }) => (
    <tr className="border-b border-dark-gray/50 hover:bg-background-dark/50">
        <td className="p-3 text-center font-bold">{rank}</td>
        <td className="p-3 font-bold text-white">{standing.team_name}</td>
        <td className="p-3 text-center">{standing.played}</td>
        <td className="p-3 text-center">{standing.wins}</td>
        <td className="p-3 text-center">{standing.draws}</td>
        <td className="p-3 text-center">{standing.losses}</td>
        <td className="p-3 text-center font-bold text-accent">{standing.points}</td>
    </tr>
)

const LeaderboardsPage = () => {
    const { users, bets, standings } = useAppContext();

    const fantasyLeaderboard = useMemo((): LeaderboardEntry[] => {
        return users
            .map(user => {
                let totalPoints = 0;
                const safeTeam = user.team ?? EMPTY_TEAM; // Guard against null team
                
                safeTeam.starters.forEach(p => {
                    if (p) { // Guard against null players in array
                        totalPoints += (p.id === safeTeam.captain_id ? p.points * 2 : p.points);
                    }
                });
                 safeTeam.bench.forEach(p => {
                    if (p) { // Guard against null players in array
                        totalPoints += Math.floor(p.points / 2);
                    }
                });

                return {
                    manager_name: user.username,
                    total_points: totalPoints,
                };
            })
            .sort((a, b) => b.total_points - a.total_points)
            .slice(0, 10)
            .map((u, index) => ({
                ...u,
                rank: index + 1,
                team_name: `Team ${u.manager_name}`
            }));
    }, [users]);

    const bettingLeaderboard = useMemo((): BettingLeaderboardEntry[] => {
         const userBiggestWins = users.reduce((acc, user) => {
            const userWonBets = bets.filter(bet => bet.user_id === user.id && bet.status === 'won');
            const biggestWin = userWonBets.reduce((max, bet) => Math.max(max, bet.potential_return), 0);
            acc[user.id] = biggestWin;
            return acc;
        }, {} as Record<number, number>);

        return users
            .map(user => ({
                manager_name: user.username,
                za_balance: user.za_balance,
                biggest_win: userBiggestWins[user.id] || 0,
            }))
            .sort((a, b) => b.za_balance - a.za_balance)
            .slice(0, 10)
            .map((u, index) => ({
                ...u,
                rank: index + 1,
            }));
    }, [users, bets]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Leaderboards</h1>
            
            <Card title="League Standings">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-light-gray">
                        <thead className="bg-background-dark/80 text-sm uppercase">
                            <tr>
                                <th className="p-3 text-center">#</th>
                                <th className="p-3">Team</th>
                                <th className="p-3 text-center">P</th>
                                <th className="p-3 text-center">W</th>
                                <th className="p-3 text-center">D</th>
                                <th className="p-3 text-center">L</th>
                                <th className="p-3 text-center">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((s, i) => <StandingsRow key={s.team_name} standing={s} rank={i+1} />)}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex flex-col lg:flex-row gap-8">
                <Card title="Fantasy League Standings">
                    <div className="space-y-3">
                        {fantasyLeaderboard.map(entry => (
                            <FantasyLeaderboardRow key={entry.rank} entry={entry} />
                        ))}
                    </div>
                </Card>
                <Card title="Betting Rich List">
                    <div className="space-y-3">
                        {bettingLeaderboard.map(entry => (
                            <BettingLeaderboardRow key={entry.rank} entry={entry} />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LeaderboardsPage;