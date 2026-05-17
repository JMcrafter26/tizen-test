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

            let isHeading = false;
            let primaryDist = 0;
            let crossDist = 0;

            switch(e.key) {
                case "ArrowUp":    
                    isHeading = targetRect.bottom <= currRect.top || (targetCenter.y < currCenter.y && targetRect.top < currRect.top); 
                    primaryDist = Math.max(0, currRect.top - targetRect.bottom);
                    crossDist = Math.abs(targetCenter.x - currCenter.x);
                    break;
                case "ArrowDown":  
                    isHeading = targetRect.top >= currRect.bottom || (targetCenter.y > currCenter.y && targetRect.bottom > currRect.bottom); 
                    primaryDist = Math.max(0, targetRect.top - currRect.bottom);
                    crossDist = Math.abs(targetCenter.x - currCenter.x);
                    break;
                case "ArrowLeft":  
                    isHeading = targetRect.right <= currRect.left || (targetCenter.x < currCenter.x && targetRect.left < currRect.left); 
                    primaryDist = Math.max(0, currRect.left - targetRect.right);
                    crossDist = Math.abs(targetCenter.y - currCenter.y);
                    break;
                case "ArrowRight": 
                    isHeading = targetRect.left >= currRect.right || (targetCenter.x > currCenter.x && targetRect.right > currRect.right); 
                    primaryDist = Math.max(0, targetRect.left - currRect.right);
                    crossDist = Math.abs(targetCenter.y - currCenter.y);
                    break;
            }

            if (isHeading) {
                let overlap = 0;
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    overlap = Math.max(0, Math.min(currRect.right, targetRect.right) - Math.max(currRect.left, targetRect.left));
                } else {
                    overlap = Math.max(0, Math.min(currRect.bottom, targetRect.bottom) - Math.max(currRect.top, targetRect.top));
                }

                // If elements overlap in the cross axis, prioritize them heavily
                const adjustedCrossDist = overlap > 0 ? 0 : crossDist;
                
                // Weight primary distance more than cross distance
                const distance = (primaryDist * 10) + adjustedCrossDist; 

                if (distance < minDistance) {
                    minDistance = distance;
                    next = target;
                }
            }
        });

        if (next) {
            (next as HTMLElement).focus({ preventScroll: true });
            (next as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            e.preventDefault();
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}