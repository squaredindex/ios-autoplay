import './style.css'

/**
 * Defines breakpoint configurations for different video sizes.
 * Each breakpoint associates a maximum width with a base filename
 * (e.g., 'test-small' or 'test').
 * Sorted from smallest to largest maxWidth.
 * @type {Array<{ maxWidth: number, sourceBase: string }>}
 */
const VIDEO_BREAKPOINTS = [
  { maxWidth: 768,  sourceBase: 'test-small' },
  { maxWidth: 1024, sourceBase: 'test-small' },
  { maxWidth: Number.MAX_SAFE_INTEGER, sourceBase: 'test' },
].sort((a, b) => a.maxWidth - b.maxWidth);

/**
 * Determines the appropriate video sources (WebM and MP4) for a given
 * screen width. The function finds the breakpoint whose maxWidth
 * accommodates the provided screenWidth.
 *
 * @param {number} screenWidth - The current width of the viewport.
 * @returns {Array<{ src: string, type: string }>} An array of source objects,
 * each containing a `src` and `type`. WebM is listed first, followed by MP4.
 */
function getVideoSources(screenWidth) {
  let breakpointBase = VIDEO_BREAKPOINTS[VIDEO_BREAKPOINTS.length - 1].sourceBase;

  for (let i = 0; i < VIDEO_BREAKPOINTS.length; i++) {
    if (screenWidth <= VIDEO_BREAKPOINTS[i].maxWidth) {
      breakpointBase = VIDEO_BREAKPOINTS[i].sourceBase;
      break;
    }
  }

  return [
    { src: `${breakpointBase}.webm`, type: 'video/webm' },
    { src: `${breakpointBase}.mp4`,  type: 'video/mp4' },
  ];
}

/**
 * Removes any existing <source> elements from the given video element,
 * then appends new <source> elements based on the provided sourcesArray.
 * Finally, it calls `video.load()` to force the browser to re-evaluate
 * the new sources.
 *
 * @param {HTMLVideoElement} video - The video element whose sources will be updated.
 * @param {Array<{ src: string, type: string }>} sourcesArray - The new set of sources to use.
 */
function setVideoSources(video, sourcesArray) {
  while (video.firstChild) {
    video.removeChild(video.firstChild);
  }

  sourcesArray.forEach(({ src, type }) => {
    const sourceEl = document.createElement('source');
    sourceEl.src = src;
    sourceEl.type = type;
    video.appendChild(sourceEl);
  });

  video.load();
}

/**
 * Initializes and configures a responsive, autoplaying video inside
 * the DOM element with the ID "video-container". This includes setting
 * essential autoplay attributes, generating <source> elements according
 * to viewport breakpoints, and updating sources on window resize.
 */
function setupAutoplayVideo() {
  const container = document.getElementById('video-container');
  if (!container) {
    console.error('Video container not found');
    throw new Error('Required DOM element missing');
  }

  const video = document.createElement('video');

  // Required for autoplay on many mobile/desktop browsers
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('webkit-playsinline', '');

  // Optional configuration
  video.preload = 'auto';
  video.poster = 'fallback.jpg';

  let currentBreakpointBase = '';

  /**
   * Determines the appropriate sources for the current width and updates
   * the video element if the breakpoint base has changed.
   *
   * @param {number} width - The current viewport width.
   */
  function updateVideoForWidth(width) {
    const newSources = getVideoSources(width);
    const newBase = newSources[0].src.replace(/\.(webm|mp4)$/, '');

    if (newBase === currentBreakpointBase) return;

    currentBreakpointBase = newBase;
    setVideoSources(video, newSources);
  }

  updateVideoForWidth(window.innerWidth);
  container.appendChild(video);

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      window.cancelAnimationFrame(resizeTimeout);
    }
    resizeTimeout = window.requestAnimationFrame(() => {
      updateVideoForWidth(window.innerWidth);
    });
  });
}

/**
 * Sets up the autoplay video once the DOM has loaded.
 */
document.addEventListener('DOMContentLoaded', setupAutoplayVideo);