(function () {
    if (window.__estreiaCountdownStarted) return;
    window.__estreiaCountdownStarted = true;

    const card = document.querySelector(".estreia__countdown-card[data-target-date]");
    if (!card) return;

    const raw = card.getAttribute("data-target-date").split(/[-T:]/);
    const target = new Date(
        Number(raw[0]),
        Number(raw[1]) - 1,
        Number(raw[2]),
        Number(raw[3] || 0),
        Number(raw[4] || 0),
        Number(raw[5] || 0)
    ).getTime();

    const daysEl = card.querySelector('[data-time="days"]');
    const hoursEl = card.querySelector('[data-time="hours"]');
    const minutesEl = card.querySelector('[data-time="minutes"]');
    const secondsEl = card.querySelector('[data-time="seconds"]');
    const live = document.getElementById("estreia-countdown-live");

    function pad(value, digits) {
        return String(Math.max(0, value)).padStart(digits, "0");
    }

    function tick() {
        let ms = target - Date.now();
        if (ms < 0) ms = 0;

        const days = Math.floor(ms / 86400000);
        const hours = Math.floor(ms / 3600000) % 24;
        const minutes = Math.floor(ms / 60000) % 60;
        const seconds = Math.floor(ms / 1000) % 60;

        if (daysEl) daysEl.textContent = pad(days, 3);
        if (hoursEl) hoursEl.textContent = pad(hours, 2);
        if (minutesEl) minutesEl.textContent = pad(minutes, 2);
        if (secondsEl) secondsEl.textContent = pad(seconds, 2);

        if (live) {
            live.textContent = ms === 0
                ? "Lançamento disponível"
                : pad(days, 3) + " dias, " + pad(hours, 2) + " horas, " + pad(minutes, 2) + " minutos e " + pad(seconds, 2) + " segundos";
        }
    }

    tick();
    window.setInterval(tick, 1000);
})();
