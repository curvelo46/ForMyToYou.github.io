import { pergaminos } from "./pergamino/contenidos.js";

let currentScroll = 0;

const scrollTitle = document.getElementById("scrollTitle");
const scrollContent = document.getElementById("scrollContent");
const scrollCount = document.getElementById("scrollCount");
const scrollWrapper = document.getElementById("scrollWrapper");
const previousButton = document.getElementById("previousScroll");
const nextButton = document.getElementById("nextScroll");

function setScrollOpen(isOpen) {
    scrollWrapper.classList.toggle("open", isOpen);
    scrollWrapper.setAttribute("aria-expanded", String(isOpen));
}

window.addEventListener("message", event => {
    if (event.source !== window.parent || event.data?.tipo !== "abrir-pergamino-portal") return;

    setScrollOpen(true);
    scrollContent.scrollTop = 0;
    window.parent.postMessage({ tipo: "pergamino-portal-listo" }, "*");
});

function renderScroll() {
    const scroll = pergaminos[currentScroll];
    scrollTitle.textContent = scroll.title;
    scrollContent.scrollTop = 0;
    scrollContent.replaceChildren(...scroll.lines.map(line => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        return paragraph;
    }));
    scrollCount.textContent = `${currentScroll + 1} / ${pergaminos.length}`;
    previousButton.setAttribute(
        "aria-label",
        `Mostrar el pergamino anterior (${currentScroll + 1} de ${pergaminos.length})`
    );
    nextButton.setAttribute(
        "aria-label",
        `Mostrar el siguiente pergamino (${currentScroll + 1} de ${pergaminos.length})`
    );
}

let isChangingScroll = false;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function changeScroll(direction) {
    if (isChangingScroll) return;
    isChangingScroll = true;

    if (scrollWrapper.classList.contains("open")) {
        scrollWrapper.classList.add("changing");
        setScrollOpen(false);
        await wait(1400);
    }

    currentScroll = (currentScroll + direction + pergaminos.length) % pergaminos.length;
    renderScroll();
    setScrollOpen(true);
    scrollWrapper.classList.remove("changing");

    await wait(80);
    isChangingScroll = false;
}

previousButton.addEventListener("click", event => {
    event.stopPropagation();
    changeScroll(-1);
});

nextButton.addEventListener("click", event => {
    event.stopPropagation();
    changeScroll(1);
});

scrollContent.addEventListener("click", event => event.stopPropagation());

scrollWrapper.addEventListener("click", () => {
    setScrollOpen(!scrollWrapper.classList.contains("open"));
});

scrollWrapper.addEventListener("keydown", event => {
    if (event.target !== scrollWrapper || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    setScrollOpen(!scrollWrapper.classList.contains("open"));
});

renderScroll();
