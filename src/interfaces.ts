interface Renderable {
    addToScene(scene: THREE.Scene): void;
    render(): void;
}

interface TerrainProvider<P = {}> {
    evaluate(x: number, z: number, params?: Partial<P>): number;
}

interface OrbitProvider<P = {}> {
    evaluate(t: number, params?: Partial<P>): { x: number, z: number };
}
