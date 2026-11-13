// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
let gameDeveloper = "Yousef Sabbah";
document.querySelector("footer").innerHTML =
  `${gameName} Game Created By <span class="game-developer">${gameDeveloper}</span>`;

// Setting Game Options
let numOfTries = 6;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Mostfa",
  "Yousef",
  "Samier",
  "Saiiid",
  "Milion",
  "Dollar",
  "Merceds",
  "Solvin",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
const messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

// Create Main Try Div
function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");
  for (let i = 1; i <= numOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled");

    // Create Inputs
    for (let j = 1; j <= numOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }
  // Focus On First Input In First Try Element
  inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisabledDiv = document.querySelectorAll(".disabled input");
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        const nextIndex = index + 1;
        if (nextIndex < inputs.length) inputs[nextIndex].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevIndex = index - 1;
        if (prevIndex >= 0) inputs[prevIndex].focus();
      }
    });
  });
}

const checkBtn = document.querySelector(".check");
checkBtn.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter${i}`,
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
    if (numOfHints === 2) {
      messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;
    }
    // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled"));
    // Disable Buttons
    checkBtn.disabled = true;
    getHintButton.disabled = true;
  } else {
    // Disable Current Try
    document.querySelector(`.try-${currentTry}`).classList.add("disabled");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`,
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    let nextTry = document.querySelector(`.try-${currentTry}`);
    if (nextTry) {
      nextTry.classList.remove("disabled");
      const nextTryInputs = document.querySelectorAll(
        `.try-${currentTry} input`,
      );
      nextTryInputs.forEach((input) => (input.disabled = false));
      nextTry.children[1].focus();
    } else {
      checkBtn.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}
function getHint() {
  if (numOfHints > 0) {
    numOfHints--;
    document.querySelector(".hint span").innerHTML = numOfHints;
  }
  if (numOfHints === 0) {
    getHintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === "",
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}
function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];

      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);
window.onload = function () {
  generateInputs();
};
