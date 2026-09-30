// ======================================================
// utils.js — funciones auxiliares
// ======================================================

export const rand = (min, max) => min + Math.random() * (max - min);

export const randInt = (min, max) =>
    Math.floor(rand(min, max + 1));

export const pick = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

/** Debounce para eventos como resize */
export function debounce(fn, ms = 150) {
    let id;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => fn(...args), ms);
    };
}
