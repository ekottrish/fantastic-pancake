

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Fixture, Player, User, FixtureSettlementData } from '../types';

const Card = ({ children, title, className = '' }: { children: React.ReactNode, title: string, className?: string }) => (
    <div className={`bg-primary-deep/50 p-6 rounded-xl shadow-lg backdrop-blur-sm w-full h-full flex flex-col ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="flex-grow flex flex-col">{children}</div>
    </div>
);

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'yellow' | 'blue' | 'red', disabled?: boolean, className?: string, type?: 'button' | 'submit' }) => {
    const baseClasses = "font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-accent text-white hover:bg-purple-700",
        yellow: "bg-yellow-500 text-white hover:bg-yellow-600",
        blue: "bg-blue-500 text-white hover:bg-blue-600",
        red: "bg-red-600 text-white hover:bg-red-700",
    }
    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
}

const GlobalControls = () => {
    const { transfersEnabled, toggleTransfers, systemReset } = useAppContext();
    return (
        <Card title="Global Controls">
            <div className="space-y-4">
                <p className="text-sm">Transfers are currently: <span className={`font-bold ${transfersEnabled ? 'text-green-400' : 'text-red-400'}`}>{transfersEnabled ? 'ENABLED' : 'DISABLED'}</span></p>
                <div className="flex flex-wrap gap-2">
                     <Button onClick={toggleTransfers} disabled={transfersEnabled} variant='blue'>Start FPL transfer</Button>
                     <Button onClick={toggleTransfers} disabled={!transfersEnabled} variant='yellow'>Stop All FPL transfers</Button>
                </div>
                <hr className="border-dark-gray/50" />
                <Button onClick={systemReset} variant="red">System-Wide Reset</Button>
            </div>
        </Card>
    );
};

const PlayerPointsManager = () => {
    const { players, updatePlayerPoints } = useAppContext();
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [newPoints, setNewPoints] = useState<string>('');

    const handleEditClick = (player: Player) => {
        setEditingPlayer(player);
        setNewPoints(String(player.points));
    };

    const handleSave = () => {
        if (editingPlayer) {
            const pointsValue = parseInt(newPoints, 10);
            if (!isNaN(pointsValue) && pointsValue >= 0) {
                updatePlayerPoints(editingPlayer.id, pointsValue);
                setEditingPlayer(null);
                setNewPoints('');
            } else {
                alert("Please enter a valid, non-negative number for points.");
            }
        }
    };

    return (
        <Card title="Player Points Management">
            <div className="flex-grow overflow-y-auto pr-2 space-y-2 max-h-96">
                {players.sort((a,b) => a.name.localeCompare(b.name)).map(p => (
                    <div key={p.id} className="p-2 bg-background-dark/50 rounded flex justify-between items-center">
                        <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-sm text-light-gray">{p.team_name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-accent w-16 text-right">{p.points} pts</span>
                            <button onClick={() => handleEditClick(p)} className="text-accent text-xs font-bold hover:underline">Set Points</button>
                        </div>
                    </div>
                ))}
            </div>
            {editingPlayer && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingPlayer(null)}>
                    <div className="bg-primary-deep p-8 rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                         <h3 className="text-xl font-bold text-white mb-4">Set Points for {editingPlayer.name}</h3>
                         <label className="block text-sm font-medium text-light-gray mb-1">Total Points</label>
                         <input
                            type="number"
                            value={newPoints}
                            onChange={e => setNewPoints(e.target.value)}
                            className="w-full bg-background-dark text-white p-2 rounded border border-dark-gray focus:ring-accent focus:border-accent"
                            placeholder="Enter total points"
                            autoFocus
                         />
                         <div className="mt-6 flex justify-end gap-4">
                            <Button onClick={() => setEditingPlayer(null)} variant="red">Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                         </div>
                    </div>
                 </div>
            )}
        </Card>
    );
};

const UserBalanceManager = () => {
    const { users, setZaBalance } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newBalance, setNewBalance] = useState<number>(0);

    const handleSelectUser = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setNewBalance(user.za_balance);
        }
    };
    
    const handleSave = () => {
        if(selectedUser) {
            setZaBalance(selectedUser.id, newBalance);
            setSelectedUser(null);
        }
    }

    return (
        <Card title="User Za Balance Management">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {users.map(u => (
                    <div key={u.id} className="p-2 bg-background-dark/50 rounded flex justify-between items-center">
                        <div>
                            <p className="font-bold">{u.username}</p>
                            <p className="text-sm text-green-400">{u.za_balance} Za</p>
                        </div>
                        <button onClick={() => handleSelectUser(u.id)} className="text-accent text-xs">Set Balance</button>
                    </div>
                ))}
            </div>
            {selectedUser && (
                 <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
                    <div className="bg-primary-deep p-8 rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                         <h3 className="text-xl font-bold text-white mb-4">Set Balance for {selectedUser.username}</h3>
                         <input type="number" value={newBalance} onChange={e => setNewBalance(parseInt(e.target.value, 10) || 0)} className="w-full bg-background-dark text-white p-2 rounded" />
                         <div className="mt-6">
                            <Button onClick={handleSave}>Save</Button>
                         </div>
                    </div>
                 </div>
            )}
        </Card>
    );
};

const FixtureManager = () => {
    const { fixtures, updateFixture, moveToKnockouts } = useAppContext();
    const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

    const handleSave = () => {
        if (editingFixture) {
            const scoreA = editingFixture.score_a === null || isNaN(editingFixture.score_a) ? null : editingFixture.score_a;
            const scoreB = editingFixture.score_b === null || isNaN(editingFixture.score_b) ? null : editingFixture.score_b;
            const fixtureToUpdate = {...editingFixture, score_a: scoreA, score_b: scoreB};
            updateFixture(fixtureToUpdate);
            setEditingFixture(null);
        }
    }

    const canMoveToKnockouts = fixtures.some(f => f.round === 'group') && fixtures.filter(f => f.round === 'group').every(f => f.status === 'settled');

    return (
        <Card title="Fixture Management">
            <div className="flex-grow overflow-y-auto pr-2">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-background-dark/80 sticky top-0">
                        <tr>
                            <th className="p-2">Match</th>
                            <th className="p-2">Score</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtures.map(f => (
                            <tr key={f.id} className="border-b border-dark-gray/50">
                                <td className="p-2 font-bold">{f.team_a} vs {f.team_b}</td>
                                <td className="p-2">{f.score_a !== null ? `${f.score_a} - ${f.score_b}`: 'TBD'}</td>
                                <td className="p-2 capitalize">{f.status}</td>
                                <td className="p-2">
                                    <button onClick={() => setEditingFixture({...f})} className="text-accent text-xs disabled:text-dark-gray" disabled={f.status === 'settled'}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-auto pt-4">
                <Button onClick={moveToKnockouts} disabled={!canMoveToKnockouts}>Proceed to Knockouts</Button>
                 {!canMoveToKnockouts && <p className="text-xs text-center text-dark-gray mt-2">All group matches must be settled.</p>}
            </div>
            {editingFixture && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingFixture(null)}>
                    <div className="bg-primary-deep p-8 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-white mb-4">Edit Fixture</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" value={editingFixture.score_a ?? ''} onChange={e => setEditingFixture({...editingFixture, score_a: parseInt(e.target.value)})} placeholder="Team A Score" className="bg-background-dark text-white p-2 rounded" />
                            <input type="number" value={editingFixture.score_b ?? ''} onChange={e => setEditingFixture({...editingFixture, score_b: parseInt(e.target.value)})} placeholder="Team B Score" className="bg-background-dark text-white p-2 rounded" />
                            <select value={editingFixture.status} onChange={e => setEditingFixture({...editingFixture, status: e.target.value as Fixture['status']})} className="col-span-2 bg-background-dark text-white p-2 rounded">
                                <option value="pending">Pending</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="done">Done</option>
                                <option value="settled" disabled>Settled</option>
                            </select>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

const CheckboxGrid = ({ label, players, checkedIds, onChange }: { label: string, players: Player[], checkedIds: number[], onChange: (id: number) => void }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <div className="grid grid-cols-2 gap-2 p-2 bg-background-dark rounded max-h-40 overflow-y-auto">
            {players.map(p => (
                <label key={p.id} className="flex items-center space-x-2 p-1 rounded hover:bg-primary-light cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={checkedIds.includes(p.id)}
                        onChange={() => onChange(p.id)}
                        className="form-checkbox h-4 w-4 rounded bg-dark-gray border-light-gray text-accent focus:ring-accent"
                    />
                    <span>{p.name}</span>
                </label>
            ))}
            {players.length === 0 && <span className="text-xs text-dark-gray col-span-2 text-center">No players in this fixture.</span>}
        </div>
    </div>
);

const BetSettlementManager = () => {
    const { fixtures, players, settleFixtureBets } = useAppContext();
    const [settlementFixture, setSettlementFixture] = useState<Fixture | null>(null);
    const [formData, setFormData] = useState<FixtureSettlementData>({
        first_goalscorer_id: 'none',
        anytime_goalscorer_ids: [],
        assist_provider_ids: [],
        own_goal_scorer_ids: [],
        first_team_to_score: 'none',
    });

    const fixturesToSettle = fixtures.filter(f => f.status === 'done');

    const handleSelectFixture = (fixture: Fixture) => {
        setSettlementFixture(fixture);
        // Reset form data when opening
        setFormData({
            first_goalscorer_id: 'none',
            anytime_goalscorer_ids: [],
            assist_provider_ids: [],
            own_goal_scorer_ids: [],
            first_team_to_score: 'none',
        });
    };

    const handleConfirmSettlement = (e: React.FormEvent) => {
        e.preventDefault();
        if (settlementFixture) {
            settleFixtureBets(settlementFixture.id, formData);
            setSettlementFixture(null);
        }
    };

    const fixturePlayers = useMemo(() => {
        if (!settlementFixture) return [];
        return players.filter(p => p.team_name === settlementFixture.team_a || p.team_name === settlementFixture.team_b);
    }, [settlementFixture, players]);

    const handleMultiSelectChange = (field: keyof FixtureSettlementData, playerId: number) => {
        setFormData(prev => {
            const currentIds = prev[field] as number[];
            const newIds = currentIds.includes(playerId)
                ? currentIds.filter(id => id !== playerId)
                : [...currentIds, playerId];
            return { ...prev, [field]: newIds };
        });
    };

    return (
        <Card
            title={settlementFixture ? `Settle: ${settlementFixture.team_a} vs ${settlementFixture.team_b}` : "Bet Settlement"}
            className={settlementFixture ? 'lg:col-span-2' : ''}
        >
            {!settlementFixture ? (
                <div className="flex-grow overflow-y-auto pr-2">
                    {fixturesToSettle.length > 0 ? (
                        <div className="space-y-2">
                            {fixturesToSettle.map(f => (
                                <div key={f.id} className="p-3 bg-background-dark/50 rounded flex justify-between items-center">
                                    <span>{f.team_a} vs {f.team_b}</span>
                                    <Button onClick={() => handleSelectFixture(f)} variant="yellow">Settle Bets</Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="m-auto text-sm text-light-gray">No fixtures awaiting settlement.</p>
                    )}
                </div>
            ) : (
                <form onSubmit={handleConfirmSettlement} className="flex flex-col flex-grow">
                    <p className="text-light-gray mb-6 text-sm">Enter results for manual bet markets. Auto markets (1X2, Over/Under) use the score.</p>
                    
                    <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-light-gray mb-1">First Goalscorer</label>
                                <select value={formData.first_goalscorer_id} onChange={e => setFormData({...formData, first_goalscorer_id: e.target.value === 'none' ? 'none' : Number(e.target.value)})} className="w-full bg-background-dark text-white p-2 rounded">
                                    <option value="none">No Goalscorer</option>
                                    {fixturePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-gray mb-1">First Team to Score</label>
                                <select value={formData.first_team_to_score} onChange={e => setFormData({...formData, first_team_to_score: e.target.value})} className="w-full bg-background-dark text-white p-2 rounded">
                                    <option value="none">No Goal</option>
                                    <option value={settlementFixture.team_a}>{settlementFixture.team_a}</option>
                                    <option value={settlementFixture.team_b}>{settlementFixture.team_b}</option>
                                </select>
                            </div>
                        </div>

                        <CheckboxGrid label="Anytime Goalscorers" players={fixturePlayers} checkedIds={formData.anytime_goalscorer_ids} onChange={(id) => handleMultiSelectChange('anytime_goalscorer_ids', id)} />
                        <CheckboxGrid label="Provided an Assist" players={fixturePlayers} checkedIds={formData.assist_provider_ids} onChange={(id) => handleMultiSelectChange('assist_provider_ids', id)} />
                        <CheckboxGrid label="Scored an Own Goal" players={fixturePlayers} checkedIds={formData.own_goal_scorer_ids} onChange={(id) => handleMultiSelectChange('own_goal_scorer_ids', id)} />
                    </div>

                    <div className="mt-6 flex justify-end gap-4 flex-shrink-0">
                        <Button type="button" onClick={() => setSettlementFixture(null)} variant="red">Back to List</Button>
                        <Button type="submit">Confirm Betting Results</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};


const AdminPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                 <Link to="/dashboard">
                    <Button variant="primary">Exit Admin Panel</Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FixtureManager />
                <BetSettlementManager />
                <PlayerPointsManager />
                <UserBalanceManager />
                <GlobalControls />
            </div>
        </div>
    );
};

export default AdminPage;
