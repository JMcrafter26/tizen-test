<script>
    const playlists = [
        "Classic",
        "2011 Hit song",
        "In the gym",
        "For baby",
        "My favorite"
    ];
</script>

<svelte:head>
    <title>Play List</title>
</svelte:head>

<h2 class="text-4xl font-bold mb-8 text-base-content">Play List</h2>

<ul class="menu bg-base-200/50 rounded-box w-full max-w-3xl shadow-xl gap-3 p-4">
    {#each playlists as list}
    <li>
        <a href="#" tabindex="0" class="text-3xl py-6 px-8 rounded-xl transition-all">
            {list}
        </a>
    </li>
    {/each}
</ul>