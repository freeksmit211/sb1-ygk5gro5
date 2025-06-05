-- Create function to update allowed pages
CREATE OR REPLACE FUNCTION update_sales_rep_pages()
RETURNS void AS $$
BEGIN
  -- Update salesFreek users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/freek',
    '/sales-accounts/freek/ytd'  -- Only their own overview page
  ]
  WHERE role = 'salesFreek';

  -- Update salesFranco users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/franco',
    '/sales-accounts/franco/ytd'  -- Only their own overview page
  ]
  WHERE role = 'salesFranco';

  -- Update salesJeckie users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/jeckie',
    '/sales-accounts/jeckie/ytd'  -- Only their own overview page
  ]
  WHERE role = 'salesJeckie';

  -- Update superAdmin users to have access to all pages
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
    '/todo/jeckie', '/todo/sts', '/whatsapp', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ]
  WHERE role = 'superAdmin';

  -- Update management users to have access to all overview pages
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ]
  WHERE role = 'management';
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT update_sales_rep_pages();

-- Drop the function
DROP FUNCTION update_sales_rep_pages();