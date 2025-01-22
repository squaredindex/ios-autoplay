import './style.css'

const VIDEO_BREAKPOINTS = {
  mobile: {
    maxWidth: 768,
    source: 'test-small.mp4'
  },
  tablet: {
    maxWidth: 1024,
    source: 'test-small.mp4'
  },
  desktop: {
    maxWidth: Infinity,
    source: 'test.webm'
  }
}

function getVideoSource(screenWidth) {
  return Object.values(VIDEO_BREAKPOINTS)
    .find(breakpoint => screenWidth <= breakpoint.maxWidth)
    ?.source || VIDEO_BREAKPOINTS.desktop.source
}

const container = document.getElementById('video-container')
const videoSource = getVideoSource(window.innerWidth)
const videoHTML = `<video autoplay muted loop playsinline src="${videoSource}"></video>`
container.innerHTML = videoHTML

window.addEventListener('resize', () => {
  const videoElement = container.querySelector('video')
  if (!videoElement) return
  
  const newSource = getVideoSource(window.innerWidth)
  if (videoElement.src === newSource) return
  
  videoElement.src = newSource
  videoElement.load()
})


