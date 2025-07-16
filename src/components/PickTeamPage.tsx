

import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Player, Position } from '@/types';
import { MAX_STARTERS, MAX_BENCH, EMPTY_TEAM } from '@/constants';

// A generic card component for consistent styling
const Card = ({ children, title, className = '' }: { children: React.ReactNode, title: string, className?: string }) => (
    <div className={`bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm w-full ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        {children}
    </div>
);

// Component for individual player display in the management view
const PlayerChip = ({ player, isCaptain, onAction, actionLabel, actionIcon, onCaptain, captainLabel, captainIcon, transfersEnabled }: {
    player: Player;
    isCaptain?: boolean;
    onAction: () => void;
    actionLabel: string;
    actionIcon: React.ReactNode;
    onCaptain?: () => void;
    captainLabel?: string;
    captainIcon?: React.ReactNode;
    transfersEnabled: boolean;
}) => (
    <div className={`p-4 bg-background-dark/50 rounded-lg flex items-center justify-between transition-all duration-300 ${isCaptain ? 'ring-2 ring-accent' : ''}`}>
        <div className="flex items-center">
             <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center font-bold text-white ${player.position === Position.FWD ? 'bg-red-500' : player.position === Position.MID ? 'bg-green-500' : player.position === Position.DEF ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                {player.position.slice(0,1)}
            </div>
            <div>
                <p className="font-bold text-white">{player.name} {isCaptain && <span className="text-accent">(C)</span>}</p>
                <p className="text-sm text-light-gray">{player.team_name}</p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            {onCaptain && captainIcon && captainLabel && (
                <button onClick={onCaptain} disabled={!transfersEnabled || isCaptain} title={captainLabel} className="p-2 rounded-full bg-dark-gray hover:bg-accent/80 text-white transition disabled:cursor-not-allowed disabled:opacity-50">
                    {captainIcon}
                </button>
            )}
            <button onClick={onAction} disabled={!transfersEnabled} title={actionLabel} className="p-2 rounded-full bg-dark-gray hover:bg-blue-600 text-white transition disabled:cursor-not-allowed disabled:opacity-50">
                {actionIcon}
            </button>
        </div>
    </div>
);


const PickTeamPage = () => {
    const { user, moveToStarters, moveToBench, setCaptain, teamValue, budget, transfersEnabled } = useAppContext();
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    if (!user) return null;

    const safeTeam = user.team ?? EMPTY_TEAM;
    const { starters, bench, captain_id } = safeTeam;
    const allPlayersCount = starters.length + bench.length;
    
    const handleSaveTeam = () => {
        setFeedback(null); // Reset feedback on new attempt

        if (starters.length !== MAX_STARTERS) {
            setFeedback({ type: 'error', message: `Your team must have exactly ${MAX_STARTERS} starters. You currently have ${starters.length}.` });
            return;
        }

        if (bench.length !== MAX_BENCH) {
            setFeedback({ type: 'error', message: `Your team must have exactly ${MAX_BENCH} players on the bench. You currently have ${bench.length}.` });
            return;
        }

        if (!captain_id) {
            setFeedback({ type: 'error', message: 'You must select a captain for your team.' });
            return;
        }
        
        // All checks passed
        setFeedback({ type: 'success', message: 'Team saved! Your formation is valid.' });
        setTimeout(() => setFeedback(null), 5000); // Optional: hide after 5s
    };

    if (allPlayersCount === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-white mb-4">Your Squad is Empty</h1>
                <p className="text-light-gray mb-8">You need to buy players before you can pick your team.</p>
                <Link to="/market" className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
                    Go to the Market
                </Link>
            </div>
        );
    }
    
    const budgetExceeded = budget < 0;

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Manage Your Squad</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                 <div className={`bg-primary-deep/50 p-3 rounded-xl transition-all ${starters.length !== MAX_STARTERS ? 'ring-2 ring-yellow-500' : ''}`}>
                    <div className="text-light-gray text-sm">Starters</div>
                    <div className="text-white font-bold text-2xl">{starters.length}/{MAX_STARTERS}</div>
                </div>
                 <div className={`bg-primary-deep/50 p-3 rounded-xl transition-all ${bench.length !== MAX_BENCH ? 'ring-2 ring-yellow-500' : ''}`}>
                    <div className="text-light-gray text-sm">Bench</div>
                    <div className="text-white font-bold text-2xl">{bench.length}/{MAX_BENCH}</div>
                </div>
                <div className="bg-primary-deep/50 p-3 rounded-xl">
                    <div className="text-light-gray text-sm">Team Value</div>
                    <div className="text-white font-bold text-2xl">${(teamValue / 1_000_000).toFixed(1)}M</div>
                </div>
                <div className={`bg-primary-deep/50 p-3 rounded-xl ${budgetExceeded ? 'bg-red-900/50' : ''}`}>
                    <div className={`text-sm ${budgetExceeded ? 'text-red-400' : 'text-light-gray'}`}>Budget Left</div>
                    <div className={`font-bold text-2xl ${budgetExceeded ? 'text-red-300' : 'text-white'}`}>${(budget / 1_000_000).toFixed(1)}M</div>
                </div>
            </div>

            {!transfersEnabled && (
                <div className="p-3 text-center bg-yellow-500/20 text-yellow-300 rounded-lg">
                    Transfers are currently disabled by the admin. You cannot change your team.
                </div>
            )}
             {budgetExceeded && (
                <div className="p-3 text-center bg-red-500/20 text-red-300 rounded-lg">
                    Your team is over budget. You must sell players in the Market to fix this.
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Starters">
                    {starters.length > 0 ? (
                        <div className="space-y-3">
                            {starters.map(player => (
                                <PlayerChip 
                                    key={player.id}
                                    player={player}
                                    isCaptain={player.id === captain_id}
                                    onAction={() => moveToBench(player.id)}
                                    actionLabel="Move to Bench"
                                    actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L10 4.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" /><path d="M10 18a1 1 0 01-1-1v-8a1 1 0 112 0v8a1 1 0 01-1 1z" /></svg>}
                                    onCaptain={() => setCaptain(player.id)}
                                    captainLabel="Make Captain"
                                    captainIcon={<span className="font-bold text-sm">C</span>}
                                    transfersEnabled={transfersEnabled}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light-gray py-8">No starters selected. Move players from your bench.</p>
                    )}
                </Card>

                <Card title="Bench">
                     {bench.length > 0 ? (
                        <div className="space-y-3">
                            {bench.map(player => (
                                <PlayerChip
                                    key={player.id}
                                    player={player}
                                    onAction={() => moveToStarters(player.id)}
                                    actionLabel="Move to Starters"
                                    actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.293 17.707a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 15.586 4.707 10.293a1 1 0 00-1.414 1.414l7 7z" /><path d="M10 2a1 1 0 011 1v8a1 1 0 11-2 0V3a1 1 0 011-1z" /></svg>}
                                    transfersEnabled={transfersEnabled}
                                />
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-light-gray py-8">Your bench is empty.</p>
                    )}
                </Card>
            </div>

            {/* Save Button and Feedback Section */}
            <div className="mt-6 space-y-4">
                {feedback && (
                    <div className={`p-4 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {feedback.message}
                    </div>
                )}
                <div className="flex justify-center">
                    <button
                        onClick={handleSaveTeam}
                        disabled={!transfersEnabled}
                        className="bg-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 disabled:bg-dark-gray disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        Save FPL Team
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PickTeamPage;