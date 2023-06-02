import Scene from "./scene";
import Terrain from "./terrain";
import Orbit from "./orbit";

let i = 1;
let dir = 0;
const terrainProvider: TerrainProvider = {
    evaluate: (x, y) => i * (x-y) * (x-1) * (x+1) * (y-1) * (y+1),
};
const orbitProvider: OrbitProvider = {
    evaluate: (t) => ({ x: 0.7*Math.cos(2*Math.PI*t + Math.PI/3), z: 0.35*Math.sin(8*Math.PI*t) }),
};

const scene = new Scene();
const terrain = new Terrain(terrainProvider, 12);
scene.add(terrain);
const orbit = new Orbit(orbitProvider, terrainProvider);
scene.add(orbit);

// render loop
const render = () => {
    requestAnimationFrame(render);
    // i = dir ? i - 0.01 : i + 0.01;
    if (i > 1) dir = 1; else if (i < -1) dir = 0;
    scene.render();
};
render();
