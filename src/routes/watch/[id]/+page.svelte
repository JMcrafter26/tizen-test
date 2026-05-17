<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { fetchMovies, type Movie } from '$lib/wikiApi';

    let movie = $state<Movie | null>(null);
    let videoElement = $state<HTMLVideoElement | null>(null);
    let loading = $state(true);
    let movieId = page.params.id;
    let streamUrl = $state("");

    onMount(() => {
        const init = async () => {
            try {
                const { movies: results } = await fetchMovies({ limit: 50 });
                movie = results.find(m => m.id === movieId) || null;
                if (movie && movie.streams.length > 0) {
                    streamUrl = movie.streams[0].url;
                }
            } finally {
                loading = false;
            }
        };

        init();

        const handleKeys = (e: KeyboardEvent) => {
            if (!videoElement) return;
            switch(e.key) {
                case "MediaPlayPause":
                case " ":
                    videoElement.paused ? videoElement.play() : videoElement.pause();
                    break;
                case "MediaStop":
                    videoElement.pause();
                    window.history.back();
                    break;
                case "ArrowLeft":
                    videoElement.currentTime -= 10;
                    break;
                case "ArrowRight":
                    videoElement.currentTime += 10;
                    break;
            }
        };

        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    });

    function goBack() {
        window.history.back();
    }
</script>

<div class="h-screen w-screen bg-black flex items-center justify-center relative group">
    {#if loading}
        <span class="loading loading-circular loading-lg text-red-600"></span>
    {:else if streamUrl}
        <!-- svelte-ignore a11y_media_has_caption -->
        <video 
            bind:this={videoElement}
            src={streamUrl} 
            class="w-full h-full object-contain" 
            controls 
            autoplay 
        >
        </video>

        <!-- Custom Back Button overlay -->
        <div class="absolute top-10 left-10 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick={goBack} tabindex="0" class="btn btn-circle bg-black/50 border-white hover:bg-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
        </div>
    {:else}
        <div class="flex flex-col items-center gap-6">
            <p class="text-xl">Could not load video stream.</p>
            <button class="btn btn-primary" onclick={goBack} tabindex="0">Return</button>
        </div>
    {/if}
</div>

<style>
    :global(main) {
        padding: 0 !important;
    }
</style>