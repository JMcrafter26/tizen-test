<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchMovies, type Movie } from '$lib/wikiApi';

    interface Row {
        title: string;
        movies: Movie[];
    }

    let featuredMovie = $state<Movie | null>(null);
    let rows = $state<Row[]>([
        { title: 'Popular Movies', movies: [] },
        { title: 'Public Domain Classics', movies: [] },
        { title: 'Recently Added', movies: [] }
    ]);
    let loading = $state(true);

    onMount(async () => {
        try {
            const { movies: allMovies } = await fetchMovies({ limit: 30 });
            if (allMovies.length > 0) {
                featuredMovie = allMovies[0];
                rows[0].movies = allMovies.slice(1, 11);
                rows[1].movies = allMovies.slice(11, 21);
                rows[2].movies = allMovies.slice(21, 31);
            }
        } finally {
            loading = false;
        }
    });
</script>

<div class="min-h-screen bg-black overflow-x-hidden">
    {#if loading}
        <div class="h-screen w-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-red-600"></span>
        </div>
    {:else}
        <!-- Hero Billboard -->
        {#if featuredMovie}
        <section class="relative h-[85vh] w-full overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            
            <img 
                src={featuredMovie.poster_url || 'https://via.placeholder.com/1920x1080?text=No+Preview'} 
                alt={featuredMovie.title}
                class="absolute inset-0 w-full h-full object-cover scale-105"
            />
            
            <div class="relative z-20 h-full flex flex-col justify-center px-16 max-w-2xl gap-6">
                <h1 class="text-6xl font-black uppercase tracking-tighter leading-none">{featuredMovie.title}</h1>
                <p class="text-xl text-gray-300 line-clamp-3">{featuredMovie.description || 'Watch this public domain classic directly from Wikimedia.'}</p>
                <div class="flex gap-4">
                    <a href={`/watch/${featuredMovie.id}`} tabindex="0" class="btn btn-lg bg-white text-black hover:bg-white/80 border-none px-10 gap-2 flex items-center font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Play
                    </a>
                    <a href={`/movie/${featuredMovie.id}`} tabindex="0" class="btn btn-lg bg-gray-500/50 text-white hover:bg-gray-500/70 border-none px-10 gap-2 flex items-center font-bold backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        More Info
                    </a>
                </div>
            </div>
        </section>
        {/if}

        <!-- Content Rows -->
        <div class="flex flex-col gap-12 px-16 -mt-32 relative z-30 pb-20">
            {#each rows as row}
                {#if row.movies.length > 0}
                <div class="flex flex-col gap-4">
                    <h2 class="text-2xl font-bold text-gray-200">{row.title}</h2>
                    <div class="carousel carousel-center w-full space-x-4 p-2">
                        {#each row.movies as movie}
                            <div class="carousel-item">
                                <a 
                                    href={`/movie/${movie.id}`} 
                                    tabindex="0"
                                    class="relative w-64 h-36 rounded-md overflow-hidden bg-white/5 block hover:scale-105 focus:scale-110 transition-transform duration-300"
                                >
                                    <img 
                                        src={movie.poster_url || 'https://via.placeholder.com/300x168?text=Movie'} 
                                        alt={movie.title}
                                        class="w-full h-full object-cover"
                                    />
                                    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                        <p class="text-xs font-bold truncate text-white">{movie.title}</p>
                                    </div>
                                </a>
                            </div>
                        {/each}
                    </div>
                </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    :global(.menu a:focus) {
        border-left: 4px solid #dc2626; /* border-red-600 */
    }
</style>