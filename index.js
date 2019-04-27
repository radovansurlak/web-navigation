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

let rot;

function getRotation(nR) {
  let aR;
  rot = rot || 0; // if rot undefined or 0, make 0, else rot
  aR = rot % 360;
  if (aR < 0) { aR += 360; }
  if (aR < 180 && (nR > (aR + 180))) { rot -= 360; }
  if (aR >= 180 && (nR <= (aR - 180))) { rot += 360; }
  rot += (nR - aR);
  return rot;
}

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

  let degreesRotation = getRotation(coords.heading + 90);

  htmlElement.style.setProperty('--rotation', `${degreesRotation}deg`);
  Object.assign(app, coords);
}
window.addEventListener('deviceorientation', throttle(logDirections, 50));
