-- Create wishlists table manually
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_product_wishlist ON wishlists("userId", "productId");

-- Verify table created
SELECT table_name FROM information_schema.tables WHERE table_name = 'wishlists';
