# Running Retail Edge Backend in IntelliJ IDEA

## Quick Start Guide

### Option 1: Open as Maven Project (Recommended)

1. **Open IntelliJ IDEA**

2. **Open the Project**:
   - Click `File` → `Open`
   - Navigate to `c:\Users\afroz\Downloads\retail-edge-backend`
   - Select the folder (or click on the `pom.xml` file)
   - Click `OK`
   - When prompted, select **"Open as Project"**

3. **Wait for Maven to Import**:
   - IntelliJ will automatically detect the Maven project
   - Wait for Maven to download dependencies (bottom-right corner shows progress)
   - This may take a few minutes on first import

4. **Run the Application**:
   
   **Method A: Using the Main Class**
   - Navigate to `src/main/java/com/retailedge/RetailEdgeApplication.java`
   - You'll see a green play button (▶) next to the `main` method
   - Click the play button → **Run 'RetailEdgeApplication'**
   
   **Method B: Using Maven**
   - Open the Maven panel (usually on the right side)
   - Expand `retail-edge-backend` → `Plugins` → `spring-boot`
   - Double-click `spring-boot:run`

5. **Verify It's Running**:
   - Check the console output for: `Started RetailEdgeApplication in X.XXX seconds`
   - Open a browser and navigate to: http://localhost:8080/h2-console
   - Or test the API: http://localhost:8080/api/products (should return 401 - Unauthorized, which is correct)

---

## Troubleshooting

### Issue: Maven Dependencies Not Downloading

**Solution**:
1. Right-click on `pom.xml`
2. Select **Maven** → **Reload Project**
3. Or click the refresh icon in the Maven panel

### Issue: Java Version Mismatch

**Solution**:
1. Go to `File` → `Project Structure` (or press `Ctrl+Alt+Shift+S`)
2. Under **Project**:
   - Set **SDK** to Java 21
   - Set **Language Level** to 21
3. Under **Modules** → `retail-edge-backend`:
   - Set **Language Level** to 21
4. Click **Apply** and **OK**

### Issue: Lombok Not Working (Red Underlines on @Data, etc.)

**Solution**:
1. Install Lombok Plugin:
   - `File` → `Settings` → `Plugins`
   - Search for "Lombok"
   - Install the plugin
   - Restart IntelliJ
2. Enable Annotation Processing:
   - `File` → `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
   - Check **"Enable annotation processing"**
   - Click **Apply** and **OK**

### Issue: Port 8080 Already in Use

**Solution**:
1. Edit `src/main/resources/application.properties`
2. Change the port:
   ```properties
   server.port=8081
   ```
3. Re-run the application

---

## Running with Different Profiles

### Development Mode (H2 Database) - Default
```properties
# application.properties
spring.profiles.active=dev
```

### Production Mode (PostgreSQL)
1. Edit `application.properties`:
   ```properties
   spring.profiles.active=prod
   ```
2. Ensure PostgreSQL is running with the database `retailedge` created

Or run with a specific profile from IntelliJ:
1. Click the dropdown next to the Run button
2. Select **Edit Configurations**
3. In **Environment variables** or **VM options**, add:
   ```
   -Dspring.profiles.active=prod
   ```

---

## IntelliJ Run Configuration (Advanced)

If you want to create a custom run configuration:

1. **Click** the dropdown next to the Run button → **Edit Configurations**
2. **Click** the `+` button → **Spring Boot**
3. **Configure**:
   - **Name**: `Retail Edge Backend - Dev`
   - **Main class**: `com.retailedge.RetailEdgeApplication`
   - **Use classpath of module**: `retail-edge-backend`
   - **Active Profiles**: `dev`
   - **Environment variables** (optional): `JWT_SECRET=your-secret-key`
4. **Click** **Apply** and **OK**
5. **Run** using this configuration

---

## Testing the API from IntelliJ

### Using IntelliJ HTTP Client

1. Create a new file: `api-tests.http` in the project root

2. Add test requests:
   ```http
   ### Login as Admin
   POST http://localhost:8080/api/auth/login
   Content-Type: application/json
   
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   
   ### Get Products (Replace TOKEN with actual JWT)
   GET http://localhost:8080/api/products
   Authorization: Bearer TOKEN
   
   ### Place Order
   POST http://localhost:8080/api/orders/place
   Authorization: Bearer TOKEN
   Content-Type: application/json
   
   {
     "items": [
       {
         "productId": "550e8400-e29b-41d4-a716-446655440101",
         "quantity": 1
       }
     ]
   }
   ```

3. Click the green play button next to each request to execute

---

## Viewing the Database

### H2 Console Access

While the application is running:

1. Open browser: http://localhost:8080/h2-console
2. Enter connection details:
   - **JDBC URL**: `jdbc:h2:mem:retailedge`
   - **Username**: `sa`
   - **Password**: (leave blank)
3. Click **Connect**
4. Browse tables: users, products, orders, etc.

---

## Hot Reload / Auto-Restart

IntelliJ with Spring Boot DevTools (already included in pom.xml):

1. Go to `File` → `Settings` → `Build, Execution, Deployment` → `Compiler`
2. Check **"Build project automatically"**
3. Press `Ctrl+Shift+A` and search for "Registry"
4. Enable: `compiler.automake.allow.when.app.running`
5. Changes to your code will auto-restart the application

---

## Useful IntelliJ Shortcuts

- **Run**: `Shift+F10`
- **Debug**: `Shift+F9`
- **Stop**: `Ctrl+F2`
- **Rerun**: `Ctrl+F5`
- **View Run Console**: `Alt+4`
- **View Maven Panel**: `Alt+5` (or click Maven on the right)

---

## Next Steps After Running

1. ✅ Verify the application starts without errors
2. ✅ Test login endpoint to get JWT token
3. ✅ Test authenticated endpoints with the token
4. ✅ Check H2 console to see sample data
5. ✅ Update Angular frontend API URL to `http://localhost:8080/api`
6. ✅ Test end-to-end integration with frontend

---

## Expected Console Output

When running successfully, you should see:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

2026-01-21 21:04:26.xxx  INFO ... : Starting RetailEdgeApplication...
2026-01-21 21:04:26.xxx  INFO ... : The following 1 profile is active: "dev"
...
2026-01-21 21:04:28.xxx  INFO ... : Started RetailEdgeApplication in 2.345 seconds
```

Look for: **"Started RetailEdgeApplication"** - this means success!

---

Happy coding! 🚀
