



import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bet, BetCategory, BettingMarket, BetOption, BetMarketType, Player } from '../types';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const BetRow = ({ bet }: { bet: Bet }) => {
    const statusColor = bet.status === 'won' ? 'text-green-400' : bet.status === 'lost' ? 'text-red-400' : 'text-yellow-400';
    return (
        <div className="p-4 bg-background-dark/50 rounded-lg flex flex-wrap justify-between items-center gap-4">
            <div>
                <p className="font-bold text-white">{bet.details}</p>
                <p className="text-sm text-light-gray">{bet.market_type}</p>
            </div>
            <div className="flex items-center space-x-6 text-center">
                <div>
                    <p className="text-xs text-light-gray">Amount</p>
                    <p className="font-bold text-white">{bet.amount} Za</p>
                </div>
                 <div>
                    <p className="text-xs text-light-gray">Odds</p>
                    <p className="font-bold text-white">@{bet.odds.toFixed(2)}</p>
                </div>
                 <div>
                    <p className="text-xs text-light-gray">Return</p>
                    <p className="font-bold text-white">{bet.potential_return.toFixed(2)} Za</p>
                </div>
                 <div>
                    <p className="text-xs text-light-gray">Status</p>
                    <p className={`font-bold capitalize ${statusColor}`}>{bet.status}</p>
                </div>
            </div>
        </div>
    );
}

const BetPlacementModal = ({ isOpen, onClose, onConfirm, marketOption, balance }: { isOpen: boolean, onClose: () => void, onConfirm: (amount: number) => void, marketOption: BetOption | null, balance: number }) => {
    const [amount, setAmount] = useState(10);

    if (!isOpen || !marketOption) return null;

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(amount);
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary-deep p-8 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-white mb-2">Place Bet</h3>
                <p className="text-light-gray mb-4">You are betting on: <span className="font-bold text-white">{marketOption.details}</span></p>
                <p className="text-accent text-lg font-bold mb-6">Odds: @{marketOption.odds.toFixed(2)}</p>
                <form onSubmit={handleConfirm}>
                    <label htmlFor="bet-amount" className="block text-sm font-medium text-light-gray mb-1">Bet Amount (Za)</label>
                    <input
                        id="bet-amount"
                        type="number"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        min="1"
                        max={balance}
                        className="w-full bg-background-dark text-white placeholder-gray-400 rounded-lg px-4 py-2 border border-dark-gray focus:ring-accent focus:border-accent"
                        required
                    />
                    <p className="text-light-gray mt-4">Potential Return: <span className="font-bold text-white">{(amount * marketOption.odds).toFixed(2)} Za</span></p>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-light-gray hover:bg-dark-gray transition">Cancel</button>
                        <button type="submit" disabled={amount > balance || amount <= 0} className="px-6 py-2 rounded-lg bg-accent text-white font-bold hover:bg-purple-700 transition disabled:bg-dark-gray disabled:cursor-not-allowed">
                            {amount > balance ? 'Insufficient Funds' : 'Confirm Bet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const BettingPage = () => {
    const { user, bets, placeBet, fixtures, players, fixtureOdds, playerOdds, error } = useAppContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ marketType: BetMarketType, option: BetOption, fixtureId: number } | null>(null);

    const myBets = useMemo(() => {
        if (!user) return [];
        return bets.filter(bet => bet.user_id === user.id);
    }, [bets, user]);

    const availableMarkets = useMemo(() => {
        const markets: BettingMarket[] = [];
        const ongoingFixtures = fixtures.filter(f => f.status === 'ongoing');

        ongoingFixtures.forEach(fixture => {
            let marketIdCounter = fixture.id * 1000;
            const fixturePlayers = players.filter(p => p.team_name === fixture.team_a || p.team_name === fixture.team_b);

            const relatedFixtureOdds = fixtureOdds.find(fo => fo.fixture_id === fixture.id);
            if (relatedFixtureOdds) {
                 markets.push({
                    id: marketIdCounter++, fixtureId: fixture.id, category: BetCategory.MATCH_OUTCOME, marketType: '1X2', title: `Match Result: ${fixture.team_a} vs ${fixture.team_b}`,
                    options: [
                        { details: `${fixture.team_a} to win`, odds: relatedFixtureOdds.odds_team_a_win }, 
                        { details: 'Draw', odds: relatedFixtureOdds.odds_draw }, 
                        { details: `${fixture.team_b} to win`, odds: relatedFixtureOdds.odds_team_b_win }
                    ]
                });
            }

            const scorerOptions: BetOption[] = [];
            const ownGoalOptions: BetOption[] = [];
            
            fixturePlayers.forEach(player => {
                const odds = playerOdds.find(po => po.player_id === player.id);
                if (odds) {
                    scorerOptions.push({ details: player.name, odds: odds.odds_to_score });
                    ownGoalOptions.push({ details: player.name, odds: odds.odds_for_own_goal });
                }
            });

            if (scorerOptions.length > 0) {
                 markets.push({
                    id: marketIdCounter++, fixtureId: fixture.id, category: BetCategory.PLAYER_SPECIFIC, marketType: 'Anytime Goalscorer', title: `Anytime Goalscorer`,
                    options: scorerOptions.sort((a,b) => a.odds - b.odds)
                });
            }
             if (ownGoalOptions.length > 0) {
                markets.push({
                    id: marketIdCounter++, fixtureId: fixture.id, category: BetCategory.PLAYER_SPECIFIC, marketType: 'Player to Score Own Goal', title: 'To Score an Own Goal',
                    options: ownGoalOptions.sort((a,b) => a.odds - b.odds)
                });
            }
        });
        
        const grouped = markets.reduce((acc, market) => {
            if(!acc[market.category]) acc[market.category] = [];
            acc[market.category].push(market);
            return acc;
        }, {} as Record<BetCategory, BettingMarket[]>);

        return Object.values(BetCategory).flatMap(cat => grouped[cat] || []);

    }, [fixtures, players, fixtureOdds, playerOdds]);

    const handleBetSelection = (marketType: BetMarketType, option: BetOption, fixtureId: number) => {
        setSelectedOption({ marketType, option, fixtureId });
        setModalOpen(true);
    };

    const handlePlaceBet = (amount: number) => {
        if (!selectedOption || !user || amount > user.za_balance || amount <= 0) return;
        placeBet({
            market_type: selectedOption.marketType,
            details: selectedOption.option.details,
            amount,
            odds: selectedOption.option.odds,
            fixture_id: selectedOption.fixtureId,
        });
        setModalOpen(false);
        setSelectedOption(null);
    };

    const isPlayerOnBettingTeam = (fixtureId: number): boolean => {
        if (!user || (user.role !== 'Player' && user.role !== 'Manager')) {
            return false;
        }
        const fixture = fixtures.find(f => f.id === fixtureId);
        if (!fixture || !user.team_name) {
            return false;
        }
        return fixture.team_a === user.team_name || fixture.team_b === user.team_name;
    }

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Betting Center</h1>
                <div className="text-xl font-bold bg-accent text-white px-4 py-2 rounded-lg shrink-0">
                    Balance: {user.za_balance.toFixed(2)} Za
                </div>
            </div>
            
            {error && <div className="p-4 bg-red-500/20 text-red-300 rounded-lg text-center">{error}</div>}

            {availableMarkets.length === 0 && (
                <Card><p className="text-center text-light-gray">No ongoing matches to bet on right now. Check back later!</p></Card>
            )}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {availableMarkets.map(market => (
                    <Card key={market.id} className="flex flex-col">
                        <div className='flex justify-between items-center'>
                             <h2 className="text-xl font-bold text-white mb-4">{market.title}</h2>
                             <span className='text-xs bg-dark-gray text-light-gray px-2 py-1 rounded-full mb-4'>{market.category}</span>
                        </div>
                       
                        <div className="space-y-2 flex-grow">
                            {market.options.map(option => {
                                const isRestricted = isPlayerOnBettingTeam(market.fixtureId);
                                const hasValidOdds = typeof option.odds === 'number';

                                return (
                                    <div key={option.details} className="p-3 bg-background-dark/50 rounded-lg flex justify-between items-center">
                                        <span className="font-medium text-light-gray">{option.details}</span>
                                        <button 
                                            onClick={() => handleBetSelection(market.marketType, option, market.fixtureId)}
                                            className="bg-accent/80 text-white font-bold py-1 px-4 rounded-md hover:bg-accent transition disabled:bg-dark-gray disabled:cursor-not-allowed"
                                            disabled={isRestricted || !hasValidOdds}
                                            title={isRestricted ? "Players/Managers cannot bet on their own team's matches." : !hasValidOdds ? "Odds not available." : ""}
                                        >
                                            {isRestricted ? 'Restricted' : hasValidOdds ? `@${option.odds.toFixed(2)}` : '--'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-white">My Betting History</h2>
                <div className="space-y-3">
                    {myBets.length > 0 ? myBets.map(bet => <BetRow key={bet.id} bet={bet}/>) : <p className="text-light-gray text-center">No bets placed yet.</p>}
                </div>
            </Card>

            <BetPlacementModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handlePlaceBet}
                marketOption={selectedOption?.option || null}
                balance={user.za_balance}
            />
        </div>
    );
};

export default BettingPage;