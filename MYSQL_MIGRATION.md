# MySQL Configuration Summary

## ✅ Changes Made

Successfully updated the Retail Edge backend to use **MySQL** instead of PostgreSQL/H2.

### 1. Updated Dependencies ([pom.xml](file:///c:/Users/afroz/Downloads/retail-edge-backend/pom.xml))

**Removed**:
- ❌ PostgreSQL driver
- ❌ H2 database driver

**Added**:
- ✅ MySQL Connector/J (`mysql-connector-j`)
- ✅ Spring Boot Actuator (for monitoring)

### 2. Updated Configuration ([application.properties](file:///c:/Users/afroz/Downloads/retail-edge-backend/src/main/resources/application.properties))

**Database Configuration**:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailedge
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=password
```

**Hibernate Configuration**:
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

**JWT Secret** (matching your reference project):
```properties
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
```

### 3. Updated Security ([SecurityConfig.java](file:///c:/Users/afroz/Downloads/retail-edge-backend/src/main/java/com/retailedge/config/SecurityConfig.java))

**Removed**:
- ❌ H2 Console endpoints (`/h2-console/**`)
- ❌ Frame options configuration for H2

**Added**:
- ✅ Actuator endpoints (`/actuator/**`) - public access

### 4. Removed Files

- ❌ `application-dev.properties`
- ❌ `application-prod.properties`

**Reason**: Using single `application.properties` for MySQL configuration (simpler setup).

### 5. Created New Files

- ✅ [`database-setup.sql`](file:///c:/Users/afroz/Downloads/retail-edge-backend/database-setup.sql) - MySQL database creation script
- ✅ [`MYSQL_SETUP.md`](file:///c:/Users/afroz/Downloads/retail-edge-backend/MYSQL_SETUP.md) - Comprehensive MySQL setup guide
- ✅ [`INTELLIJ_SETUP.md`](file:///c:/Users/afroz/Downloads/retail-edge-backend/INTELLIJ_SETUP.md) - IntelliJ IDEA setup guide

---

## 🚀 Quick Start

### Step 1: Create MySQL Database

Open MySQL Command Line or MySQL Workbench and run:
```sql
CREATE DATABASE IF NOT EXISTS retailedge;
```

Or use the provided script:
```bash
mysql -u root -p < database-setup.sql
```

### Step 2: Update Configuration (if needed)

If your MySQL username/password is different, edit [`application.properties`](file:///c:/Users/afroz/Downloads/retail-edge-backend/src/main/resources/application.properties):

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Step 3: Run in IntelliJ IDEA

1. **Open Project**: `File` → `Open` → Select `retail-edge-backend` folder
2. **Wait for Maven**: Let Maven download dependencies
3. **Install Lombok Plugin**: `File` → `Settings` → `Plugins` → Search "Lombok" → Install
4. **Enable Annotation Processing**: `File` → `Settings` → `Build` → `Compiler` → `Annotation Processors` → ✓ Enable
5. **Run**: Open [`RetailEdgeApplication.java`](file:///c:/Users/afroz/Downloads/retail-edge-backend/src/main/java/com/retailedge/RetailEdgeApplication.java) → Click green ▶ button

### Step 4: Verify

Once running, test these URLs:
- ✅ Health Check: http://localhost:8080/actuator/health
- ✅ API Base: http://localhost:8080/api/products (should return 401 - Unauthorized)

### Step 5: Test Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

---

## 📊 How Data Works

### First Run

1. **Hibernate creates tables** automatically (`ddl-auto=update`)
2. **Sample data loaded** from [`data.sql`](file:///c:/Users/afroz/Downloads/retail-edge-backend/src/main/resources/data.sql):
   - 2 users (admin & user)
   - 2 roles (ROLE_ADMIN & ROLE_USER)
   - 5 products
   - 5 sample orders

### Subsequent Runs

- Tables remain intact
- Data persists (unlike H2 in-memory)
- Schema updates automatically if entities change

---

## 🔍 Monitoring

### Actuator Endpoints

With `management.endpoints.web.exposure.include=*`, you can access:

- **Health**: http://localhost:8080/actuator/health
- **Info**: http://localhost:8080/actuator/info
- **Metrics**: http://localhost:8080/actuator/metrics
- **All Endpoints**: http://localhost:8080/actuator

---

## 🛠️ Troubleshooting

### Issue: "Cannot connect to MySQL"

**Check**:
1. MySQL server is running
2. Port 3306 is correct (or update in `application.properties`)
3. Username/password are correct

**Fix**:
```bash
# Windows - Check if MySQL is running
netstat -ano | findstr :3306
```

### Issue: "Unknown database 'retailedge'"

**Fix**:
```sql
CREATE DATABASE retailedge;
```

### Issue: "Access denied for user 'root'"

**Fix**: Update password in `application.properties`

### Issue: Package errors in IntelliJ

These are false positives before Maven loads. **Fix**:
1. Right-click on `pom.xml`
2. Select **Maven** → **Reload Project**
3. Wait for dependencies to download
4. Errors will disappear

---

## 📦 Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | ADMIN |
| user@example.com | password123 | USER |

---

## ✨ What's Different from H2/PostgreSQL?

| Feature | H2 (Old) | MySQL (New) |
|---------|----------|-------------|
| **Database** | In-memory | Persistent on disk |
| **Data Persistence** | Lost on restart | Retained across restarts |
| **Console** | H2 Console | MySQL Workbench/CLI |
| **Production Ready** | No | Yes |
| **Setup** | Automatic | Requires MySQL server |
| **Configuration** | Multiple profiles | Single config |

---

## 📚 Learn More

- [MYSQL_SETUP.md](file:///c:/Users/afroz/Downloads/retail-edge-backend/MYSQL_SETUP.md) - Detailed MySQL setup
- [INTELLIJ_SETUP.md](file:///c:/Users/afroz/Downloads/retail-edge-backend/INTELLIJ_SETUP.md) - IntelliJ configuration
- [README.md](file:///c:/Users/afroz/Downloads/retail-edge-backend/README.md) - Full documentation

---

**You're all set! 🎉** Open the project in IntelliJ and run it!
