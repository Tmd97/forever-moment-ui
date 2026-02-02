# Team Setup Guide (Windows & macOS)

This document outlines the steps to set up the **Forever Moment UI** project on both Windows and macOS systems.

**Required Versions:**
*   **Node.js**: v20.20.0 (NOTE: If v20.20.0 is not available, install the latest v20 LTS)
*   **NPM**: v10.8.2

---

## 🖥 Windows Setup

### 1. Environment Setup
1.  **Install Git**: Download from [git-scm.com](https://git-scm.com/download/win).
2.  **Install NVM (Node Version Manager)**:
    *   Download `nvm-setup.exe` from [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases).
    *   Run the installer.
3.  **Install Node & NPM**:
    Open a new Command Prompt (Admin) and run:
    ```cmd
    nvm install 20.20.0
    nvm use 20.20.0
    npm install -g npm@10.8.2
    ```

### 2. Configure SSH
Open **Git Bash** and run:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for defaults
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
clip < ~/.ssh/id_ed25519.pub
```
*Paste the copied key into [GitHub Settings > SSH Keys](https://github.com/settings/keys).*

---

##  macOS Setup

### 1. Environment Setup
1.  **Install Homebrew** (if not installed):
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2.  **Install NVM**:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # Restart terminal
    ```
3.  **Install Node & NPM**:
    ```bash
    nvm install 20.20.0
    nvm use 20.20.0
    npm install -g npm@10.8.2
    ```

### 2. Configure SSH
Open **Terminal** and run:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for defaults
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```
*Paste the copied key into [GitHub Settings > SSH Keys](https://github.com/settings/keys).*

---

## 🚀 Project Setup (Both OS)

### 1. Clone Repository
```bash
# Navigate to your projects folder
cd ~/Projects  # (or C:/Users/Name/Projects)

# Clone using SSH
git clone git@github.com:USERNAME/forever-moment-ui.git
```

### 2. Install Dependencies
```bash
cd forever-moment-ui
npm install
```

### 3. Run the App
```bash
npm run dev
```
Access at **http://localhost:5173**

---

## Troubleshooting
*   **Version Mismatch**: Run `node -v` and `npm -v` to verify you are on v20.x and v10.8.2.
*   **SSH Permission Denied**: Ensure the public key is correctly added to your GitHub account.
