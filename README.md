# Tizen WebApp Test 📺

A quick test project to figure out how to build a Tizen OS web app using SvelteKit. 

Nothing too crazy or serious here, just a playground to see how these two technologies work together.

## 🛠️ Getting Started

To get the development environment running:

```sh
# Install dependencies
pnpm install

# Start the dev server
pnpm run dev
```

## 📦 Building

To build the static assets for Tizen:

```sh
pnpm run build
```

The output will be generated using the SvelteKit static adapter, ready to be packaged into a Tizen `.wgt` file.

## 🚀 Installation

If you actually want to install this on your TV, the easiest way is to use [TizenBrew](https://github.com/reisxd/TizenBrew).
