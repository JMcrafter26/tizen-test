export function initSpatialNavigation() {
    if (typeof window === 'undefined') return;

    // Standard TV Remote Key Codes
    const KEYS = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13
    };

    function getFocusableElements() {
        // Query elements that are natively focusable
        return Array.from(document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            // Ensure element is visible
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden';
        });
    }

    function getElementCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function calculateDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }

    function handleKeyDown(e) {
        // Only override directional and enter keys
        if (!Object.values(KEYS).includes(e.keyCode)) return;

        const currentActive = document.activeElement;
        const focusable = getFocusableElements();

        if (focusable.length === 0) return;

        // If nothing is focused, naturally focus the first available item
        if (!focusable.includes(currentActive) && currentActive.tagName.toLowerCase() !== 'body') {
            focusable[0].focus();
            e.preventDefault();
            return;
        }

        // Simulate click on enter
        if (e.keyCode === KEYS.ENTER) {
            currentActive.click();
            e.preventDefault();
            return;
        }

        const currentCenter = getElementCenter(currentActive);
        let bestCandidate = null;
        let minDistance = Infinity;

        focusable.forEach(el => {
            if (el === currentActive) return;

            const elCenter = getElementCenter(el);
            let isValidCandidate = false;

            // Simple 2D directional heuristic with liberal cone overlapping mapping
            switch (e.keyCode) {
                case KEYS.UP:
                    isValidCandidate = elCenter.y < currentCenter.y;
                    break;
                case KEYS.DOWN:
                    isValidCandidate = elCenter.y > currentCenter.y;
                    break;
                case KEYS.LEFT:
                    isValidCandidate = elCenter.x < currentCenter.x;
                    break;
                case KEYS.RIGHT:
                    isValidCandidate = elCenter.x > currentCenter.x;
                    break;
            }

            if (isValidCandidate) {
                // Heavily penalize items that are not in the primary direction's corridor
                let orthogonalDistance = 0;
                let primaryDistance = 0;

                if (e.keyCode === KEYS.UP || e.keyCode === KEYS.DOWN) {
                    orthogonalDistance = Math.abs(elCenter.x - currentCenter.x);
                    primaryDistance = Math.abs(elCenter.y - currentCenter.y);
                } else {
                    orthogonalDistance = Math.abs(elCenter.y - currentCenter.y);
                    primaryDistance = Math.abs(elCenter.x - currentCenter.x);
                }

                // Weighted distance prioritizing items directly in the "lane" above/below/left/right 
                const score = primaryDistance + (orthogonalDistance * 5); 

                if (score < minDistance) {
                    minDistance = score;
                    bestCandidate = el;
                }
            }
        });

        if (bestCandidate) {
            bestCandidate.focus();
            e.preventDefault(); // Prevent standard browser scroll
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus setup to select the first item on load
    setTimeout(() => {
        if (document.activeElement === document.body) {
            const first = getFocusableElements()[0];
            if (first) first.focus();
        }
    }, 100);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}