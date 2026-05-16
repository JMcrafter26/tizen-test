<script>
    const artistsGroups = [
        {
            letter: "A",
            artists: ["Adam Lambert", "Adele", "Amy Winehouse"]
        },
        {
            letter: "B",
            artists: ["Beyonce"]
        },
        {
            letter: "C",
            artists: ["Chris Brown"]
        }
    ];
</script>

<svelte:head>
    <title>Artists</title>
</svelte:head>

<h2 class="text-4xl font-bold mb-8 text-base-content">Artists</h2>

<ul class="menu bg-base-200/50 rounded-box w-full max-w-3xl shadow-xl gap-3 p-4">
    {#each artistsGroups as group}
        <li class="menu-title text-2xl font-bold text-primary px-6 mt-4 first:mt-0 opacity-80">{group.letter}</li>
        {#each group.artists as artist}
        <li>
            <a href="#" tabindex="0" class="text-3xl py-6 px-8 rounded-xl transition-all">
                {artist}
            </a>
        </li>
        {/each}
    {/each}
</ul>