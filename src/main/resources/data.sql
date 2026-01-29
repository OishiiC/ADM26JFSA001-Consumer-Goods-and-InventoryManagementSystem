-- Insert Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO roles (id, name) VALUES (2, 'ROLE_ADMIN');

-- Insert Users (passwords are BCrypt hashed 'password123')
INSERT INTO users (id, name, email, password, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (id, name, email, password, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Jane Doe', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Assign Roles to Users
INSERT INTO user_roles (user_id, role_id) VALUES ('550e8400-e29b-41d4-a716-446655440001', 2);
INSERT INTO user_roles (user_id, role_id) VALUES ('550e8400-e29b-41d4-a716-446655440002', 1);

-- Insert Products
INSERT INTO products (id, name, category, price, stock, image_url, low_stock_threshold, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440101', 'Smartwatch Pro', 'Electronics', 299.99, 150, 'https://picsum.photos/seed/p1/200', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, category, price, stock, image_url, low_stock_threshold, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440102', 'Organic Coffee Beans', 'Groceries', 22.50, 300, 'https://picsum.photos/seed/p2/200', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, category, price, stock, image_url, low_stock_threshold, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440103', 'Designer Denim Jacket', 'Apparel', 149.00, 80, 'https://picsum.photos/seed/p3/200', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, category, price, stock, image_url, low_stock_threshold, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440104', 'Yoga Mat', 'Sports', 45.00, 40, 'https://picsum.photos/seed/p4/200', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, category, price, stock, image_url, low_stock_threshold, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440105', 'Wireless Earbuds', 'Electronics', 199.99, 120, 'https://picsum.photos/seed/p5/200', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Orders
INSERT INTO orders (id, user_id, order_date, status, total, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', '2023-10-26 10:30:00', 'DELIVERED', 344.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO orders (id, user_id, order_date, status, total, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', '2023-10-25 14:20:00', 'SHIPPED', 149.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO orders (id, user_id, order_date, status, total, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440002', '2023-10-25 09:15:00', 'PROCESSING', 45.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO orders (id, user_id, order_date, status, total, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440002', '2023-10-24 16:45:00', 'PENDING', 199.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO orders (id, user_id, order_date, status, total, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440002', '2023-10-22 11:00:00', 'CANCELLED', 22.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 1, 299.99);

INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440104', 1, 45.00);

INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440103', 1, 149.00);

INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440102', 2, 22.50);

INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440105', 1, 199.99);

INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', 1, 22.50);
