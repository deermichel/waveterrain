# [waveterrain](https://deermichel.me/waveterrain/)
![screenshot](img/screenshot.png)
Imagine taking a 3D terrain and interpreting the height values along a path as samples of an audio signal. 
That's the concept behind wave terrain synthesis.

Inspired by [this](https://mu.krj.st/assignments/osc_s.html) article, I created an interactive demo that allows you to explore wave terrain synthesis directly in your browser.
It is at the same time my playground for cutting edge web stuff.

This project is explicitly open for contributions, and if you need inspiration, just pick one of the items from the [roadmap](#roadmap).
If you have any further questions or want to discuss an idea, feel free to reach out to me.

Should this project become mature enough, I consider packaging it as a VST/AU plugin so that it can be used in other audio software.

## Roadmap
TODO

## Tech Stack
- [three.js](https://threejs.org/) - for the gorgeous 3D visualization
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - specifically the `AudioWorkletProcessor` for sound synthesis
- [emscripten](https://emscripten.org/) - moving the audio processing code to WebAssembly is still a TODO
- [svelte](https://svelte.dev/) - people said it's the new React, okay
- [tailwind.css](https://tailwindcss.com/) - maybe i'm doing it wrong, but i'd have preferred plain css
- [TypeScript](https://www.typescriptlang.org/) - always a good idea
- [vite](https://vitejs.dev/) - who likes webpack anyway

## Build Instructions
```sh
# clone repo
git clone https://github.com/deermichel/waveterrain.git

# install dependencies
cd waveterrain
npm install

# build and start dev server
npm run dev
```

## License
This project is released under the [MIT License](LICENSE).
