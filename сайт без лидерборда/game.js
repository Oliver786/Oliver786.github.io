// game.js
window.onload = function() {
    let score = 0;
    const octopusImage = document.getElementById('octopus');
    const scoreDisplay = document.getElementById('score');

    octopusImage.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;

        // Генерация новой частицы
        createCrumb(octopusImage.offsetLeft, octopusImage.offsetTop);
    });

    function createCrumb(x, y) {
        const crumb = document.createElement('img');
        crumb.src = 'crumb.png';          // Ваша собственная картинка
        crumb.alt = 'Crumb';
        crumb.className = 'crumb';
        crumb.style.left = `${x + Math.random() * 50 - 25}px`;
        crumb.style.top = `${y + Math.random() * 50 - 25}px`;
        document.body.appendChild(crumb);

        // Удаляем частицу после окончания анимации
        setTimeout(() => {
            document.body.removeChild(crumb);
        }, 500); // Продолжительность анимации
    }
};