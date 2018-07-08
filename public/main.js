const ws = new WebSocket(`ws://${window.location.host}:3000`);

const roulette = document.getElementById('roulette');
const frame = document.getElementById('frame');
const result = document.getElementById('result');
const wrapper = document.getElementById('wrapper');

wrapper.hidden = true;

let isAnimate = false;

let weapons = [];
let iconCount = 30;

const ICON_WIDTH = 100;
const ICON_HEIGHT = 100;

ws.onmessage = (m) => {
  console.log(`message: ${m.data}`);
  if (m.data.includes('roling') && !isAnimate) {
    roling(roulette, {
      duration: iconCount * 1000,
      index: m.data.split(',')[1]
    });
  }
  if (m.data.includes('weapons')) {
    weapons = JSON.parse(m.data.split('=')[1]);
    calcIconCount();
    fillRoulette(weapons);
  }
}

function roling(elem, opts) {
  const toTransform = `translateX(-${(Math.floor(iconCount / 2) * ICON_WIDTH * weapons.length) + Number(opts.index) * ICON_WIDTH - 200}px)`;
  result.innerText = '';
  wrapper.hidden = false;
  isAnimate = true;
  const keyframes = [
    { // from 
      transform: 'translateX(0)'
    },
    { // to
      transform: toTransform
    },
  ]
  const timeSettings = {
    duration: Number(opts.duration),
    easing: 'cubic-bezier(0, 0.56, 0.46, 1)'
  }
  const onFinsh = (e) => {
    elem.style.transform = toTransform;
    result.innerText = weapons[Number(opts.index)].name;
    setTimeout(() => {
      wrapper.hidden = true;
      isAnimate = false;
    }, 5000);
  };

  const anim = elem.animate(keyframes, timeSettings);
  anim.onfinish = onFinsh;
}

function createIcon(weapon) {
  const container = document.createElement('div');
  const img = document.createElement('div');
  const title = document.createElement('div');
  container.appendChild(img);
  container.appendChild(title);
  img.style.backgroundImage = `url(./icons/${weapon.icon})`;
  img.style.width = `${ICON_WIDTH}px`;
  img.style.height = `${ICON_HEIGHT}px`;
  title.innerText = `${weapon.name}`;
  container.classList += 'container';
  img.classList += 'icon';
  title.classList += 'title';
  return container;
}
function fillRoulette(weapons = []) {
  for (let i = 0; i < iconCount; i++) {
    weapons.forEach((w) => {
      roulette.appendChild(createIcon(w));
    })
  }
  frame.style.maxWidth = `${ICON_WIDTH * 5}px`;
}

function calcIconCount(weaponCount = weapons.length) {
  iconCount = weaponCount * 3;
}