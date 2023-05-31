import * as THREE from "/Users/deermichel/Desktop/three.js/build/three.module.js";
// import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";

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
    const z = 0;//func(x, y);
    target.set(x, z, y);
};
const func = (x, y) => (x-y)*(x-1)*(x+1)*(y-1)*(y+1);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(0, 2, 0);
// scene.add(light);

const N = 12;
const geometry = new ParametricGeometry(param, N, N);
const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
// material.flatColors = true;
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

const normals = new VertexNormalsHelper(plane, 0.1, 0xff0000);
// scene.add(normals);

const pos = geometry.attributes.position;
const color = new THREE.Color();
const colors = [];
for (let i = 0; i < pos.count; i++) {
    const y = func(pos.getX(i), pos.getZ(i));
    color.setHSL(0.5, 1, (y+1)/2);
    colors.push(color.r, color.g, color.b);
}
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const animate = () => {
    requestAnimationFrame(animate);
    // scene.rotation.y += 0.002;
    renderer.render(scene, camera);
};
animate();
