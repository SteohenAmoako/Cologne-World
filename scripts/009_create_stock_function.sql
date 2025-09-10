-- Create function to safely decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(perfume_id INTEGER, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE perfumes 
  SET stock_quantity = GREATEST(0, stock_quantity - quantity)
  WHERE id = perfume_id;
END;
$$ LANGUAGE plpgsql;
