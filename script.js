const chatterbox = document.querySelector('.chatterbox');
const flaps = document.querySelectorAll('.flap');
const fortuneBox = document.getElementById('fortune-box');
const fortuneText = document.getElementById('fortune-text');
const replayBtn = document.getElementById('replay-btn');

const fortunes = [
  "You will find unexpected joy.",
  "A surprise awaits you.",
  "Today is your lucky day.",
  "Big dreams are coming true.",
  "Your creativity will shine.",
  "Be ready for a challenge.",
  "A new friend is near.",
  "Fortune favors the bold."
];

let isAnimating = false;
let currentPhase = "start";

function animateFlapMovement(colorName, onComplete) {
  let steps = colorName.length;
  let isVertical = true;
  let currentStep = 0;

  isAnimating = true;

  function nextStep() {
    if (currentStep >= steps) {
      chatterbox.classList.remove('open-vertical', 'open-horizontal', 'vertical', 'horizontal');
      isAnimating = false;
      if (onComplete) onComplete(isVertical ? 'horizontal' : 'vertical');
      return;
    }

    chatterbox.classList.remove('open-vertical', 'open-horizontal', 'vertical', 'horizontal');

    setTimeout(() => {
      if (isVertical) {
        chatterbox.classList.add('open-vertical', 'vertical');
      } else {
        chatterbox.classList.add('open-horizontal', 'horizontal');
      }

      isVertical = !isVertical;
      currentStep++;
      setTimeout(nextStep, 500);
    }, 100);
  }

  nextStep();
}


function hideColorText() {
  document.querySelectorAll('.color-text').forEach(el => {
    el.classList.add('hidden');
  });
}

function showFortune(text) {
  fortuneText.textContent = text;
  fortuneBox.style.display = 'block';
  currentPhase = "fortune";
}


function animateFinalFlap(onComplete) {
  let steps = 3;
  let isVertical = true;
  let currentStep = 0;

  function nextStep() {
    if (currentStep >= steps) {
      chatterbox.classList.remove('open-vertical', 'open-horizontal', 'vertical', 'horizontal');
      if (onComplete) onComplete();
      return;
    }

    chatterbox.classList.remove('open-vertical', 'open-horizontal', 'vertical', 'horizontal');

    setTimeout(() => {
      if (isVertical) {
        chatterbox.classList.add('open-vertical', 'vertical');
      } else {
        chatterbox.classList.add('open-horizontal', 'horizontal');
      }

      isVertical = !isVertical;
      currentStep++;
      setTimeout(nextStep, 500);
    }, 100);
  }

  nextStep();
}


function prepareNumberSelection(direction) {
  chatterbox.classList.remove('vertical', 'horizontal');
  chatterbox.classList.add(direction);
  hideColorText();
  currentPhase = "number";

  setTimeout(() => {
    flaps.forEach((flap, index) => {
      const numEl = flap.querySelector(`.number.${direction}`);
      if (numEl) {
        numEl.style.opacity = 1;

        flap.addEventListener('click', function handleNumberClick() {
          if (currentPhase !== "number") return;

          currentPhase = "fortune"; 
          flaps.forEach(f => f.querySelectorAll('.number').forEach(n => n.style.opacity = 0));

          const fortune = fortunes[index % fortunes.length];

          animateFinalFlap(() => {
            showFortune(fortune);
          });

          flap.removeEventListener('click', handleNumberClick);
        });
      }
    });
  }, 300);
}


flaps.forEach(flap => {
  flap.addEventListener('click', () => {
    if (isAnimating || currentPhase !== "start") return;

    const color = flap.getAttribute('data-color');
    if (!color) return;

    animateFlapMovement(color, (finalDirection) => {
      prepareNumberSelection(finalDirection);
    });
  });
});


replayBtn.addEventListener('click', () => {
  fortuneBox.style.display = 'none';
  document.querySelectorAll('.number').forEach(num => num.style.opacity = 0);
  document.querySelectorAll('.color-text').forEach(el => el.classList.remove('hidden'));
  chatterbox.classList.remove('vertical', 'horizontal', 'open-vertical', 'open-horizontal');
  currentPhase = "start";
});







