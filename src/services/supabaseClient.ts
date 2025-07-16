
import { createClient } from '@supabase/supabase-js';
import { Player, User, Bet, Fixture, TeamStanding, Position, BetMarketType, UserRole, PlayerOdds, FixtureOdds, FantasyTeam, PlayerStats } from '@/types';
import { SUPABASE_URL, SUPABASE_KEY } from '@/services/supabaseCredentials';

// Retrieve Supabase credentials from the dedicated configuration file.
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

// Check if the placeholder values have been replaced. If not, throw a helpful error
// to guide the developer on how to configure the project.
if (supabaseUrl.includes('YOUR_SUPABASE_URL_HERE') || supabaseKey.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
    throw new Error("Supabase credentials are not configured. Please update the placeholder values in 'services/supabaseCredentials.ts'.");
}

// Manually defining the Database interface to align with the SQL schema and fix
// potential TypeScript errors with complex JSONB columns.
interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          username: string;
          password?: string;
          role: UserRole;
          team_name: string | null;
          za_balance: number;
          team: FantasyTeam;
        };
        Insert: {
          username: string;
          password?: string;
          role: UserRole;
          team_name?: string | null;
          za_balance?: number;
          team?: FantasyTeam;
        };
        Update: {
          username?: string;
          password?: string;
          role?: UserRole;
          team_name?: string | null;
          za_balance?: number;
          team?: FantasyTeam;
        };
      };
      players: {
        Row: {
          id: number;
          name: string;
          team_name: string;
          position: Position;
          price: number;
          points: number;
          stats: PlayerStats;
          transfers_in: number;
          transfers_out: number;
        };
        Insert: {
          name: string;
          team_name: string;
          position: Position;
          price: number;
          points?: number;
          stats?: PlayerStats;
        };
        Update: {
          points?: number;
          stats?: PlayerStats;
          transfers_in?: number;
          transfers_out?: number;
          position?: Position;
        };
      };
      bets: {
        Row: Bet;
        Insert: Omit<Bet, 'id'>;
        Update: Partial<Bet>;
      };
      fixtures: {
        Row: Fixture;
        Insert: Omit<Fixture, 'id'>;
        Update: Partial<Fixture>;
      };
      standings: {
        Row: TeamStanding;
        Insert: TeamStanding;
        Update: Partial<TeamStanding>;
      };
      teams: {
        Row: {
            name: string;
            rounded_score: number;
            p_clean_sheet: number;
        };
        Insert: {
            name: string;
            rounded_score: number;
            p_clean_sheet: number;
        };
        Update: {
            name?: string;
            rounded_score?: number;
            p_clean_sheet?: number;
        };
      };
      player_odds: {
        Row: PlayerOdds;
        Insert: PlayerOdds;
        Update: Partial<PlayerOdds>;
      };
      fixture_odds: {
        Row: FixtureOdds;
        Insert: FixtureOdds;
        Update: Partial<FixtureOdds>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}


export const supabase = createClient<Database>(supabaseUrl, supabaseKey);