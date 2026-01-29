# Retail Edge Backend

A secure, scalable REST API backend for the Retail Edge Angular application, built with Spring Boot 3.2, Java 21, and JWT authentication.

## 🚀 Technology Stack

- **Java**: 21
- **Spring Boot**: 3.2.1
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database access
- **MySQL**: Database (MySQL 8+)
- **Maven**: Build tool
- **Lombok**: Reducing boilerplate code
- **JJWT**: JWT token generation and validation (v0.12.3)
- **Spring Boot Actuator**: Monitoring and health checks

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL Server 8.0+ (or XAMPP/WAMP)
- Git
- IntelliJ IDEA (recommended) or any Java IDE

## 🛠️ Setup Instructions

### 1. Setup MySQL Database

**Create the database**:
```sql
CREATE DATABASE IF NOT EXISTS retailedge;
```

Or run the provided script:
```bash
mysql -u root -p < database-setup.sql
```

**Update credentials** (if different from defaults):

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailedge
spring.datasource.username=root
spring.datasource.password=your_password
```

See [MYSQL_SETUP.md](MYSQL_SETUP.md) for detailed MySQL setup instructions.

### 2. Run the Application

**Using IntelliJ IDEA**:
1. Open the project folder in IntelliJ
2. Wait for Maven to download dependencies
3. Navigate to `RetailEdgeApplication.java`
4. Click the green play button ▶ next to the `main` method

See [INTELLIJ_SETUP.md](INTELLIJ_SETUP.md) for detailed IntelliJ setup instructions.

**Using Maven Command Line**:
```bash
cd c:\Users\afroz\Downloads\retail-edge-backend
mvn clean install
mvn spring-boot:run
```

### 3. Verify It's Running

- API Base URL: `http://localhost:8080/api`
- Actuator Health: `http://localhost:8080/actuator/health`
- Test endpoint (should return 401): `http://localhost:8080/api/products`

## 🔐 Default Users

The application comes with pre-configured users (password for both is `password123`):

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | ADMIN |
| user@example.com | password123 | USER |

## 📡 API Endpoints

### Authentication (Public)

```http
POST /api/auth/register
POST /api/auth/login
```

### Products

```http
GET    /api/products              # All users - List products (supports ?search=... and ?category=...)
GET    /api/products/{id}         # All users - Get single product
POST   /api/products              # Admin only - Create product
PUT    /api/products/{id}         # Admin only - Update product
DELETE /api/products/{id}         # Admin only - Delete product
```

### Orders

```http
POST   /api/orders/place          # Authenticated - Place new order
GET    /api/orders                # Admin only - Get all orders
GET    /api/orders/my-orders      # Authenticated - Get user's orders
PUT    /api/orders/{id}/status    # Admin only - Update order status
```

### Inventory

```http
GET    /api/inventory                      # Admin only - Get inventory
PUT    /api/inventory/{productId}/threshold # Admin only - Update low stock threshold
```

### Dashboard (Admin Only)

```http
GET    /api/dashboard/metrics         # Key metrics (revenue, orders, customers)
GET    /api/dashboard/sales           # Sales data (supports ?period=daily|monthly|quarterly|yearly)
GET    /api/dashboard/top-products    # Top 5 selling products
```

## 📝 Sample API Requests

### Register a new user

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get products (authenticated)

```bash
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Place an order

```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440101",
        "quantity": 2
      }
    ]
  }'
```

## 🗄️ Database Schema

### Tables

- **users**: User accounts with BCrypt-hashed passwords
- **roles**: User roles (ROLE_USER, ROLE_ADMIN)
- **user_roles**: Many-to-many relationship between users and roles
- **products**: Product catalog with inventory tracking
- **orders**: Customer orders
- **order_items**: Line items for each order

### Key Relationships

- User ↔ Role: Many-to-Many
- User ↔ Order: One-to-Many
- Order ↔ OrderItem: One-to-Many
- Product ↔ OrderItem: Many-to-One

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **BCrypt Password Encoding**: Secure password hashing
- **Role-Based Access Control (RBAC)**: Method-level security
- **CORS Configuration**: Configured for Angular frontend
- **Custom Exception Handling**: Standardized error responses
- **Input Validation**: Jakarta Bean Validation

## 🧪 Testing

Run tests with:

```bash
mvn test
```

## 🔧 Configuration

### JWT Configuration

Edit `src/main/resources/application.properties`:

```properties
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000  # 24 hours in milliseconds
```

> ⚠️ **Important**: Change the JWT secret in production!

### CORS Configuration

Update allowed origins in `application.properties`:

```properties
cors.allowed.origins=http://localhost:4200,https://your-production-domain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 8080 already in use**:
   - Change the port in `application.properties`: `server.port=8081`

2. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure the database exists

3. **JWT token errors**:
   - Verify the token is being sent in the `Authorization: Bearer <token>` header
   - Check if the token has expired (24-hour expiration by default)

## 📚 Project Structure

```
src/main/java/com/retailedge/
├── config/              # Security and application configuration
├── controller/          # REST API controllers
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
├── entity/              # JPA entities
├── enums/               # Enumerations (OrderStatus, RoleType)
├── exception/           # Custom exceptions and global handler
├── repository/          # Spring Data JPA repositories
├── security/            # Security configuration and JWT
│   └── jwt/             # JWT utilities and filters
└── service/             # Business logic services
```

## 🔄 Integration with Frontend

To connect the Angular frontend to this backend:

1. Update the API base URL in your Angular environment files:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

2. Ensure the frontend sends the JWT token in the Authorization header:
   ```typescript
   headers: new HttpHeaders({
     'Authorization': `Bearer ${token}`
   })
   ```

3. The backend expects the following role format in responses:
   - Roles are returned as `["ROLE_ADMIN"]` or `["ROLE_USER"]`
   - Frontend should check for role using: `user.roles.includes('ROLE_ADMIN')`

## 📄 License

This project is created for educational purposes.

## 👥 Authors

- Backend API developed as part of the Retail Edge project

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check application logs in `logs/` directory (if configured)

---

**Built with ❤️ using Spring Boot**
