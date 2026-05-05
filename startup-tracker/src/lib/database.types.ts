/**
 * Database types — placeholder.
 *
 * Regenerate with: `npx supabase gen types typescript --project-id <ID> > src/lib/database.types.ts`
 *
 * The hand-typed definitions below mirror supabase/migrations/001_initial_schema.sql
 * AND satisfy @supabase/supabase-js's GenericSchema constraint (Relationships, Views,
 * Functions, Enums, CompositeTypes are all required for the typed client to infer rows).
 *
 * Replace this file once the Supabase project is provisioned.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Update: {
          id?: string;
          name?: string;
          segment?: string;
          phase?: string;
          risk_level?: string;
          responsible_id?: string | null;
          description?: string | null;
          founded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'startups_responsible_id_fkey';
            columns: ['responsible_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
        Update: {
          id?: string;
          startup_id?: string;
          author_id?: string;
          content?: string;
          blockers?: string;
          next_steps?: string;
          risk_level?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'startup_updates_startup_id_fkey';
            columns: ['startup_id'];
            isOneToOne: false;
            referencedRelation: 'startups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'startup_updates_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type StartupRow = Database['public']['Tables']['startups']['Row'];
export type StartupUpdateRow = Database['public']['Tables']['startup_updates']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
