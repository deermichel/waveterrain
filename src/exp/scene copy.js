import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 4);
// camera.position.multiplyScalar(2);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(1);
// scene.add(axes);
const grid = new THREE.GridHelper(2, 12);
// scene.add(grid);

const param = (u, v, target) => {
    const x = 2*u-1;
    const y = 2*v-1;
    const z = (x-y)*(x-1)*(x+1)*(y-1)*(y+1);
    target.set(x, z, y);
};

// ---
const N = 12;
const width = N;
const height = N;
const data = new Uint8Array( 4 * width * height );

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const target = new THREE.Vector3();
        param(x/width + (1/N)/2, y/height + (1/N)/2, target);
        let t = (target.y + 1) / 2;
        t = t*t;

        data[4 * (x + y * width)] = 80 + 175*t;
        data[4 * (x + y * width) + 1] = 255*t;
        data[4 * (x + y * width) + 2] = 255*t;
        data[4 * (x + y * width) + 3] = 255;
    }
}

// used the buffer to create a DataTexture
const texture = new THREE.DataTexture( data, width, height );
texture.needsUpdate = true;
// ---

const geometry = new ParametricGeometry(param, N, N);
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, wireframe: false });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

const animate = () => {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.01;
    renderer.render(scene, camera);
};
animate();
