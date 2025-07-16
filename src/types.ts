

import { ReactNode } from 'react';

export enum Position {
  GK = 'Goalkeeper',
  DEF = 'Defender',
  MID = 'Midfielder',
  FWD = 'Forward',
}

export interface PlayerStats {
  goals: number;
  assists: number;
  minutes_played: number;
  yellow_cards: number;
  red_cards: number;
  penalties_missed: number;
  clean_sheet: boolean;
  appeared: boolean;
  man_of_the_match: boolean;
}

export interface Player {
  id: number;
  name: string;
  team_name: string;
  position: Position;
  price: number;
  points: number;
  stats: PlayerStats;
  transfers_in: number;
  transfers_out: number;
}

export interface FantasyTeam {
  starters: Player[];
  bench: Player[];
  captain_id: number | null;
}

export type UserRole = 'Player' | 'Manager' | 'Spectator' | 'Admin';

export interface User {
  id: number;
  username: string;
  za_balance: number;
  team: FantasyTeam;
  role: UserRole;
  team_name: string | null;
  password?: string;
}

export enum BetCategory {
    MATCH_OUTCOME = 'Match Outcome',
    PLAYER_SPECIFIC = 'Player-Specific',
    TEAM_SPECIFIC = 'Team-Specific',
    TOTALS = 'Over/Under & Totals',
    TIME_BASED = 'Time-Based',
    COMBINATION = 'Combination & Exotic'
}

export type BetMarketType = 
    | '1X2' | 'Draw No Bet' | 'Correct Score'
    | 'First Goalscorer' | 'Anytime Goalscorer' | 'To Provide an Assist' | 'Player to Score Own Goal'
    | 'Clean Sheet' | 'Team to Score' | 'Team Total Goals'
    | 'Over/Under Goals' | 'Both Teams to Score'
    | 'First Team to Score';

export interface BetOption {
    details: string;
    odds: number;
}

export interface Bet {
  id: number;
  user_id: number;
  market_type: BetMarketType;
  details: string;
  amount: number;
  odds: number;
  status: 'active' | 'won' | 'lost' | 'void';
  potential_return: number;
  fixture_id?: number;
  created_at?: string;
}

export interface PlaceBetPayload {
    market_type: BetMarketType;
    details: string;
    amount: number;
    odds: number;
    fixture_id?: number;
}

export interface BettingMarket {
    id: number;
    fixtureId: number;
    category: BetCategory;
    marketType: BetMarketType;
    title: string;
    options: BetOption[];
}

export interface Fixture {
    id: number;
    team_a: string;
    team_b: string;
    score_a: number | null;
    score_b: number | null;
    status: 'pending' | 'ongoing' | 'done' | 'settled';
    round: 'group' | 'semi-final' | 'final';
}

export interface FixtureSettlementData {
    first_goalscorer_id: number | 'none';
    anytime_goalscorer_ids: number[];
    assist_provider_ids: number[];
    own_goal_scorer_ids: number[];
    first_team_to_score: string | 'none';
}


export interface TeamStanding {
    team_name: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
}

export interface LeaderboardEntry {
  rank: number;
  manager_name: string;
  team_name?: string;
  total_points: number;
}

export interface BettingLeaderboardEntry {
    rank: number;
    manager_name: string;
    za_balance: number;
    biggest_win: number;
}

// DB specific types
export interface PlayerOdds {
    player_id: number;
    odds_to_score: number;
    odds_for_own_goal: number;
}

export interface FixtureOdds {
    fixture_id: number;
    odds_team_a_win: number;
    odds_draw: number;
    odds_team_b_win: number;
}


export interface AppContextType {
  user: User | null;
  users: User[];
  players: Player[];
  fixtures: Fixture[];
  standings: TeamStanding[];
  playerOdds: PlayerOdds[];
  fixtureOdds: FixtureOdds[];
  loading: boolean;
  error: string | null;
  dbSetupError: boolean;
  retryConnection: () => void;
  transfersEnabled: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  buyPlayer: (player: Player) => Promise<void>;
  sellPlayer: (player: Player) => Promise<void>;
  setCaptain: (playerId: number) => Promise<void>;
  moveToStarters: (playerId: number) => Promise<void>;
  moveToBench: (playerId: number) => Promise<void>;
  placeBet: (bet: PlaceBetPayload) => Promise<void>;
  teamValue: number;
  budget: number;
  bets: Bet[];
  // Admin functions
  toggleTransfers: () => void;
  systemReset: () => Promise<void>;
  updateFixture: (updatedFixture: Fixture) => Promise<void>;
  settleFixtureBets: (fixtureId: number, settlementData: FixtureSettlementData) => Promise<void>;
  moveToKnockouts: () => Promise<void>;
  setZaBalance: (userId: number, amount: number) => Promise<void>;
  updatePlayerPoints: (playerId: number, points: number) => Promise<void>;
}

export interface NavItem {
  name: string;
  path: string;
  icon: (props: { className?: string }) => ReactNode;
  adminOnly?: boolean;
}