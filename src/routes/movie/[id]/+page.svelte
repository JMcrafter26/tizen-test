<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { fetchMovies, type Movie } from '$lib/wikiApi';
    import { Play, ArrowLeft, ShieldCheck, Film } from 'lucide-svelte';

    let movie = $state<Movie | null>(null);
    let loading = $state(true);
    let movieId = page.params.id;

    onMount(async () => {
        try {
            const { movies: results } = await fetchMovies({ limit: 50 });
            movie = results.find(m => m.id === movieId) || null;
        } finally {
            loading = false;
        }
    });

    function goBack() {
        window.history.back();
    }
</script>

<div class="min-h-screen bg-black text-white selection:bg-red-600">
    {#if loading}
        <div class="h-screen w-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-red-600"></span>
        </div>
    {:else if movie}
        <div class="relative min-h-screen flex flex-col items-center justify-center p-8 md:p-20 overflow-x-hidden">
            <!-- Background Backdrop -->
            <div class="absolute inset-0 z-0">
                <img src={movie.poster_url} class="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="backdrop" />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/40"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            <div class="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-7xl w-full items-center lg:items-start pt-10">
                <!-- Poster -->
                <div class="w-[60%] sm:w-[40%] lg:w-1/3 flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/5 transition-transform hover:scale-105 duration-500">
                    <img src={movie.poster_url} class="w-full h-auto object-cover aspect-[2/3]" alt={movie.title} />
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col gap-6 justify-center w-full mt-4 lg:mt-0">
                    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-lg" style="text-shadow: 2px 2px 0px rgba(220, 38, 38, 0.5);">
                        {movie.title}
                    </h1>
                    
                    <div class="flex flex-wrap gap-3 sm:gap-4 text-gray-300 font-bold items-center text-sm sm:text-base">
                        <span class="px-2 py-1 border border-gray-600 text-xs rounded uppercase flex items-center gap-1 bg-white/5">
                            <ShieldCheck size={14} class="text-red-500"/> Public Domain
                        </span>
                        <span class="flex items-center gap-1"><Film size={16} class="text-gray-500"/> {movie.date?.slice(0,4) || 'Unknown Year'}</span>
                        <span class="opacity-50 text-xl">•</span>
                        <span>{movie.author || 'Unknown Artist'}</span>
                    </div>

                    <p class="text-lg sm:text-2xl text-gray-300 leading-relaxed max-w-3xl font-medium">
                        {movie.description || 'No description available for this public domain archive.'}
                    </p>

                    <div class="flex flex-wrap gap-4 mt-4 sm:mt-8 relative z-20">
                        <a href={`/watch/${movie.id}`} tabindex="0" class="btn bg-red-600 hover:bg-red-700 text-white border-none px-8 py-3 sm:px-12 sm:py-4 h-auto text-lg sm:text-xl gap-3 flex items-center font-black rounded-lg transition-all scale-100 hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-white">
                            <Play size={24} fill="currentColor" />
                            WATCH NOW
                        </a>
                        <button onclick={goBack} tabindex="0" class="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 sm:px-8 sm:py-4 h-auto text-lg sm:text-xl rounded-lg font-bold transition-all focus:scale-105 focus:ring-4 focus:ring-white">
                            <ArrowLeft size={24} />
                            Go Back
                        </button>
                    </div>

                    <div class="mt-8 sm:mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm uppercase tracking-widest text-gray-500">
                        <div>
                            <span class="block font-black text-white mb-2">License</span>
                            {movie.license}
                        </div>
                        <div>
                            <span class="block font-black text-white mb-2">Source</span>
                            Wikimedia Commons
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="h-screen w-full flex flex-col items-center justify-center gap-6">
            <h1 class="text-4xl font-bold">Movie not found</h1>
            <a href="/" class="btn btn-primary" tabindex="0">Return Home</a>
        </div>
    {/if}
</div>