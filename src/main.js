import './style.css'

// Breakpoint config
const VIDEO_BREAKPOINTS = [
  { maxWidth: 768, sourceBase: 'test-small' },
  { maxWidth: 1024, sourceBase: 'test-small' },
  { maxWidth: Number.MAX_SAFE_INTEGER, sourceBase: 'test' }
].sort((a, b) => a.maxWidth - b.maxWidth);

// Return an array of potential sources (webm first, mp4 second).
function getVideoSources(w) {
  let base = VIDEO_BREAKPOINTS[VIDEO_BREAKPOINTS.length - 1].sourceBase;
  for (let i = 0; i < VIDEO_BREAKPOINTS.length; i++) {
    if (w <= VIDEO_BREAKPOINTS[i].maxWidth) {
      base = VIDEO_BREAKPOINTS[i].sourceBase;
      break;
    }
  }
  return [
    { src: base + '.webm', type: 'video/webm' },
    { src: base + '.mp4',  type: 'video/mp4' },
  ];
}

function setupAutoplayVideo() {
  const container = document.getElementById('video-container');
  if (!container) {
    throw new Error('No #video-container found');
  }

  // Create video
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;  
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'auto';
  video.poster = 'fallback.jpg';

  let currentBase = '';

  function updateVideoForWidth(w) {
    const sources = getVideoSources(w);
    const newBase = sources[0].src.replace(/\.(webm|mp4)$/, '');
    if (newBase === currentBase) return; // no change
    currentBase = newBase;

    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
    for (let i = 0; i < sources.length; i++) {
      const s = document.createElement('source');
      s.src = sources[i].src;
      s.type = sources[i].type;
      video.appendChild(s);
    }
    video.load();
  }

  updateVideoForWidth(window.innerWidth);
  container.appendChild(video);

  let resizeHandle = null;
  window.addEventListener('resize', () => {
    if (resizeHandle) {
      cancelAnimationFrame(resizeHandle);
    }
    resizeHandle = requestAnimationFrame(() => {
      updateVideoForWidth(window.innerWidth);
    });
  });
}

document.addEventListener('DOMContentLoaded', setupAutoplayVideo);