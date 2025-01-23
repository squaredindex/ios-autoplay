import './style.css'

function isSafari() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.maxTouchPoints > 0 && /MacIntel/.test(navigator.userAgent));
    
  if (isIOS) return true
  
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('safari') && !ua.includes('chrome')
}

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
    source: isSafari() ? 'test.mp4' : 'test.webm'
  }
].sort((a, b) => a.maxWidth - b.maxWidth)

function getVideoSource(screenWidth) {
  for (let i = 0; i < VIDEO_BREAKPOINTS.length; i++) {
    if (screenWidth <= VIDEO_BREAKPOINTS[i].maxWidth) {
      return VIDEO_BREAKPOINTS[i].source;
    }
  }
  return VIDEO_BREAKPOINTS[VIDEO_BREAKPOINTS.length - 1].source;
}

const container = document.getElementById('video-container')
if (!container) {
  console.error('Video container not found')
  throw new Error('Required DOM element missing')
}

const video = document.createElement('video')
video.autoplay = true
video.muted = true
video.loop = true
video.playsInline = true
video.src = getVideoSource(window.innerWidth)
container.appendChild(video)

let resizeTimeout = null
window.addEventListener('resize', () => {
  if (resizeTimeout) window.cancelAnimationFrame(resizeTimeout)
  
  resizeTimeout = window.requestAnimationFrame(() => {
    const newSource = getVideoSource(window.innerWidth)
    if (video.src.includes(newSource)) return
    
    video.src = newSource
    video.load()
  })
})

