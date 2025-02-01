export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      image_generations: {
        Row: {
          id: string;
          created_at: string;
          prompt: string;
          image_url: string;
          storage_path: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          prompt: string;
          image_url: string;
          storage_path: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          prompt?: string;
          image_url?: string;
          storage_path?: string;
        };
      };
    };
  };
}
