const stylesheets = new Map();

export function loadStylesheet(url) {
    const href = new URL(url, import.meta.url).href;
    const existing = stylesheets.get(href);
    if (existing) return existing;

    const stylesheet = new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => {
            const error = new Error(`No se pudo cargar la hoja de estilos: ${href}`);
            console.error("[Styles] Error cargando CSS:", error);
            reject(error);
        };
        document.head.appendChild(link);
    });

    stylesheets.set(href, stylesheet);
    return stylesheet;
}
