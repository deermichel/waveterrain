import * as THREE from "three";

class Orbit implements Renderable {
    private spheres: THREE.Mesh[];
    private orbitProvider: OrbitProvider;
    private terrainProvider: TerrainProvider;
    private phase: number = 0;

    constructor(orbit: OrbitProvider, terrain: TerrainProvider) {
        this.spheres = this.createSpheres();
        this.orbitProvider = orbit;
        this.terrainProvider = terrain;
        this.updateSpheres();
    }

    public addToScene(scene: THREE.Scene) {
        this.spheres.forEach((sphere) => scene.add(sphere));
    }

    public render() {
        this.updateSpheres();
        this.phase += 0.0002;
        this.phase %= 1;
    }

    private createSpheres() {
        const spheres = [];
        for (let i = 0; i < 256; i++) {
            const geometry = new THREE.SphereGeometry(0.01, 8, 8);
            const material = new THREE.MeshNormalMaterial({ side: THREE.FrontSide });
            const sphere = new THREE.Mesh(geometry, material);
            spheres.push(sphere);
        }
        return spheres;
    }

    private updateSpheres() {
        // evaluate orbit and position on terrain
        const numSpheres = this.spheres.length;
        for (let i = 0; i < numSpheres; i++) {
            const offset = i / numSpheres;
            const { x, z } = this.orbitProvider.evaluate(offset + this.phase);
            const y = this.terrainProvider.evaluate(x, z);
            this.spheres[i].position.set(x, y, z);
        }
    }
}

export default Orbit;
