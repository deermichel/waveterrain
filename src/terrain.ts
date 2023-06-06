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
        // TODO
        segments *= 8;
        const geometry = new THREE.PlaneGeometry(4, 4, segments, segments);
        const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, flatShading: true });
        const plane = new THREE.Mesh(geometry, material);

        // flip y and z axes
        const { position } = geometry.attributes;
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);
            position.setXYZ(i, x, z, y);
        }
        return plane;
    }

    private updatePlane() {
        // evaluate terrain vertices
        const { position } = this.plane.geometry.attributes;
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const z = position.getZ(i);
            const y = this.provider.evaluate(x, z);
            position.setY(i, y);
        }
        // this.plane.geometry.computeVertexNormals();
        position.needsUpdate = true;
    }
}

export default Terrain;
