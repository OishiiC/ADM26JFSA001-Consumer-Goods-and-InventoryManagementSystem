# Fix: Java Version Mismatch in IntelliJ

## Problem
IntelliJ is using Java 24 to compile the project, but it's configured for Java 21.

**Error**: `javac 24.0.2 was used to compile java sources`

## Solution: Configure IntelliJ to Use Java 21

### Step 1: Set Project SDK

1. **Open Project Structure**:
   - Press `Ctrl + Alt + Shift + S`
   - Or go to `File` → `Project Structure`

2. **Under "Project" tab**:
   - **SDK**: Select `21` (if not visible, click `Add SDK` → `Download JDK` → Select version 21)
   - **Language level**: Select `21 - Record patterns, pattern matching for switch`
   - Click **Apply**

### Step 2: Set Module SDK

1. **Still in Project Structure**:
   - Click on **Modules** (left sidebar)
   - Select `retail-edge-backend`
   - **Language level**: Select `21`
   - Click **Apply**

### Step 3: Set Java Compiler Version

1. **Go to Settings**:
   - Press `Ctrl + Alt + S`
   - Or `File` → `Settings`

2. **Navigate to**:
   - `Build, Execution, Deployment` → `Compiler` → `Java Compiler`

3. **Set**:
   - **Project bytecode version**: `21`
   - **Per-module bytecode version** (if shown): Set `retail-edge-backend` to `21`

4. **Click Apply and OK**

### Step 4: Invalidate Caches

1. **Go to**: `File` → `Invalidate Caches`
2. **Check**: 
   - ✓ Clear file system cache and Local History
   - ✓ Clear downloaded shared indexes
3. **Click**: `Invalidate and Restart`

### Step 5: Rebuild Project

After IntelliJ restarts:
1. Go to `Build` → `Rebuild Project`
2. Wait for build to complete

### Step 6: Run the Application

1. Open `RetailEdgeApplication.java`
2. Click the green ▶ button next to `main` method
3. Application should now start successfully!

---

## Verify Java Version

You can verify IntelliJ is using the correct Java by checking the Run configuration:

1. Click dropdown next to Run button → `Edit Configurations`
2. Check that **JRE** is set to `21`

---

## Alternative: Quick Fix

If you have Java 21 available:

1. **Right-click** on the project root in IntelliJ
2. **Open Module Settings** (or press `F4`)
3. **Project** → Set **SDK** to `21`
4. **Modules** → Set **Language level** to `21`
5. **Click OK**
6. **Rebuild**: `Build` → `Rebuild Project`

---

## Expected Output

After fixing, the build should show:
```
Compilation completed successfully
```

And when you run, you should see:
```
Started RetailEdgeApplication in X.XXX seconds
```

---

**Once configured correctly, the application will compile and run without errors!** 🚀
