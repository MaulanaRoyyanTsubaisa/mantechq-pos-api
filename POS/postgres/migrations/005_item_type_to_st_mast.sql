ALTER TABLE public.st_mast ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'product';
CREATE INDEX IF NOT EXISTS idx_st_mast_item_type ON public.st_mast(item_type);
