function enterFullscreen() {
  const element = document.documentElement;

  if (fullScreen) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
}

function delaySetup(fromAudio) {
  if (fromAudio) {
    showProfile(true);
    startRecentViews();
    profileDelay = undefined;
  } else {
    setProfileDelay(`${savedProfileDelay}`);
  }
}

function initializeExperience(type) {
  const clickMessage = document.getElementById('click-message');
  clickMessage.classList.add('opacity-0');
  clickMessage.classList.remove('opacity-100');

  enterFullscreen();
  if (typeof profileDelay !== 'undefined') {
    hideProfile(false);
    if (!hasAudio) delaySetup(false);
  } else {
    startRecentViews();
  }

  const preloadScreen = document.getElementById('preload-screen');
  const startText = document.getElementById('bio-startText');
  const driftLogo = document.getElementById('logoContainer');

  if (type == 1) {
    preloadScreen.classList.add('pointer-events-none');
    preloadScreen.style.display = 'none';
  }

  if (type == 2) {
    preloadScreen.classList.add('pointer-events-none');
    const topRectangle = document.getElementById('top-rectangle');
    const bottomRectangle = document.getElementById('bottom-rectangle');

    topRectangle.classList.add('animate-slide-up');
    bottomRectangle.classList.add('animate-slide-down');

    startText.classList.remove('opacity-100');
    startText.classList.add('opacity-0');

    driftLogo.classList.remove('opacity-100');
    driftLogo.classList.add('opacity-0');

    setTimeout(() => {
      preloadScreen.style.display = 'none';
    }, 1000);
  }

  if (type == 3) {
    preloadScreen.classList.add('pointer-events-none');
    startText.classList.remove('opacity-100');
    startText.classList.add('opacity-0');

    driftLogo.classList.remove('opacity-100');
    driftLogo.classList.add('opacity-0');
    setTimeout(() => {
      preloadScreen.style.display = 'none';
    }, 5000);
  }

  const bioContent = document.getElementById('bio-content');
  bioContent.style.display = 'flex';

  bioContent.style.position = 'absolute';
  bioContent.style.top = '50%';
  bioContent.style.left = '50%';
  bioContent.style.transform = 'translate(-50%, -50%)';

  const videoElement = document.getElementById('video-background');
  const audioElement = document.getElementById('background-audio');

  if (videoElement) {
    videoElement.play().then(() => {
      setupAudioVisualization();
      consoleRecord('[Initializer] Video successfully playing.');

      const freezeInterval = 1000;
      let lastAudioTime = Math.round(audioElement.currentTime);
      let lastVideoTime = Math.round(videoElement.currentTime);

      const checkForFreeze = setInterval(() => {
        if (audioElement && videoElement && Math.round(audioElement.duration) === Math.round(videoElement.duration)) {
          if (Math.round(audioElement.currentTime) !== Math.round(videoElement.currentTime) && !videoElement.paused) {
            consoleRecord('[Initializer] Playback mismatch detected. Syncing video with audio...');
            videoElement.currentTime = audioElement.currentTime;
            videoElement.play().catch(e => {
              consoleRecord(`[Initializer] Error recovering playback: ${e}`, 'error');
            });
          }
        } else {
          videoElement.play().catch(e => {
            consoleRecord(`[Initializer] Error recovering playback: ${e}`, 'error');
          });
        }
        lastAudioTime = Math.round(audioElement.currentTime);
        lastVideoTime = Math.round(videoElement.currentTime);

      }, freezeInterval);

      videoElement.addEventListener('ended', () => clearInterval(checkForFreeze));


    }).catch(e => {
      consoleRecord(`[Initializer] Error playing video: ${e}`, 'error');
    });
  }

  if (!videoElement) {
    setupAudioVisualization();
  }
}

let shownRecentViews = false;

function startRecentViews() {
  if (shownRecentViews) {
    return;
  }
  shownRecentViews = true;
  const avatars = document.getElementById("profile-views-avatars-container");
  const translucentDiv = document.getElementById("profile-views-inner-container");
  if (!avatars || !translucentDiv) {
    return;
  }
  setTimeout(function() {
    const initialWidth = translucentDiv.offsetWidth;
    translucentDiv.style.width = initialWidth + "px";
    translucentDiv.style.transition = "width 0.7s ease";
    const newWidth = (translucentDiv.offsetWidth - avatars.offsetWidth) - 7;

    avatars.style.transition = "transform 0.9s ease, opacity 0.9s ease";
    avatars.style.transform = "translateX(-100%)";
    avatars.style.opacity = "0";

    setTimeout(function() {
      translucentDiv.style.width = `${newWidth}px`;
    }, 170);
    setTimeout(function() {
      avatars.style.display = "none";
    }, 300);
  }, 4000);
}