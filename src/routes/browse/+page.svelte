<script>
    const categories = [
        { name: "Public Domain Action", query: "Action" },
        { name: "Animation & NASA", query: "NASA" },
        { name: "Classic Cartoons", query: "Cartoon" },
        { name: "History & Documentary", query: "History" },
        { name: "Silent Films", query: "Silent" },
        { name: "Black & White Clips", query: "Monochrome" }
    ];
</script>

<div class="p-16 min-h-screen bg-black flex flex-col gap-12">
    <h1 class="text-5xl font-black uppercase tracking-tighter">Browse Categories</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each categories as cat}
            <a 
                href={`/search?q=${cat.query}`} 
                tabindex="0"
                class="h-40 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-3xl font-bold hover:bg-white/10 hover:border-red-600 focus:bg-red-600 focus:text-white transition-all overflow-hidden relative group"
            >
                <div class="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-10 group-focus:opacity-100 transition-opacity"></div>
                <span class="z-10">{cat.name}</span>
            </a>
        {/each}
    </div>
</div>