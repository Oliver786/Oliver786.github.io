// game.js
window.onload = function() {
    let score = 0;
    const octopusImage = document.getElementById('octopus');
    const scoreDisplay = document.getElementById('score');
    const saveButton = document.getElementById('save-score');

    const userInfo = document.getElementById('user-info');
    const loginInfo = document.getElementById('login-info');
    const usernameSpan = document.getElementById('username');
    const userAvatar = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    const leaderboardList = document.getElementById('leaderboard-list');

    function setHidden(el, hidden) {
        if (!el) return;
        if (hidden) el.classList.add('hidden'); else el.classList.remove('hidden');
    }

    async function fetchMe() {
        const res = await fetch('/api/me', { credentials: 'include' });
        const data = await res.json();
        const user = data.user;
        if (user) {
            usernameSpan.textContent = user.username;
            if (user.avatarUrl) {
                userAvatar.src = user.avatarUrl;
                userAvatar.style.display = 'inline-block';
            } else {
                userAvatar.style.display = 'none';
            }
            setHidden(userInfo, false);
            setHidden(loginInfo, true);
        } else {
            setHidden(userInfo, true);
            setHidden(loginInfo, false);
        }
    }

    async function saveScore() {
        try {
            const res = await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ score })
            });
            if (res.status === 401) {
                alert('Please login with Discord to save your score.');
                return;
            }
            const data = await res.json();
            if (data.ok) {
                await loadLeaderboard();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadLeaderboard() {
        try {
            const res = await fetch('/api/leaderboard', { credentials: 'include' });
            const data = await res.json();
            leaderboardList.innerHTML = '';
            (data.top || []).forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.username || 'Anonymous'} — ${player.bestScore}`;
                leaderboardList.appendChild(li);
            });
        } catch (e) {
            console.error(e);
        }
    }

    octopusImage.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;
        createCrumb(octopusImage.offsetLeft, octopusImage.offsetTop);
    });

    saveButton.addEventListener('click', saveScore);

    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        await fetchMe();
    });

    function createCrumb(x, y) {
        const crumb = document.createElement('img');
        crumb.src = 'crumb.png';
        crumb.alt = 'Crumb';
        crumb.className = 'crumb';
        crumb.style.left = `${x + Math.random() * 50 - 25}px`;
        crumb.style.top = `${y + Math.random() * 50 - 25}px`;
        document.body.appendChild(crumb);

        setTimeout(() => {
            document.body.removeChild(crumb);
        }, 500);
    }

    fetchMe();
    loadLeaderboard();
};