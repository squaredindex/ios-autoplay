import './style.css'

const VIDEO_BREAKPOINTS = [
  {
    maxWidth: 768,
    source: 'test-small.mp4'
  },
  {
    maxWidth: 1024,
    source: 'test-small.mp4'
  },
  {
    maxWidth: Number.MAX_SAFE_INTEGER,
    source: 'test.webm'
  }
].sort((a, b) => a.maxWidth - b.maxWidth);

let lastWidth = window.innerWidth;
let currentSource = null;

function getVideoSource(screenWidth) {
  if (currentSource && 
      (screenWidth <= lastWidth ? 
        screenWidth > VIDEO_BREAKPOINTS[VIDEO_BREAKPOINTS.length - 2]?.maxWidth :
        screenWidth <= VIDEO_BREAKPOINTS[0].maxWidth)) {
    return currentSource;
  }
  
  lastWidth = screenWidth;
  for (const breakpoint of VIDEO_BREAKPOINTS) {
    if (screenWidth <= breakpoint.maxWidth) {
      currentSource = breakpoint.source;
      return currentSource;
    }
  }
  currentSource = VIDEO_BREAKPOINTS[VIDEO_BREAKPOINTS.length - 1].source;
  return currentSource;
}

const container = document.getElementById('video-container');
if (!container) {
  console.error('Video container not found');
  throw new Error('Required DOM element missing');
}

const video = document.createElement('video');
video.autoplay = true;
video.muted = true;
video.loop = true;
video.playsInline = true;
video.src = getVideoSource(window.innerWidth);
container.appendChild(video);

let resizeTimeout = null;
window.addEventListener('resize', () => {
  if (resizeTimeout) {
    window.cancelAnimationFrame(resizeTimeout);
  }
  
  resizeTimeout = window.requestAnimationFrame(() => {
    const width = window.innerWidth;
    const newSource = getVideoSource(width);
    if (currentSource === newSource) return;
    
    video.src = newSource;
    video.load();
  });
});


