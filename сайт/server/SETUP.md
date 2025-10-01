# Discord Integration Setup

## Discord Application Credentials

Your Discord application has been configured with the following credentials:

- **Application ID**: `1423073588529070113`
- **Public Key**: `c77cdf7f6fdd15d1a9333a7d42f2bc1f835a95b074b08766fb9c28dd5ed20fc3`

## Environment Variables

The server is configured to use these credentials as fallback values, but for production use, you should set up environment variables:

1. Copy `config.example.env` to `.env`:
   ```bash
   cp config.example.env .env
   ```

2. Update the `.env` file with your actual values if needed.

## Discord Application Setup

Make sure your Discord application is configured with:

1. **Redirect URIs**: Add `http://localhost:3000/auth/discord/callback` for development
2. **OAuth2 Scopes**: Ensure `identify` scope is enabled
3. **Bot Permissions**: Not required for OAuth2 authentication

## Running the Server

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:3000` by default.

## Security Note

For production deployment:
- Use environment variables instead of hardcoded credentials
- Change the `SESSION_SECRET` to a secure random string
- Use HTTPS for the callback URL
- Set up proper CORS origins

