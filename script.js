const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

document.querySelectorAll('.ticker__track').forEach((track) => {
  const html = track.innerHTML;
  track.insertAdjacentHTML('beforeend', html);
});

document.querySelectorAll('.reveal').forEach((element) => {
  element.classList.add('is-visible');
});

if ('IntersectionObserver' in window) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.remove('is-visible'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const playersTrack = document.querySelector('[data-player-track]');
const playerCards = [...document.querySelectorAll('.player-card')];
const playerPrev = document.querySelector('[data-player-prev]');
const playerNext = document.querySelector('[data-player-next]');
const playerCurrent = document.querySelector('[data-player-current]');
const playerTotal = document.querySelector('[data-player-total]');
let playerIndex = 0;
let playerTimer = 0;

const visiblePlayers = () => {
  if (window.matchMedia('(max-width: 700px)').matches) return 1;
  if (window.matchMedia('(max-width: 1020px)').matches) return 2;
  return 3;
};

const setPlayers = (nextIndex) => {
  const count = visiblePlayers();
  const max = Math.max(playerCards.length - count, 0);
  playerIndex = nextIndex;

  if (playerIndex > max) {
    playerIndex = 0;
  } else if (playerIndex < 0) {
    playerIndex = max;
  }

  const cardWidth = playerCards[0]?.getBoundingClientRect().width || 0;
  playersTrack.style.transform = `translateX(${-playerIndex * cardWidth}px)`;
  playerCurrent.textContent = String(Math.min(playerIndex + count, playerCards.length));
};

const restartPlayers = () => {
  clearInterval(playerTimer);
  playerTimer = setInterval(() => setPlayers(playerIndex + 1), 4000);
};

if (playersTrack) {
  playerTotal.textContent = String(playerCards.length);
  playerPrev.addEventListener('click', () => {
    setPlayers(playerIndex - 1);
    restartPlayers();
  });
  playerNext.addEventListener('click', () => {
    setPlayers(playerIndex + 1);
    restartPlayers();
  });
  window.addEventListener('resize', () => setPlayers(playerIndex));
  setPlayers(0);
  restartPlayers();
}

const stageTrack = document.querySelector('[data-stage-track]');
const stageSlides = [...document.querySelectorAll('.stage-slide')];
const stagePrev = document.querySelector('[data-stage-prev]');
const stageNext = document.querySelector('[data-stage-next]');
const stageDots = document.querySelector('[data-stage-dots]');
let stageIndex = 0;

const isStageSlider = () => window.matchMedia('(max-width: 700px)').matches;

const buildStageDots = () => {
  if (!stageDots) return;
  stageDots.innerHTML = '';
  stageSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Перейти к этапу ${index + 1}`);
    dot.addEventListener('click', () => setStage(index));
    stageDots.append(dot);
  });
};

const setStage = (nextIndex) => {
  if (!stageTrack) return;
  const max = stageSlides.length - 1;
  stageIndex = clamp(nextIndex, 0, max);

  if (isStageSlider()) {
    const cardWidth = stageSlides[0]?.getBoundingClientRect().width || 0;
    stageTrack.style.transform = `translateX(${-stageIndex * cardWidth}px)`;
  } else {
    stageTrack.style.transform = '';
    stageIndex = 0;
  }

  stagePrev.disabled = stageIndex === 0;
  stageNext.disabled = stageIndex === max || !isStageSlider();
  [...stageDots.children].forEach((dot, index) => {
    dot.classList.toggle('is-active', index === stageIndex);
  });
};

if (stageTrack) {
  buildStageDots();
  stagePrev.addEventListener('click', () => {
    if (!stagePrev.disabled) setStage(stageIndex - 1);
  });
  stageNext.addEventListener('click', () => {
    if (!stageNext.disabled) setStage(stageIndex + 1);
  });
  window.addEventListener('resize', () => setStage(stageIndex));
  setStage(0);
}
