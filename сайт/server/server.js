import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { getDb } from './sqlite.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || `http://localhost:${PORT}`;

// Database init
const db = getDb();
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT UNIQUE,
        username TEXT,
        avatar_url TEXT,
        best_score INTEGER DEFAULT 0,
        last_score INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    );
`);

// CORS (allow same-origin and local dev)
app.use(cors({
    origin: (origin, cb) => cb(null, origin || CLIENT_BASE_URL),
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Passport config
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const user = stmt.get(id);
        done(null, user || null);
    } catch (e) {
        done(e);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || `${CLIENT_BASE_URL}/auth/discord/callback`,
    scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
    try {
        const findByDiscordId = db.prepare('SELECT * FROM users WHERE discord_id = ?');
        const existing = findByDiscordId.get(profile.id);
        const username = profile.username;
        const avatarUrl = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null;
        if (existing) {
            const update = db.prepare('UPDATE users SET username = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?');
            update.run(username, avatarUrl, existing.id);
            const refetch = findByDiscordId.get(profile.id);
            return done(null, refetch);
        } else {
            const insert = db.prepare('INSERT INTO users (discord_id, username, avatar_url) VALUES (?, ?, ?)');
            const info = insert.run(profile.id, username, avatarUrl);
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
            return done(null, user);
        }
    } catch (e) {
        return done(e);
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.post('/auth/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ ok: true });
        });
    });
});

// API routes
app.get('/api/me', (req, res) => {
    if (!req.user) return res.json({ user: null });
    const { id, username, avatar_url: avatarUrl, best_score: bestScore, last_score: lastScore } = req.user;
    res.json({ user: { id, username, avatarUrl, bestScore, lastScore } });
});

app.post('/api/score', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { score } = req.body || {};
    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ error: 'Invalid score' });
    }

    const current = db.prepare('SELECT best_score FROM users WHERE id = ?').get(req.user.id);
    const best = Math.max(current?.best_score || 0, score);
    const update = db.prepare('UPDATE users SET last_score = ?, best_score = ?, updated_at = datetime(\'now\') WHERE id = ?');
    update.run(score, best, req.user.id);
    res.json({ ok: true, bestScore: best });
});

app.get('/api/leaderboard', (req, res) => {
    const top = db.prepare('SELECT username, avatar_url AS avatarUrl, best_score AS bestScore FROM users ORDER BY best_score DESC, updated_at ASC LIMIT 50').all();
    res.json({ top });
});

// Serve static frontend from project root
const publicDir = path.resolve(__dirname, '..');
app.use(express.static(publicDir));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



