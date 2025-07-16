



import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { AppContextType, User, Player, Bet, Fixture, TeamStanding, FixtureSettlementData, PlayerOdds, FixtureOdds, PlaceBetPayload, FantasyTeam, Position } from './types';
import { supabase } from './supabaseClient';
import { TEAM_BUDGET, MAX_TEAM_SIZE, MAX_STARTERS, MAX_BENCH, MAX_PLAYERS_PER_TEAM, EMPTY_TEAM } from './constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'kachra_league_user_id';

const playerPositionOverrides: { [playerName: string]: Position } = {
  'Daiyaan Hasan': Position.FWD,
  'Samin Intisar': Position.GK,
  'Kazi Ayman Rahman': Position.DEF,
  'Mahi Zaman': Position.MID,
  'Saim Islam': Position.MID,
  'Nafim Raihan': Position.FWD,
  'Mahee Al Mobasherin': Position.MID,
  'Irteja Hossain': Position.DEF,
  'Ismail Ali': Position.DEF,
  'Pradipta Roy': Position.FWD,
  'Ryan Eshan': Position.GK,
  'Iftekhar Hossain': Position.MID,
  'Areeb Mansur': Position.FWD,
  'Ayman Hasan Zaman': Position.DEF,
  'Ahnaf Ahad': Position.GK,
  'Abrar Ibtesham': Position.FWD,
  'Nafiz Imtiaz': Position.MID,
  'Adrito Hasan': Position.DEF,
  'Zareef Faiaz Monjur': Position.DEF,
  'Wasif Haider Khan': Position.FWD,
  'Altaf Malik Omar': Position.GK,
  'Nahian Alamgir': Position.DEF,
  'Dewan Md Sefat': Position.FWD,
  'Fahim Sadik': Position.FWD,
  'Amir Hossain': Position.DEF,
  'Tonmoy Hossain': Position.GK,
  'Farhan Rifaz': Position.FWD,
  'Safwan Rahman': Position.FWD,
  'Mustahidur Navo': Position.DEF,
  'Ishmam Karim': Position.DEF,
  'Rafi Ahmed': Position.DEF,
  'Fahim Muntasir Bhuiyan': Position.MID,
  'Lazim Ishmam Mahmud': Position.DEF,
  'Sami Ahmed': Position.DEF,
  'Tathir Mohtadi Chowdhury': Position.MID,
  'Farhan Islam': Position.DEF,
  'Mahee Islam': Position.DEF,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [playerOdds, setPlayerOdds] = useState<PlayerOdds[]>([]);
  const [fixtureOdds, setFixtureOdds] = useState<FixtureOdds[]>([]);
  const [transfersEnabled, setTransfersEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dbSetupError, setDbSetupError] = useState<boolean>(false);

  const fetchData = async (currentUserId?: number) => {
    setLoading(true);
    setError(null);
    setDbSetupError(false);
    try {
      const [
        { data: usersData, error: usersError },
        { data: playersData, error: playersError },
        { data: fixturesData, error: fixturesError },
        { data: standingsData, error: standingsError },
        { data: playerOddsData, error: playerOddsError },
        { data: fixtureOddsData, error: fixtureOddsError },
        { data: betsData, error: betsError },
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('players').select('*, teams(name)'),
        supabase.from('fixtures').select('*'),
        supabase.from('standings').select('*').order('points', { ascending: false }),
        supabase.from('player_odds').select('*'),
        supabase.from('fixture_odds').select('*'),
        supabase.from('bets').select('*').order('created_at', { ascending: false }), // Fetch all bets globally
      ]);
      
      const allErrors = [usersError, playersError, fixturesError, standingsError, playerOddsError, fixtureOddsError, betsError];
      const setupError = allErrors.find(e => e?.message.includes('relation') && e.message.includes('does not exist'));
      
      if (setupError) {
        setDbSetupError(true);
        throw new Error("Database not initialized.");
      }

      if (usersError) throw new Error(`Users: ${usersError.message}`);
      if (playersError) throw new Error(`Players: ${playersError.message}`);
      if (fixturesError) throw new Error(`Fixtures: ${fixturesError.message}`);
      if (standingsError) throw new Error(`Standings: ${standingsError.message}`);
      if (playerOddsError) throw new Error(`Player Odds: ${playerOddsError.message}`);
      if (fixtureOddsError) throw new Error(`Fixture Odds: ${fixtureOddsError.message}`);
      if (betsError) console.error("Could not fetch bets:", betsError.message);
      
      // This robust data sanitization is the definitive fix for the "black screen" crash.
      // It ensures that any malformed team data from the database is replaced with a safe default.
      const typedUsers: User[] = Array.isArray(usersData)
        ? usersData.map(u => {
            const team = u.team as FantasyTeam; // Cast for checking props
            // This is the robust validation. It checks for a non-null object
            // AND the presence of the 'starters' and 'bench' array properties.
            const isValidTeam = team && typeof team === 'object' && Array.isArray(team.starters) && Array.isArray(team.bench);
            
            return {
              ...u,
              // If the team data from the DB is malformed, replace it with a safe default.
              team: isValidTeam ? team : EMPTY_TEAM,
            };
          })
        : [];

      const typedPlayers: Player[] = Array.isArray(playersData)
        ? playersData.map(p => {
            const teamName = p.teams?.name ?? p.team_name;
            const positionOverride = playerPositionOverrides[p.name];
            return {
              ...p,
              team_name: teamName,
              position: positionOverride ?? p.position ?? 'Midfielder',
            };
          })
        : [];

      setUsers(typedUsers);
      setPlayers(typedPlayers);
      setFixtures(fixturesData || []);
      setStandings(standingsData || []);
      setPlayerOdds(playerOddsData || []);
      setFixtureOdds(fixtureOddsData || []);
      setBets(betsData || []);

      if (currentUserId) {
        const currentUser = typedUsers.find(u => u.id === currentUserId);
        if (currentUser) {
          setUser(currentUser);
          // User-specific bets are no longer fetched here; they are filtered from the global `bets` state in the component.
        }
      }
    } catch (err: any) {
      if (!dbSetupError) {
        setError(err.message);
      }
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const retryConnection = () => {
     let currentUserId: number | undefined;
    try {
      const savedUserId = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUserId) {
        currentUserId = parseInt(savedUserId, 10);
      }
    } catch (e) {
      console.error("Failed to parse saved user ID:", e);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    fetchData(currentUserId);
  }

  useEffect(() => {
    retryConnection();
  }, []);

  const updateUserState = (updatedUser: User) => {
    setUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const login = async (username: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { data: foundUser, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();
        
      if (loginError || !foundUser) {
        throw new Error("Invalid username or password.");
      }
      
      const typedUser = foundUser as User;
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, String(typedUser.id));
      // Re-fetch all data for the logged-in user to ensure consistency.
      // The `fetchData` function now normalizes user data, fixing the crash.
      await fetchData(typedUser.id);

    } catch(err: any) {
        setError(err.message);
        // This catch block handles errors from the initial user fetch or from fetchData.
        // We must ensure loading is set to false here to prevent the app from getting stuck.
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const teamValue = useMemo(() => {
    if (!user) return 0;
    const safeTeam = user.team ?? EMPTY_TEAM;
    // Guard against malformed player data by defaulting price to 0.
    return [...safeTeam.starters, ...safeTeam.bench].reduce((acc, player) => acc + (player?.price ?? 0), 0);
  }, [user]);

  const budget = useMemo(() => TEAM_BUDGET - teamValue, [teamValue]);
  
  const buyPlayer = async (player: Player) => {
    if (!user) return;
    const allMyPlayers = [...user.team.starters, ...user.team.bench];

    if (allMyPlayers.length >= MAX_TEAM_SIZE || allMyPlayers.find(p => p.id === player.id)) return;
    if ((user.team.starters.filter(p => p.team_name === player.team_name).length + user.team.bench.filter(p => p.team_name === player.team_name).length) >= MAX_PLAYERS_PER_TEAM) return;

    const originalUser = user;
    const newTeam = { ...user.team, bench: [...user.team.bench, player] };
    
    // Optimistic update
    updateUserState({ ...user, team: newTeam });
    
    const payload = { team: newTeam };
    const { error } = await supabase.from('users').update(payload).eq('id', user.id);
      
    if (error) {
        setError("Failed to buy player. Reverting.");
        console.error(error);
        updateUserState(originalUser); // Revert
    }
  };

  const sellPlayer = async (player: Player) => {
    if (!user) return;
    const originalUser = user;
    const newStarters = user.team.starters.filter(p => p.id !== player.id);
    const newBench = user.team.bench.filter(p => p.id !== player.id);
    const isCaptain = user.team.captain_id === player.id;

    const newTeam = { ...user.team, starters: newStarters, bench: newBench, captain_id: isCaptain ? null : user.team.captain_id };
    
    // Optimistic update
    updateUserState({ ...user, team: newTeam });
    
    const payload = { team: newTeam };
    const { error } = await supabase.from('users').update(payload).eq('id', user.id);

    if (error) {
      setError("Failed to sell player. Reverting.");
      console.error(error);
      updateUserState(originalUser); // Revert
    }
  };

  const setCaptain = async (playerId: number) => {
    if (!user || !user.team.starters.find(p => p.id === playerId)) return;

    const originalTeam = user.team;
    const newTeam = { ...user.team, captain_id: playerId };

    // Optimistic update
    updateUserState({ ...user, team: newTeam });
    
    const payload = { team: newTeam };
    const { error } = await supabase.from('users').update(payload).eq('id', user.id);

    if (error) {
      setError("Failed to set captain. Please try again.");
      console.error(error);
      // Revert on failure
      updateUserState({ ...user, team: originalTeam });
    }
  };

  const moveToStarters = async (playerId: number) => {
    if (!user) return;
    const playerToMove = user.team.bench.find(p => p.id === playerId);
    if (!playerToMove) return;

    const originalTeam = user.team;
    const newBench = user.team.bench.filter(p => p.id !== playerId);
    const newStarters = [...user.team.starters, playerToMove];
    const newTeam = { ...user.team, starters: newStarters, bench: newBench };
    
    // Optimistic update
    updateUserState({ ...user, team: newTeam });
    
    const payload = { team: newTeam };
    const { error } = await supabase.from('users').update(payload).eq('id', user.id);
    
    if (error) {
      setError("Failed to move player. Please try again.");
      console.error(error);
      // Revert on failure
      updateUserState({ ...user, team: originalTeam });
    }
  };

  const moveToBench = async (playerId: number) => {
    if (!user) return;
    const playerToMove = user.team.starters.find(p => p.id === playerId);
    if (!playerToMove) return;

    const originalTeam = user.team;
    const newStarters = user.team.starters.filter(p => p.id !== playerId);
    const newBench = [...user.team.bench, playerToMove];
    const newCaptainId = user.team.captain_id === playerId ? null : user.team.captain_id;
    const newTeam = { ...user.team, starters: newStarters, bench: newBench, captain_id: newCaptainId };
    
    // Optimistic update
    updateUserState({ ...user, team: newTeam });

    const payload = { team: newTeam };
    const { error } = await supabase.from('users').update(payload).eq('id', user.id);

    if (error) {
      setError("Failed to move player. Please try again.");
      console.error(error);
      // Revert on failure
      updateUserState({ ...user, team: originalTeam });
    }
  };
  
  const placeBet = async (bet: PlaceBetPayload) => {
    if (!user || user.za_balance < bet.amount) return;
    
    if (user.role === 'Player' || user.role === 'Manager') {
        const fixture = fixtures.find(f => f.id === bet.fixture_id);
        if (fixture && (fixture.team_a === user.team_name || fixture.team_b === user.team_name)) {
            setError("Players and Managers cannot bet on their own team's matches.");
            setTimeout(() => setError(null), 5000);
            return;
        }
    }
    
    const originalUser = user;
    const newBalance = user.za_balance - bet.amount;
    const optimisticUser = { ...user, za_balance: newBalance };
    
    // Optimistic update of balance
    updateUserState(optimisticUser);

    const newBetPayload = {
      ...bet,
      user_id: user.id,
      status: 'active' as const,
      potential_return: bet.amount * bet.odds,
    };

    const { data: insertedBet, error: betError } = await supabase
      .from('bets')
      .insert(newBetPayload)
      .select()
      .single();

    if (betError) {
      setError("Failed to place bet. Your balance has been restored.");
      console.error(betError);
      // Revert user state on failure
      updateUserState(originalUser);
      return;
    }

    // Now update the user's balance in the DB
    const balanceUpdatePayload = { za_balance: newBalance };
    const { error: balanceError } = await supabase
      .from('users')
      .update(balanceUpdatePayload)
      .eq('id', user.id);
    
    if (balanceError) {
      setError("Bet was placed, but failed to update balance. Please contact an admin to resolve this.");
      console.error(balanceError);
      // Don't revert the optimistic balance update because the bet *was* placed successfully.
      // The user's balance is technically lower. The next full data fetch will sync the correct state if needed.
    }
    
    // Update the bets list in the UI with the confirmed bet from the DB
    setBets(prev => [insertedBet as Bet, ...prev]);
  };

  const toggleTransfers = () => setTransfersEnabled(prev => !prev);
  
  const systemReset = async () => {
      if(!window.confirm("Are you sure? This will reset all teams, points, and balances!")) return;
      
      const userResetPayload = { team: EMPTY_TEAM, za_balance: 500 };
      const { error: userResetError } = await supabase.from('users').update(userResetPayload);
      
      const playerResetPayload = { points: 0, transfers_in: 0, transfers_out: 0 };
      const { error: playerResetError } = await supabase.from('players').update(playerResetPayload);
      
      const { error: betsDeleteError } = await supabase.from('bets').delete().neq('id', 0);
      
      if(userResetError || playerResetError || betsDeleteError) {
        alert("System reset failed. Check console.");
        console.error({userResetError, playerResetError, betsDeleteError});
      } else {
        await fetchData(user?.id);
        alert("System reset successfully.");
      }
  };

  const setZaBalance = async (userId: number, amount: number) => {
      if (user?.role !== 'Admin' || amount < 0 || isNaN(amount)) return;
      const payload = { za_balance: amount };
      const { error } = await supabase.from('users').update(payload).eq('id', userId);
      if (error) alert("Failed to update balance.");
      else await fetchData(user.id);
  };
  
  const updateFixture = async (updatedFixture: Fixture) => {
    const { id, ...updateData } = updatedFixture;
    const { error } = await supabase.from('fixtures').update(updateData).eq('id', id);
    if(error) alert("Failed to update fixture.");
    else setFixtures(fixtures.map(f => f.id === updatedFixture.id ? updatedFixture : f));
  };

  const updatePlayerPoints = async (playerId: number, points: number) => {
    const payload = { points };
    const { error } = await supabase.from('players').update(payload).eq('id', playerId);
    if (error) alert("Failed to update player points.");
    else await fetchData(user?.id);
  };
  
  const settleFixtureBets = async (fixtureId: number, settlementData: FixtureSettlementData) => {
    alert("Settling bets... this may take a moment.");
    console.log("Settlement for fixture", fixtureId, "is a complex operation and should be handled by a serverless function for production use to ensure atomicity.");
    alert("Bet settlement process needs to be implemented in a backend function for reliability. Simulating success.");
    const payload = { status: 'settled' as const };
    await supabase.from('fixtures').update(payload).eq('id', fixtureId);
    await fetchData(user?.id);
  };

  const moveToKnockouts = async () => {
    alert("This functionality should be backed by a serverless function to correctly calculate standings and create new fixtures atomically.");
    const top4 = [...standings].sort((a,b) => b.points - a.points).slice(0, 4);
    if (top4.length < 4) {
      alert("Not enough teams to start knockouts.");
      return;
    }
    console.log("New knockout fixtures would be created for:", top4.map(t => t.team_name));
    alert("Knockout stage initiated (simulation).");
  };

  const value: AppContextType = {
    user,
    users,
    players,
    fixtures,
    standings,
    playerOdds,
    fixtureOdds,
    loading,
    error,
    dbSetupError,
    retryConnection,
    transfersEnabled,
    login,
    logout,
    buyPlayer,
    sellPlayer,
    setCaptain,
    moveToStarters,
    moveToBench,
    teamValue,
    budget,
    bets,
    placeBet,
    toggleTransfers,
    systemReset,
    updateFixture,
    settleFixtureBets,
    moveToKnockouts,
    setZaBalance,
    updatePlayerPoints,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};