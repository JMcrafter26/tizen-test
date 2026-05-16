/**
 * TV Spatial Navigation utility
 * Focuses elements based on 2D coordinates and D-pad input.
 */

export function initSpatialNavigation(): () => void {
    if (typeof window === "undefined") return () => {};

    const handleKeyDown = (e: KeyboardEvent) => {
        const focusableSelectors = "a, button, [tabindex=\"0\"]";
        const current = document.activeElement as HTMLElement;

        if (e.key === "Enter" && current) {
            current.click();
            return;
        }

        const focusables = Array.from(document.querySelectorAll<HTMLElement>(focusableSelectors))
            .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && el.offsetParent !== null;
            });

        if (!focusables.length) return;

        if (!current || current === document.body) {
            focusables[0].focus();
            return;
        }

        const currRect = current.getBoundingClientRect();
        const currCenter = {
            x: currRect.left + currRect.width / 2,
            y: currRect.top + currRect.height / 2
        };

        let next: HTMLElement | null = null;
        let minDistance = Infinity;

        focusables.forEach(target => {
            if (target === current) return;

            const targetRect = target.getBoundingClientRect();
            const targetCenter = {
                x: targetRect.left + targetRect.width / 2,
                y: targetRect.top + targetRect.height / 2
            };

            const dx = targetCenter.x - currCenter.x;
            const dy = targetCenter.y - currCenter.y;

            let isHeading = false;
            switch(e.key) {
                case "ArrowUp":    isHeading = dy < 0 && Math.abs(dx) < Math.abs(dy) * 1.5; break;
                case "ArrowDown":  isHeading = dy > 0 && Math.abs(dx) < Math.abs(dy) * 1.5; break;
                case "ArrowLeft":  isHeading = dx < 0 && Math.abs(dy) < Math.abs(dx) * 1.5; break;
                case "ArrowRight": isHeading = dx > 0 && Math.abs(dy) < Math.abs(dx) * 1.5; break;
            }

            if (isHeading) {
                const distance = Math.pow(dx, 2) + Math.pow(dy, 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    next = target;
                }
            }
        });

        if (next) {
            (next as HTMLElement).focus();
            e.preventDefault();
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}