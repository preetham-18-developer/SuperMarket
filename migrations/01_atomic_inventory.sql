-- Atomic Inventory Logic for Production SaaS Supermarket
-- Ensures stock is checked and deducted in a single transaction

CREATE OR REPLACE FUNCTION process_order_inventory(
    items_to_check JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item RECORD;
    current_stock INTEGER;
    missing_items JSONB := '[]'::jsonb;
    success BOOLEAN := TRUE;
BEGIN
    -- 1. Performance: Loop through requested items and check availability
    FOR item IN SELECT * FROM jsonb_to_recordset(items_to_check) AS x(product_id UUID, req_qty INTEGER) LOOP
        SELECT stock INTO current_stock FROM products WHERE id = item.product_id FOR UPDATE;
        
        IF current_stock IS NULL OR current_stock < item.req_qty THEN
            success := FALSE;
            missing_items := missing_items || jsonb_build_object(
                'id', item.product_id,
                'available', COALESCE(current_stock, 0),
                'requested', item.req_qty
            );
        END IF;
    END LOOP;

    -- 2. If all items available, deduct stock in bulk
    IF success THEN
        FOR item IN SELECT * FROM jsonb_to_recordset(items_to_check) AS x(product_id UUID, req_qty INTEGER) LOOP
            UPDATE products 
            SET stock = stock - item.req_qty 
            WHERE id = item.product_id;
        END LOOP;
        
        RETURN jsonb_build_object('success', TRUE, 'missing_items', missing_items);
    ELSE
        -- No deduction occurs if ANY item is insufficient
        RETURN jsonb_build_object('success', FALSE, 'missing_items', missing_items);
    END IF;
END;
$$;
