import Scene from "./scene";
import Terrain from "./terrain";

let i = 0;
let dir = 0;
const provider: TerrainProvider = {
    evaluate: (x, y) => i * (x-y) * (x-1) * (x+1) * (y-1) * (y+1),
};

const scene = new Scene();
const terrain = new Terrain(provider, 12);
scene.add(terrain);

// render loop
const render = () => {
    requestAnimationFrame(render);
    i = dir ? i - 0.01 : i + 0.01;
    if (i > 1) dir = 1; else if (i < 0) dir = 0;
    scene.render();
};
render();
