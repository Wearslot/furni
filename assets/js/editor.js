window.addEventListener("message", (e) => {
    const data = e.data;
    if (data.action === 'taojaa:section:select') {
        document.querySelector(`[data-name="${data.target}"]`).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
        return;
    }

    const event = new Event(data.action, { bubbles: true });
    document.dispatchEvent(event);
})


document.addEventListener('taojaa:section:disable-inspector', () => {
    document.querySelectorAll('.taojaa-editor-wrapper').forEach((e) => {
        e.classList.add('no-inspector')
    });
});

document.addEventListener('taojaa:section:enable-inspector', () => {
    document.querySelectorAll('.taojaa-editor-wrapper').forEach((e) => {
        e.classList.remove('no-inspector')
    });
});