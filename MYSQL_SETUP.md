# MySQL Configuration Guide for Retail Edge Backend

## Prerequisites

1. **Install MySQL Server** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Start MySQL Server**
   - Windows: MySQL should start automatically, or use Services panel
   - XAMPP: Start MySQL from XAMPP Control Panel

## Database Setup

### Option 1: Using MySQL Command Line

1. **Open MySQL Command Line Client** or any MySQL client

2. **Login to MySQL**:
   ```bash
   mysql -u root -p
   ```
   Enter password: `password` (or your root password)

3. **Create the database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS retailedge;
   ```

4. **Verify database creation**:
   ```sql
   SHOW DATABASES;
   ```

5. **Exit**:
   ```sql
   EXIT;
   ```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. Click on "Create a new schema" button
4. Name it `retailedge`
5. Click Apply

### Option 3: Run the Setup Script

From the project directory:
```bash
mysql -u root -p < database-setup.sql
```

## Configuration

The application is configured with these MySQL settings in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailedge
spring.datasource.username=root
spring.datasource.password=password
```

### If Your MySQL Settings Are Different:

Edit `src/main/resources/application.properties`:

**Port**: If MySQL is running on a different port (e.g., 3307):
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/retailedge
```

**Username**: If using a different username:
```properties
spring.datasource.username=your_username
```

**Password**: If using a different password:
```properties
spring.datasource.password=your_password
```

**Database Name**: If you want a different database name:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
```

## How It Works

1. **Hibernate Auto-Creates Tables**: With `spring.jpa.hibernate.ddl-auto=update`, Hibernate will:
   - Create tables if they don't exist
   - Update existing tables if entity structure changes
   - Preserve existing data

2. **Sample Data**: On first run, the application will insert sample data from `data.sql`:
   - 2 users (admin and regular user)
   - 2 roles (ROLE_ADMIN, ROLE_USER)
   - 5 products
   - 5 sample orders

## Verifying the Setup

After running the application once, you can verify the tables were created:

```sql
USE retailedge;
SHOW TABLES;
```

You should see:
- `users`
- `roles`
- `user_roles`
- `products`
- `orders`
- `order_items`

Check sample data:
```sql
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution**: Update the password in `application.properties` to match your MySQL root password.

### Error: "Unknown database 'retailedge'"

**Solution**: Create the database manually:
```sql
CREATE DATABASE retailedge;
```

### Error: "Communications link failure"

**Solution**: 
1. Make sure MySQL server is running
2. Check if MySQL is running on port 3306: `netstat -ano | findstr :3306`
3. If on a different port, update the URL in `application.properties`

### Error: "The server time zone value 'XXX' is unrecognized"

**Solution**: Add timezone to the datasource URL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailedge?useSSL=false&serverTimezone=UTC
```

## Default Credentials

Once the application runs successfully, you can login with:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | ADMIN |
| user@example.com | password123 | USER |

**Note**: Passwords are stored as BCrypt hashes in the database.

## Next Steps

1. ✅ Create the MySQL database
2. ✅ Update `application.properties` if needed
3. ✅ Run the application
4. ✅ Verify tables were created
5. ✅ Test the login endpoint

---

**Ready to run!** 🚀
