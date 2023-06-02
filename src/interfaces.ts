interface Renderable {
    addToScene(scene: THREE.Scene): void;
    render(): void;
}

interface TerrainProvider {
    evaluate(x: number, z: number): number;
}

interface OrbitProvider {
    evaluate(t: number): { x: number, z: number };
}
