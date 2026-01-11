document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('.play-btn');
    const progress = player.querySelector('.progress');
    const container = player.querySelector('.progress-container');

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
    });

    container.addEventListener('click', (e) => {
        const width = container.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });
});
document.querySelectorAll('.video-player').forEach(player => {
    const video = player.querySelector('video');
    const playBtn = player.querySelector('.play-btn');
    const muteBtn = player.querySelector('.mute-btn');
    const progress = player.querySelector('.progress');
    const container = player.querySelector('.progress-container');

    // Play / pause button
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    });

    // Mute button
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔊' : '🔇';
    });

    // Progress bar update
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = percent + '%';
    });

    // Seek on click
    container.addEventListener('click', (e) => {
        const width = container.clientWidth;
        const clickX = e.offsetX;
        video.currentTime = (clickX / width) * video.duration;
    });

    // ⭐ Fullscreen on click
    video.addEventListener('click', () => {
        if (!video.paused) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        } else {
            video.play();
            playBtn.textContent = '⏸';
        }
    });
});
