# BroadCast-Bot-V2

A lightweight, efficient Discord bot built with `discord.js` designed for server administrators to broadcast direct messages (DMs) to all members of a server. Perfect for community announcements, updates, and newsletter distribution.

## 🚀 Features

* **Global DMs:** Message everyone in your server at once.
* **Rate-Limit Safe:** Built-in message delays to protect your bot from getting flagged by Discord's anti-spam systems.
* **Modern Integration:** Uses Discord slash commands for easy server management.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/M5GamersPro/BroadCast-Bot-V2
   cd BroadCast-Bot-V2
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install discord.js
   ```

3. **Configure Your Token:**
   Open `bc.js` and ensure your Discord Bot Token is supplied directly to the client login function at the bottom of the script.

4. **Run the bot:**
   ```bash
   node bc.js
   ```

## ⚙️ Required Bot Settings

For the bot to successfully fetch your server's member list, you **must** enable the required gateway intents:

1. Head over to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Open your Application and click on the **Bot** tab on the left.
3. Scroll down to **Privileged Gateway Intents**.
4. Enable **Server Members Intent** and save changes.

## ⚠️ Disclaimer
This utility is intended strictly for administrative announcements in environments where users expect community notifications. Mass DMing can violate Discord's Developer Terms of Service and Community Guidelines if used for spamming purposes. Use responsibly.

M5
EnzoCord
