<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { initSpatialNavigation } from '$lib/tvNavigation.js';

    let { children } = $props();
    let spatialNavCleanup;

    onMount(() => {
        // Initialize TV spatial navigation (D-pad support)
        spatialNavCleanup = initSpatialNavigation();

        // Initialize Tizen back hardware key
        function onHardwareKey(e) {
            if (e.keyName === 'back') {
                try {
                    const tizenApp = typeof tizen !== 'undefined' ? tizen.application.getCurrentApplication() : null;
                    if (window.history.length > 1 && window.location.pathname !== '/') {
                        window.history.back();
                    } else if (tizenApp) {
                        tizenApp.exit();
                    }
                } catch (ignore) {
                    console.log('Tizen API not available locally during testing');
                }
            }
        }
        
        if (typeof document !== 'undefined') {
            document.addEventListener('tizenhwkey', onHardwareKey);
        }

        return () => {
            if (spatialNavCleanup) spatialNavCleanup();
            if (typeof document !== 'undefined') {
                document.removeEventListener('tizenhwkey', onHardwareKey);
            }
        };
    });
</script>

<div class="flex h-screen bg-base-300 text-base-content overflow-hidden" data-theme="dark">
    <!-- Side Navigation / Sidebar (Better for TV 16:9 Displays) -->
    <aside class="w-72 bg-base-100 flex flex-col shadow-2xl z-20 border-r border-base-200">
        <div class="p-8 pb-4">
            <h1 class="text-3xl font-extrabold text-primary tracking-tight">TizenAudio<span class="text-base-content">TV</span></h1>
        </div>
        
        <ul class="menu flex-1 p-4 gap-4 text-xl mt-4">
            <li>
                <a href="/" tabindex="0" class="py-4 px-6 rounded-xl transition-all {page.url.pathname === '/' ? 'bg-secondary text-secondary-content' : 'hover:bg-base-200'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Play List
                </a>
            </li>
            <li>
                <a href="/section1" tabindex="0" class="py-4 px-6 rounded-xl transition-all {page.url.pathname === '/section1' ? 'bg-secondary text-secondary-content' : 'hover:bg-base-200'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Music
                </a>
            </li>
            <li>
                <a href="/section2" tabindex="0" class="py-4 px-6 rounded-xl transition-all {page.url.pathname === '/section2' ? 'bg-secondary text-secondary-content' : 'hover:bg-base-200'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Artist
                </a>
            </li>
        </ul>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto p-12 outline-none relative" tabindex="-1">
        {@render children()}
    </main>
</div>

<style>
    /* TV Spatial Navigation styling. Using :global so it applies everywhere */
    :global(a:focus), :global(button:focus), :global(li:focus) {
        outline: 6px solid oklch(var(--p));
        outline-offset: 4px;
        transform: scale(1.02);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        transition: all 0.15s ease-out;
        z-index: 50;
    }
    
    :global(::-webkit-scrollbar) {
        display: none; /* Hide scrollbars for TV look */
    }
</style>
