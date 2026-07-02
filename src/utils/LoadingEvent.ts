export const loadingEvent = {
    onTrigger: (callback: (show: boolean) => void) => {
        window.addEventListener('toggle-loading', ((e: CustomEvent) => {
            callback(e.detail);
        }) as EventListener);
    },
    show: () => {
        window.dispatchEvent(new CustomEvent('toggle-loading', { detail: true }));
    },
    hide: () => {
        window.dispatchEvent(new CustomEvent('toggle-loading', { detail: false }));
    }
};