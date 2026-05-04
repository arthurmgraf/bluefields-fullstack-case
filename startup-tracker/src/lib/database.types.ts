/**
 * Database types — placeholder.
 *
 * Regenerate with: `npx supabase gen types typescript --project-id <ID> > src/lib/database.types.ts`
 *
 * The hand-typed definitions below mirror supabase/migrations/001_initial_schema.sql.
 * Replace this file once the Supabase project is provisioned.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: { id: string; full_name?: string | null; created_at?: string };
        Update: { id?: string; full_name?: string | null; created_at?: string };
      };
      startups: {
        Row: {
          id: string;
          name: string;
          segment: string;
          phase: string;
          risk_level: string;
          responsible_id: string | null;
          description: string | null;
          founded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          segment: string;
          phase: string;
          risk_level?: string;
          responsible_id?: string | null;
          description?: string | null;
          founded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['startups']['Insert']>;
      };
      startup_updates: {
        Row: {
          id: string;
          startup_id: string;
          author_id: string;
          content: string;
          blockers: string;
          next_steps: string;
          risk_level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          startup_id: string;
          author_id: string;
          content: string;
          blockers?: string;
          next_steps?: string;
          risk_level: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['startup_updates']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type StartupRow = Database['public']['Tables']['startups']['Row'];
export type StartupUpdateRow = Database['public']['Tables']['startup_updates']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
