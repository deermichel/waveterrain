interface Renderable {
    addToScene(scene: THREE.Scene): void;
    render(): void;
}

interface TerrainProvider {
    evaluate(x: number, y: number): number;
}
