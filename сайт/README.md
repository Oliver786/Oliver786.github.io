# Purple Octopus Clicker Game

A fun clicker game featuring a purple octopus with Discord authentication and leaderboard functionality.

## Features

- 🐙 Interactive octopus clicking game
- 🎯 Score tracking and saving
- 🏆 Global leaderboard
- 🔐 Discord OAuth authentication
- 💾 SQLite database for user data
- 🎨 Animated visual effects

## Gameplay

Click on the purple octopus to increase your score! Each click creates animated breadcrumbs that fly up and fade away. Save your high score to compete on the global leaderboard.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord Application (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Oliver786/Oliver786.github.io.git
cd Oliver786.github.io
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the `server` directory with:
```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
SESSION_SECRET=your_session_secret
PORT=3000
CLIENT_BASE_URL=http://localhost:3000
```

4. Run the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/auth/discord/callback`
5. Copy Client ID and Client Secret to your `.env` file

## Project Structure

```
├── index.html          # Main HTML file
├── game.js            # Frontend game logic
├── style.css          # Game styling
├── octopus.png        # Octopus image
├── crumb.png          # Breadcrumb image
├── server/
│   ├── server.js      # Express server
│   ├── sqlite.js      # Database configuration
│   ├── package.json   # Server dependencies
│   └── data.sqlite    # SQLite database (created automatically)
└── README.md          # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: Passport.js with Discord OAuth
- **Styling**: Custom CSS with animations

## API Endpoints

- `GET /api/me` - Get current user info
- `POST /api/score` - Save user score
- `GET /api/leaderboard` - Get top scores
- `GET /auth/discord` - Discord OAuth login
- `POST /auth/logout` - Logout user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

