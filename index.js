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
    direction: '',
  },
  mounted() {
    this.$el.style.height = `${document.documentElement.clientHeight}px`;
  },
});


const htmlElement = document.querySelector('html');


const compassTolerance = 10;

function logDirections(...args) {
  const [event] = args;
  const { alpha, beta, gamma } = event;
  const coords = { alpha, beta, gamma };


  Object.entries(coords).forEach(([name, value]) => { coords[name] = value.toFixed(); });

  coords.heading = 360 - coords.alpha;


  // eslint-disable-next-line no-undef
  if (coords.heading > 360 - compassTolerance || coords.heading < 0 + compassTolerance) {
    coords.direction = 'N';
  } else if (coords.heading > 180 - compassTolerance && coords.heading < 180 + compassTolerance) {
    coords.direction = 'S';
  } else if (coords.heading > 90 - compassTolerance && coords.heading < 90 + compassTolerance) {
    coords.direction = 'E';
  } else if (coords.heading > 270 - compassTolerance && coords.heading < 270 + compassTolerance) {
    coords.direction = 'W';
  }
  htmlElement.style.setProperty('--rotation', `${coords.heading + 90}deg`);
  Object.assign(app, coords);
}
window.addEventListener('deviceorientation', throttle(logDirections, 50));
