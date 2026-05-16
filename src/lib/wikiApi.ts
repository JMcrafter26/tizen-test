/**
 * Wikimedia Commons API Helper for Public Domain Movies
 * Replicates the logic from test/wiki.py in TypeScript
 */

const API_BAR = "https://commons.wikimedia.org/w/api.php";

export interface MovieStream {
    resolution: string;
    format: string;
    url: string;
}

export interface Movie {
    id: string;
    title: string;
    author: string;
    date: string;
    license: string;
    description: string;
    poster_url: string;
    source_page: string;
    streams: MovieStream[];
}

export interface FetchMoviesOptions {
    term?: string;
    limit?: number;
    continueToken?: Record<string, string> | null;
}

function cleanHtml(raw: string | undefined): string {
    if (!raw) return "Unknown";
    return raw
        .replace(/<[^>]+>/g, "")
        .replace(/&quot;/g, "\"")
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
}

export interface FetchMoviesResult {
    movies: Movie[];
    continueToken: Record<string, string> | null;
}

export async function fetchMovies({ term = "", limit = 10, continueToken = null }: FetchMoviesOptions = {}): Promise<FetchMoviesResult> {
    const baseFilter = "incategory:\"Videos_of_films_in_the_public_domain\" filetype:video";
    const query = term ? term + " " + baseFilter : baseFilter;

    const url = new URL(API_BAR);
    const params: Record<string, string> = {
        action: "query",
        format: "json",
        generator: "search",
        gsrsearch: query,
        gsrlimit: limit.toString(),
        gsrnamespace: "6",
        prop: "imageinfo",
        iiprop: "url|extmetadata|derivatives",
        iiurlwidth: "800",
        origin: "*"
    };

    if (continueToken) {
        Object.assign(params, continueToken);
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("HTTP error! status: " + response.status);
        const data = await response.json();
        return {
            movies: parseResults(data),
            continueToken: data.continue || null
        };
    } catch (e) {
        console.error("API Error:", e);
        return { movies: [], continueToken: null };
    }
}

function parseResults(data: any): Movie[] {
    const movies: Movie[] = [];
    if (data.query && data.query.pages) {
        const pages = data.query.pages;
        Object.keys(pages).sort().forEach(pageId => {
            const info = pages[pageId];
            const mediaList = info.imageinfo || [];
            if (mediaList.length === 0) return;

            const media = mediaList[0];
            const meta = media.extmetadata || {};

            const movie: Movie = {
                id: pageId,
                title: info.title.replace("File:", ""),
                author: cleanHtml(meta.Artist?.value),
                date: cleanHtml(meta.DateTimeOriginal?.value),
                license: meta.LicenseShortName?.value || "Public Domain",
                description: cleanHtml(meta.ImageDescription?.value),
                poster_url: media.thumburl,
                source_page: media.descriptionurl,
                streams: []
            };

            movie.streams.push({
                resolution: "original",
                format: media.url.split(".").pop() || "unknown",
                url: media.url
            });

            if (media.derivatives) {
                media.derivatives.forEach((d: any) => {
                    movie.streams.push({
                        resolution: d.width + "x" + d.height,
                        format: d.type.split("/").pop() || "unknown",
                        url: d.src
                    });
                });
            }
            movies.push(movie);
        });
    }
    return movies;
}