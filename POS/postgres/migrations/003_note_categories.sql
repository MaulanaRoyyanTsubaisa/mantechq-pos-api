-- Migration 003: Note Categories Table
CREATE TABLE IF NOT EXISTS public.note_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(org_id, name)
);

-- Index for faster queries by org_id
CREATE INDEX IF NOT EXISTS note_categories_org_id_idx ON public.note_categories(org_id);
