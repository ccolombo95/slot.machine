import "./scss/style.scss";

//! --------------- Menus ---------------------------
const plusName = document.getElementById("plus-name");
const plusQuestion = document.getElementById("plus-question");

function addPlusListener(elementId, inputClass, listId, maxChildren) {
  const plus = document.querySelector(`#${elementId}`);

  plus.addEventListener("click", function (event) {
    event.stopPropagation();

    const list = document.getElementById(listId);

    if (list.children.length >= maxChildren) {
      return;
    }

    plus.remove();

    const div = document.createElement("div");
    div.classList.add("new-input");

    const input = document.createElement("input");
    input.classList.add(inputClass);

    div.appendChild(input);

    if (list.children.length < maxChildren - 1) {
      const img = document.createElement("img");
      img.classList.add("plus");
      img.src = "./public/imgs/plus-solid.svg";
      img.id = elementId;

      div.appendChild(img);
    }

    list.appendChild(div);

    if (list.children.length < maxChildren) {
      addPlusListener(elementId, inputClass, listId, maxChildren);
    }

    setTimeout(() => {
      div.classList.add("visible");
    }, 10);
  });
}

addPlusListener("plus-name", "input-name", "names-list", 30);
addPlusListener("plus-question", "input-question", "questions-list", 20);

//!-----------------------------------------------
const asideName = document.querySelector("aside#names");
const asideQuestion = document.querySelector("aside#questions");
const namesIcon = document.querySelector(".names.menu__icon");
const divNames = document.querySelector("#names-form");
const divQuestions = document.querySelector("#questions-form");
const questionsIcon = document.querySelector(".questions.menu__icon");

function toggleMenu(icon, div, aside) {
  icon.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que el clic en el ícono cierre el menú inmediatamente
    div.classList.toggle("active");
    aside.classList.toggle("active");
  });
}

function closeMenuOnClickOutside(aside, div, ...elementsToExclude) {
  document.addEventListener("click", (event) => {
    if (
      !aside.contains(event.target) &&
      !div.contains(event.target) &&
      !elementsToExclude.some((element) => element.contains(event.target))
    ) {
      aside.classList.remove("active");
      div.classList.remove("active");
    }
  });
}

// Inicializa los menús
toggleMenu(namesIcon, divNames, asideName);
toggleMenu(questionsIcon, divQuestions, asideQuestion);

// Configura el cierre de los menús al hacer clic fuera
closeMenuOnClickOutside(asideName, divNames, plusName);
closeMenuOnClickOutside(asideQuestion, divQuestions, plusQuestion);

//! --------- Slot Machine ---------------------

const preguntasMap = [
    "¿Cuál es el propósito de la vida?",
    "¿Qué es la realidad?",
    "¿Existe el libre albedrío?",
    "¿Qué es la verdad?",
    "¿Qué define la identidad personal?",
    "¿Es el conocimiento posible?",
    "¿Qué significa vivir una buena vida?",
    "¿Qué es la justicia?",
    "¿Existen los universales?",
    "¿Es posible la objetividad?",
    "¿Cuál es la naturaleza de la conciencia?",
    "¿Hay vida después de la muerte?",
    "¿Es el sufrimiento una parte inevitable de la existencia?",
    "¿Cuál es el papel de la moralidad en la vida humana?",
    "¿Es posible la paz mundial?",
  ],
  nameMap = [
    "Albert Einstein",
    "Marie Curie",
    "Leonardo da Vinci",
    "Mahatma Gandhi",
    "Nelson Mandela",
    "William Shakespeare",
    "Frida Kahlo",
    "Pablo Picasso",
    "Beyonce",
    "Madonna",
    "Britney Spears",
  ],
  startButton = document.getElementById("start"),
  icon_width = 300,
  icon_height = 91.6,
  num_icons = 10,
  time_per_icon = 50;

let index = 0;

//! ---------------CREA LAS CARDS-----------------------
const slider = document.querySelector(".slider");
const namesForm = document.getElementById("names-form");

const cloneIcons = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    slider.appendChild(clone);
  });
};

namesForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputs = document.querySelectorAll(".input-name");
  const namesArray = Array.from(inputs).map((input) => input.value);

  localStorage.setItem("names", JSON.stringify(namesArray));
  if (namesArray.length >= 10) {
    slider.innerHTML = "";
    namesArray.forEach((e) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardText = document.createElement("p");
      cardText.classList.add("card__text");
      cardText.textContent = `${e}`;
      card.appendChild(cardText);
      slider.appendChild(card);
    });
    cloneIcons();

    cloneIcons();
  }
});

const storedNames = localStorage.getItem("names");
if (!storedNames || storedNames === null || storedNames === "") {
  nameMap.forEach((e) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardText = document.createElement("p");
    cardText.classList.add("card__text");
    cardText.textContent = `${e}`;
    card.appendChild(cardText);
    slider.appendChild(card);
  });

  cloneIcons();
  cloneIcons();
} else {
  const parsedNames = JSON.parse(storedNames);

  parsedNames.forEach((e) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardText = document.createElement("p");
    cardText.classList.add("card__text");
    cardText.textContent = `${e}`;
    card.appendChild(cardText);
    slider.appendChild(card);
  });
  cloneIcons();
  cloneIcons();
}

const questionsForm = document.getElementById("questions-form");
questionsForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputs = document.querySelectorAll(".input-question");
  const questionsArray = Array.from(inputs)
    .map((input) => input.value.trim()) // .trim() elimina espacios en blanco alrededor
    .filter((value) => value !== "");
  localStorage.setItem("questions", JSON.stringify(questionsArray));
});

//! ------------ Sistema del slot machine ------------------
/**
 * Roll the reel
 */
const roll = (reel) => {
  const delta = 2 * num_icons + Math.round(Math.random() * num_icons);

  return new Promise((resolve) => {
    const currentTranslateY = -index * icon_height;
    const targetTranslateY = currentTranslateY - delta * icon_height;
    const transitionTime = (8 + delta) * time_per_icon;

    reel.style.transition = `transform ${transitionTime}ms cubic-bezier(.41,-0.01,.63,1.09)`;
    reel.style.transform = `translateY(${targetTranslateY}px)`;

    setTimeout(() => {
      reel.style.transition = `none`;
      reel.style.transform = `translateY(${
        (-(index + delta) % num_icons) * icon_height
      }px)`;
      index = (index + delta) % num_icons;

      const visibleCardIndex = index; // El índice de la card visible
      const cards = reel.children; // Obtén las cards del reel
      Array.from(cards).forEach((card, i) => {
        if (i === visibleCardIndex + 1) {
          card.style.animation = "winner 1.3s infinite";
        } else {
          card.style.backgroundColor = "";
          card.style.animation = "none";
        }
      });
      resolve(index);
    }, transitionTime);
  });
};

/**
 * Roll the single reel
 */
function rollReel() {
  const slider = document.querySelector(".slider");

  roll(slider).then((delta) => {
    index = (index + delta) % num_icons;
  });
}
//! ------------- Machine animation ------------------
let clickCount = 0;

function slotMachineAnimation() {
  const text = document.getElementById("text");
  const storedQuestions = localStorage.getItem("questions");

  if (storedQuestions) {
    const parsedQuestions = JSON.parse(storedQuestions);
    const indiceRandom = Math.floor(Math.random() * parsedQuestions.length);
    text.textContent = `${parsedQuestions[indiceRandom]}`;
  } else if (
    !storedQuestions ||
    storedQuestions === null ||
    storedQuestions === ""
  ) {
    const indiceRandom = Math.floor(Math.random() * preguntasMap.length);
    text.textContent = `${preguntasMap[indiceRandom]}`;
  }

  const ball = document.getElementById("ball");
  const stick = document.getElementById("stick");
  const arrow = document.getElementById("arrow");
  const ticket = document.getElementById("ticket");

  // Reinicia la animación removiendo y volviendo a agregar la clase
  ball.style.animation = "none";
  stick.style.animation = "none";
  arrow.style.animation = "none";
  ticket.style.animation = "none";
  text.style.animation = "none";

  // Fuerza el navegador a recalcular los estilos
  void ball.offsetWidth;
  void stick.offsetWidth;
  void arrow.offsetWidth;

  // Vuelve a iniciar las animaciones
  ball.style.animation = "ballColorChange 2s forwards";
  stick.style.animation = "stickShorten 2s forwards";
  arrow.style.animation = "win1 1s steps(2, end) infinite";

  // Aplica animación dependiendo del número de clics
  if (clickCount >= 1) {
    ticket.style.animation = "ticketDrop 2s forwards";
  } else {
    ticket.style.animation = "ticket 2s forwards";
  }

  text.style.animation = "ticketText 2s forwards";

  // Incrementa el contador de clics
  clickCount++;
}

// Añade el event listener al botón start

startButton.addEventListener("click", slotMachineAnimation);

// Start button event listener
startButton.addEventListener("click", rollReel);
