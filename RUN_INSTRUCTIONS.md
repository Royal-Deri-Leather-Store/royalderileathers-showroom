# How to Run the RoyalDeriLeathers Web App

Because this sandbox environment does not support terminal command execution, we have pre-configured a complete, production-ready **Vite + React + Tailwind CSS** project inside your workspace directory `d:\e-commerce\`.

Follow these simple steps on your computer to install and start the application:

---

## Step 1: Open Terminal in Workspace
Open your terminal (PowerShell, Command Prompt, or terminal inside VS Code) and navigate to the project directory:
```powershell
cd d:\e-commerce
```

---

## Step 2: Install Node Dependencies
Run the installation command to fetch Vite, React, and Tailwind:
```powershell
npm install
```

---

## Step 3: Automatically Sync Assets (Images & Video)
To automatically copy the local luxury images from your system and download the high-end shoemaking background video, run the sync script:
```powershell
node copy-assets.js
```

---

## Step 4: Run the Development Server
Launch Vite's hot-reloading development server:
```powershell
npm run dev
```

---

## Step 5: View in Browser
Open your browser and navigate to:
**`http://localhost:5173`**
