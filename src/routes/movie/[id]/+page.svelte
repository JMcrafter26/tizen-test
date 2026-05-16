<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { fetchMovies, type Movie } from '$lib/wikiApi';

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

<div class="min-h-screen bg-black text-white">
    {#if loading}
        <div class="h-screen w-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-red-600"></span>
        </div>
    {:else if movie}
        <div class="relative h-screen flex flex-col items-center justify-center p-20 overflow-hidden">
            <!-- Background Backdrop -->
            <div class="absolute inset-0 z-0">
                <img src={movie.poster_url} class="w-full h-full object-cover blur-2xl opacity-30" alt="backdrop" />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div class="relative z-10 flex flex-col md:flex-row gap-12 max-w-6xl w-full">
                <!-- Poster -->
                <div class="w-full md:w-1/3 flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/10">
                    <img src={movie.poster_url} class="w-full h-full object-cover" alt={movie.title} />
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col gap-8 justify-center">
                    <h1 class="text-7xl font-black uppercase tracking-tighter leading-none text-red-600">{movie.title}</h1>
                    
                    <div class="flex gap-4 text-gray-400 font-bold items-center">
                        <span class="px-2 py-0.5 border border-gray-600 text-xs rounded uppercase">Public Domain</span>
                        <span>{movie.date || 'Unknown Date'}</span>
                        <span>{movie.author || 'Unknown Artist'}</span>
                    </div>

                    <p class="text-2xl text-gray-300 leading-relaxed max-w-2xl">{movie.description || 'No description available for this public domain archive.'}</p>

                    <div class="flex gap-4 mt-6">
                        <a href={`/watch/${movie.id}`} tabindex="0" class="btn btn-xl bg-red-600 text-white hover:bg-red-700 border-none px-12 gap-3 flex items-center font-black rounded-lg scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            WATCH NOW
                        </a>
                        <button onclick={goBack} tabindex="0" class="btn btn-xl bg-white/10 text-white hover:bg-white/20 border-white/20 px-8 rounded-lg font-bold">
                            Go Back
                        </button>
                    </div>

                    <div class="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-8 text-sm uppercase tracking-widest text-gray-500">
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