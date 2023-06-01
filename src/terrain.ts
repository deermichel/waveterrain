import * as THREE from "three";

class Terrain implements Renderable {
    private plane: THREE.Mesh;
    private provider: TerrainProvider;

    constructor(provider: TerrainProvider, segments: number) {
        this.plane = this.createPlane(segments);
        this.provider = provider;
        this.updatePlane();
    }

    public addToScene(scene: THREE.Scene) {
        scene.add(this.plane);
    }

    public render() {
        this.updatePlane();
    }

    private createPlane(segments: number) {
        const geometry = new THREE.PlaneGeometry(2, 2, segments, segments);
        const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, flatShading: true });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(-Math.PI / 2);
        return plane;
    }

    private updatePlane() {
        // evaluate terrain vertices
        const { position } = this.plane.geometry.attributes;
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = this.provider.evaluate(x, -y);
            position.setZ(i, z);
        }
        // this.plane.geometry.computeVertexNormals();
        position.needsUpdate = true;
    }
}

export default Terrain;
