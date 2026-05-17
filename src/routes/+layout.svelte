<script lang="ts">
    import "../app.css";
    import { onMount, tick } from "svelte";
    import { page } from "$app/state";
    import { afterNavigate } from "$app/navigation";
    import { initSpatialNavigation } from "$lib/tvNavigation";

    let { children } = $props();
    let spatialNavCleanup: (() => void) | undefined;

    onMount(() => {
        spatialNavCleanup = initSpatialNavigation();

        function onHardwareKey(e: any) {
            if (e.keyName === "back") {
                const activeElement = document.activeElement as HTMLElement;
                const isSidebarFocused = activeElement?.closest('.sidebar-nav') !== null;
                const isDetailView = page.url.pathname.startsWith("/movie/") || page.url.pathname.startsWith("/watch/");
                
                if (isDetailView) {
                    window.history.back();
                } else if (!isSidebarFocused) {
                    // If we are in the main content and press back, jump to sidebar
                    const firstSidebarItem = document.querySelector(".sidebar-nav a") as HTMLElement;
                    if (firstSidebarItem) {
                        firstSidebarItem.focus();
                    }
                } else {
                    try {
                        const tizenApp = window.tizen ? window.tizen.application.getCurrentApplication() : null;
                        if (tizenApp) tizenApp.exit();
                    } catch (ignore) {}
                }
            }
        }
        
        document.addEventListener("tizenhwkey", onHardwareKey);

        return () => {
            if (spatialNavCleanup) spatialNavCleanup();
            document.removeEventListener("tizenhwkey", onHardwareKey);
        };
    });

    afterNavigate(() => {
        // Automatically focus the first focusable element in main content when page changes
        tick().then(() => {
            const mainContent = document.querySelector("main");
            if (mainContent) {
                const firstFocusable = mainContent.querySelector('a, button, [tabindex="0"]') as HTMLElement;
                if (firstFocusable) {
                    firstFocusable.focus();
                } else {
                    // Fallback to sidebar if main is empty
                    const firstSidebarItem = document.querySelector(".sidebar-nav a") as HTMLElement;
                    if (firstSidebarItem) firstSidebarItem.focus();
                }
            }
        });
    });
</script>

<div class="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-red-600" data-theme="dark">
    <aside 
        class="bg-black/95 flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-white/10 overflow-hidden sidebar-nav w-20 focus-within:w-64 focus-within:shadow-[20px_0_50px_rgba(0,0,0,0.8)] group {page.url.pathname.startsWith('/watch/') ? '!hidden' : ''}"
    >
        <div class="p-6 shrink-0 h-24 flex items-center relative">
            <h1 class="text-2xl font-black text-red-600 tracking-tighter transition-all duration-300 absolute opacity-0 group-focus-within:opacity-100 group-focus-within:relative">WIKIFLIX</h1>
            <div class="w-10 h-10 bg-red-600 rounded flex items-center justify-center transition-all mx-auto absolute group-focus-within:opacity-0 group-focus-within:absolute opacity-100 relative">
                <span class="text-white font-black">W</span>
            </div>
        </div>
        
        <ul class="menu flex-1 px-4 gap-6 text-xl mt-4 p-0">
            <li>
                <a href="/" tabindex="0" class="flex items-center gap-4 py-4 px-3 rounded-lg hover:bg-white/10 {page.url.pathname === '/' ? 'text-white border-l-4 border-red-600 bg-white/5' : 'text-gray-400'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span class="transition-all duration-200 whitespace-nowrap opacity-0 w-0 overflow-hidden group-focus-within:opacity-100 group-focus-within:w-auto">Home</span>
                </a>
            </li>
            <li>
                <a href="/search" tabindex="0" class="flex items-center gap-4 py-4 px-3 rounded-lg hover:bg-white/10 {page.url.pathname === '/search' ? 'text-white border-l-4 border-red-600 bg-white/5' : 'text-gray-400'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span class="transition-all duration-200 whitespace-nowrap opacity-0 w-0 overflow-hidden group-focus-within:opacity-100 group-focus-within:w-auto">Search</span>
                </a>
            </li>
            <li class="mt-auto mb-6 shrink-0">
                <a href="/about" tabindex="0" class="flex items-center gap-4 py-4 px-3 rounded-lg hover:bg-white/10 {page.url.pathname === '/about' ? 'text-white border-l-4 border-red-600 bg-white/5' : 'text-gray-400'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span class="transition-all duration-200 whitespace-nowrap opacity-0 w-0 overflow-hidden group-focus-within:opacity-100 group-focus-within:w-auto">About</span>
                </a>
            </li>
        </ul>
    </aside>

    <main class="flex-1 overflow-y-auto outline-none overflow-x-hidden relative" tabindex="-1">
        {@render children()}
    </main>
</div>

<style>
    :global(body) {
        background-color: black;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    :global(a:focus), :global(button:focus), :global(input:focus) {
        outline: 4px solid white;
        outline-offset: 4px;
        transform: scale(1.05);
        z-index: 100;
        transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .sidebar-nav a:focus {
        transform: scale(1.02);
        outline-width: 2px;
    }

    :global(::-webkit-scrollbar) {
        width: 8px;
    }
    :global(::-webkit-scrollbar-track) {
        background: transparent;
    }
    :global(::-webkit-scrollbar-thumb) {
        background: #333;
        border-radius: 10px;
    }
    :global(::-webkit-scrollbar-thumb:hover) {
        background: #dc2626;
    }
</style>