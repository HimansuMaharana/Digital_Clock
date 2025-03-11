// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    const timeDisplay = document.getElementById('time');
    const dateDisplay = document.getElementById('date');
    const format12hrButton = document.getElementById('12hr');
    const format24hrButton = document.getElementById('24hr');
    const lightThemeButton = document.getElementById('light');
    const darkThemeButton = document.getElementById('dark');
    const timezoneSelect = document.getElementById('timezone');
    const clockContainer = document.querySelector('.clock-container');

    // Timer and Stopwatch Boxes
    const timerBox = document.querySelector('.timer-box');
    const stopwatchBox = document.querySelector('.stopwatch-box');

    let is12HourFormat = localStorage.getItem('timeFormat') === '12hr';
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentTimezone = localStorage.getItem('timezone') || 'UTC';

    applyTheme(currentTheme);
    applyTimeFormat(is12HourFormat);
    timezoneSelect.value = currentTimezone;

    function applyTheme(theme) {
        if (theme === 'dark') {
            clockContainer.classList.add('dark');
            clockContainer.classList.remove('light');
            timerBox.classList.add('dark');
            timerBox.classList.remove('light');
            stopwatchBox.classList.add('dark');
            stopwatchBox.classList.remove('light');
        } else {
            clockContainer.classList.add('light');
            clockContainer.classList.remove('dark');
            timerBox.classList.add('light');
            timerBox.classList.remove('dark');
            stopwatchBox.classList.add('light');
            stopwatchBox.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        currentTheme = theme;
    }

    function applyTimeFormat(is12hr) {
        if (is12hr) {
            format12hrButton.classList.add('active');
            format24hrButton.classList.remove('active');
        } else {
            format24hrButton.classList.add('active');
            format12hrButton.classList.remove('active');
        }
        localStorage.setItem('timeFormat', is12hr ? '12hr' : '24hr');
        is12HourFormat = is12hr;
    }

    function updateClock() {
        const now = new Date();
        const optionsTime = {
            timeZone: currentTimezone,
            hour12: is12HourFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const optionsDate = {
            timeZone: currentTimezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        const timeString = now.toLocaleString('en-US', optionsTime);
        const dateString = now.toLocaleString('en-US', optionsDate);

        timeDisplay.textContent = timeString;
        dateDisplay.textContent = dateString;
    }

    format12hrButton.addEventListener('click', () => {
        applyTimeFormat(true);
        updateClock();
    });

    format24hrButton.addEventListener('click', () => {
        applyTimeFormat(false);
        updateClock();
    });

    lightThemeButton.addEventListener('click', () => {
        applyTheme('light');
    });

    darkThemeButton.addEventListener('click', () => {
        applyTheme('dark');
    });

    timezoneSelect.addEventListener('change', (event) => {
        currentTimezone = event.target.value;
        localStorage.setItem('timezone', currentTimezone);
        updateClock();
    });

    updateClock();
    setInterval(updateClock, 1000);

    // Timer functionality
    const timerHoursInput = document.getElementById('timerHours');
    const timerMinutesInput = document.getElementById('timerMinutes');
    const timerSecondsInput = document.getElementById('timerSeconds');
    const startTimerButton = document.getElementById('startTimer');
    const pauseTimerButton = document.getElementById('pauseTimer');
    const resetTimerButton = document.getElementById('resetTimer');
    const timerDisplay = document.getElementById('timerDisplay');

    let timerInterval;
    let remainingTime = 0;
    let isTimerRunning = false;

    function updateTimerDisplay() {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isTimerRunning) return;
        const hours = parseInt(timerHoursInput.value) || 0;
        const minutes = parseInt(timerMinutesInput.value) || 0;
        const seconds = parseInt(timerSecondsInput.value) || 0;
        remainingTime = hours * 3600 + minutes * 60 + seconds;
        if (remainingTime <= 0) return;
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
            }
        }, 1000);
    }

    function pauseTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        remainingTime = 0;
        updateTimerDisplay();
        timerHoursInput.value = '';
        timerMinutesInput.value = '';
        timerSecondsInput.value = '';
    }

    startTimerButton.addEventListener('click', startTimer);
    pauseTimerButton.addEventListener('click', pauseTimer);
    resetTimerButton.addEventListener('click', resetTimer);
    updateTimerDisplay();

    // Stopwatch functionality
    const stopwatchDisplay = document.getElementById('stopwatchDisplay');
    const startStopwatchButton = document.getElementById('startStopwatch');
    const pauseStopwatchButton = document.getElementById('pauseStopwatch');
    const resetStopwatchButton = document.getElementById('resetStopwatch');

    let stopwatchInterval;
    let stopwatchStartTime = 0;
    let stopwatchElapsedTime = 0;
    let isStopwatchRunning = false;

    function updateStopwatchDisplay() {
        const elapsedMilliseconds = stopwatchElapsedTime;
        const minutes = Math.floor(elapsedMilliseconds / 60000);
        const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000);
        const milliseconds = elapsedMilliseconds % 1000;
        stopwatchDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    function startStopwatch() {
        if (isStopwatchRunning) return;
        isStopwatchRunning = true;
        stopwatchStartTime = Date.now() - stopwatchElapsedTime;
        stopwatchInterval = setInterval(() => {
            stopwatchElapsedTime = Date.now() - stopwatchStartTime;
            updateStopwatchDisplay();
        }, 10);
    }

    function pauseStopwatch() {
        if (isStopwatchRunning) {
            clearInterval(stopwatchInterval);
            isStopwatchRunning = false;
        }
    }

    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        stopwatchElapsedTime = 0;
        updateStopwatchDisplay();
    }

    startStopwatchButton.addEventListener('click', startStopwatch);
    pauseStopwatchButton.addEventListener('click', pauseStopwatch);
    resetStopwatchButton.addEventListener('click', resetStopwatch);
    updateStopwatchDisplay();
});