const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};


const app = new Vue({
  el: '#app',
  data: {
    alpha: null,
    beta: null,
    gamma: null,
    heading: null,
    direction: null,
  },
});


const htmlElement = document.querySelector('html');

function logDirections(...args) {
  const [event] = args;
  const { alpha, beta, gamma } = event;
  const coords = { alpha, beta, gamma };


  Object.entries(coords).forEach(([name, value]) => { coords[name] = value.toFixed(); });
  coords.heading = 360 - coords.alpha;

  const { heading } = coords;

  if (heading > 359 || heading < 1) {
    coords.direction = 'N';
  } else if (heading > 179 && heading < 181) {
    coords.direction = 'S';
  }
  htmlElement.style.setProperty('--rotation', `${heading}deg`);
  Object.assign(app, coords);
}
window.addEventListener('deviceorientation', throttle(logDirections, 100));
