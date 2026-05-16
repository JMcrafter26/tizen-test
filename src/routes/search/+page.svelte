<script lang="ts">
    import { onMount, tick } from "svelte";
    import { fetchMovies, type Movie } from "$lib/wikiApi";

    // Categories (for UI only)
    const categories = [
        "Sci-Fi", "Comedy", "NASA", "Silent", "Horror", "Drama", "Action", "Documentary"
    ];

    // State
    let query = $state("");
    let allMovies = $state<Movie[]>([]);
    let filteredMovies = $state<Movie[]>([]);
    let continueToken = $state<Record<string, string> | null>(null);
    let loading = $state(false);
    let initialLoading = $state(true);
    let scrollContainer = $state<HTMLElement | null>(null);

    // Virtualization state (calculated based on scroll)
    let containerHeight = $state(0);
    let scrollTop = $state(0);
    const itemHeight = 350; // Approximated height of movie item + gap
    const itemsPerRow = 4;
    
    // Derived values for vitualization
    let visibleStartIndex = $derived(Math.max(0, Math.floor(scrollTop / itemHeight) * itemsPerRow - itemsPerRow));
    let visibleEndIndex = $derived(Math.min(filteredMovies.length, visibleStartIndex + (Math.ceil(containerHeight / itemHeight) + 3) * itemsPerRow));
    let visibleMovies = $derived(filteredMovies.slice(visibleStartIndex, visibleEndIndex));
    let paddingTop = $derived(Math.floor(visibleStartIndex / itemsPerRow) * itemHeight);
    let paddingBottom = $derived(Math.max(0, Math.ceil((filteredMovies.length - visibleEndIndex) / itemsPerRow) * itemHeight));

    onMount(async () => {
        initialLoading = true;
        await loadMore();
        initialLoading = false;
        
        if (scrollContainer) {
            containerHeight = scrollContainer.clientHeight;
        }
    });

    async function loadMore() {
        if (loading) return;
        loading = true;
        try {
            const result = await fetchMovies({ 
                limit: 40,
                continueToken: continueToken
            });
            allMovies = [...allMovies, ...result.movies];
            continueToken = result.continueToken;
            applyFilter();
        } finally {
            loading = false;
        }
    }

    function applyFilter() {
        if (!query.trim()) {
            filteredMovies = allMovies;
        } else {
            const q = query.toLowerCase();
            filteredMovies = allMovies.filter(m => 
                m.title.toLowerCase().includes(q) || 
                m.description.toLowerCase().includes(q)
            );
        }
    }

    function handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        scrollTop = target.scrollTop;
        containerHeight = target.clientHeight;

        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 500) {
            if (continueToken && !loading) {
                loadMore();
            }
        }
    }

    function onSearchInput() {
        applyFilter();
    }

    function handleKey(e: KeyboardEvent) {
        if (e.key === "Enter") {
            // Keep focus in input but apply filter
            applyFilter();
        }
    }
</script>

<div 
    bind:this={scrollContainer}
    onscroll={handleScroll}
    class="h-screen bg-black overflow-y-auto overflow-x-hidden flex flex-col"
>
    <!-- Header/Search Area -->
    <div class="px-16 pt-16 pb-8 flex flex-col gap-10 shrink-0">
        <h1 class="text-5xl font-black uppercase tracking-tighter">Browse</h1>
        
        <!-- Search Box -->
        <div class="relative w-full max-w-4xl">
            <input 
                type="text" 
                bind:value={query} 
                oninput={onSearchInput}
                onkeydown={handleKey}
                placeholder="Type to filter or find movies..." 
                tabindex="0"
                class="w-full bg-white/10 border-none text-2xl p-6 rounded-lg focus:outline-4 focus:outline-red-600 transition-all text-white placeholder:text-gray-500"
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Static Categories -->
        <div class="flex flex-col gap-4">
            <h2 class="text-sm font-black uppercase tracking-widest text-gray-400">Categories</h2>
            <div class="flex flex-wrap gap-3">
                {#each categories as cat}
                    <button 
                        tabindex="0" 
                        class="px-6 py-2 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all font-bold"
                        onclick={() => { query = cat; applyFilter(); }}
                    >
                        {cat}
                    </button>
                {/each}
            </div>
        </div>
    </div>

    <!-- Results Grid with manual Virtualization -->
    <div class="px-16 pb-20 flex-1">
        {#if initialLoading}
            <div class="flex justify-center p-20">
                <span class="loading loading-bars loading-lg text-red-600"></span>
            </div>
        {:else if filteredMovies.length === 0}
            <div class="flex flex-col items-center justify-center p-20 gap-4 opacity-50">
                <span class="text-6xl text-gray-600">¯\_(ツ)_/¯</span>
                <p class="text-xl">No movies found matching "{query}"</p>
                <button class="btn btn-ghost" onclick={() => { query = ""; applyFilter(); }}>Clear Filter</button>
            </div>
        {:else}
            <!-- Virtualized Container -->
            <div style="padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px;">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {#each visibleMovies as movie (movie.id)}
                        <a 
                            href={`/movie/${movie.id}`} 
                            tabindex="0"
                            class="group flex flex-col gap-3 focus:outline-4 focus:outline-red-600 rounded-lg p-2 transition-all duration-300"
                        >
                            <div class="aspect-video w-full overflow-hidden rounded-md bg-white/5 relative shadow-lg">
                                <img 
                                    src={movie.poster_url || "https://via.placeholder.com/300x168?text=Movie"} 
                                    alt={movie.title}
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <h3 class="font-bold truncate group-hover:text-red-600 transition-colors">{movie.title}</h3>
                                <div class="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    <span class="px-1.5 py-0.5 border border-gray-800 rounded">{movie.date?.slice(0,4) || "Archive"}</span>
                                    <span>Public Domain</span>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>

            {#if loading && !initialLoading}
                <div class="flex justify-center p-10">
                    <span class="loading loading-spinner text-red-600"></span>
                </div>
            {/if}
        {/if}
    </div>
</div>