const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
const hoverElements = document.querySelectorAll(".hover");
const path = new Path2D(
  "M132 0.5C122.5 123 96 136.5 0.500244 152.494C97 152.494 105.5 138.5 132 271.5C145.5 145 136 167 247 152.494C158 122 132 122 132 0.5Z"
);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let numDots = 0;
const dots = [];

function initializeDots() {
  numDots = Math.round((canvas.width * canvas.height) / 10000) * 3;
  for (let i = 0; i < numDots; i++) {
    const x = getRandomInt(0, canvas.width);
    const y = getRandomInt(0, canvas.height);
    const opacity = Math.random();
    const targetOpacity = Math.round(Math.random());
    const scale = Math.random();
    dots.push({ x, y, opacity, targetOpacity, scale });
  }
}

function drawInitialDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const { x, y, opacity } = dot;

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dot.scale * 0.03, dot.scale * 0.05);
    ctx.stroke(path);
    ctx.fill(path);
    ctx.restore();
  }
}

function animateFading() {
  drawInitialDots();
  const opacityIncrement = 0.007;

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    if (dot.opacity < dot.targetOpacity) {
      dot.opacity += opacityIncrement;
      dot.opacity = Math.min(dot.opacity, 1);
    } else if (dot.opacity > dot.targetOpacity) {
      dot.opacity -= opacityIncrement;
      dot.opacity = Math.max(dot.opacity, 0);
    }

    if (dot.opacity <= 0.1 || dot.opacity >= 1) {
      dot.targetOpacity = dot.targetOpacity === 0 ? 1 : 0;
    }
  }
  requestAnimationFrame(animateFading);
}

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  dots.length = 0;
  initializeDots();
  drawInitialDots();
}

// Throttle the window resize event to avoid excessive calls
let resizeTimeout;
function handleThrottledResize() {
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      handleResize();
      resizeTimeout = null;
    }, 100); // Adjust the throttle time (in milliseconds) as needed.
  }
}

// Call the function initially to set up dots and start the animation
initializeDots();
animateFading();
handleThrottledResize();

// Attach the throttled handleResize function to the window resize event
window.addEventListener("resize", handleThrottledResize);

// Define the animation function for the elements with the "hover" class
function animateHoverElements(elements) {
  elements.forEach((element) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    const duration = Math.min(Math.max(Math.random() * 4, 1.3), 4);
    const distance = Math.min(Math.max(Math.random() * 50, 20), 80);

    tl.to(element, { y: -distance, duration: duration, ease: "power1.inOut" });
    tl.to(element, { y: 0, duration: duration, ease: "power1.inOut" });
  });
}

// Call the function to apply the animation to the "hover" elements
animateHoverElements(hoverElements);
