<script>
    const songs = [
        "All I Want For Christmas Is You",
        "Baby It's Cold Outside",
        "Last Christmas",
        "What child Is This",
        "White Christmas"
    ];
</script>

<svelte:head>
    <title>Music</title>
</svelte:head>

<h2 class="text-4xl font-bold mb-8 text-base-content">Music</h2>

<ul class="menu bg-base-200/50 rounded-box w-full max-w-3xl shadow-xl gap-3 p-4">
    {#each songs as song}
    <li>
        <a href="#" tabindex="0" class="text-3xl py-6 px-8 rounded-xl transition-all">
            {song}
        </a>
    </li>
    {/each}
</ul>