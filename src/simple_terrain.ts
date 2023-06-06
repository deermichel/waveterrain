class SimpleTerrain implements TerrainProvider {
    evaluate(x: number, z: number) {
        // wrap x and z to [-1, 1)
        while (x < -1) x += 2;
        while (x >= 1) x -= 2;
        while (z < -1) z += 2;
        while (z >= 1) z -= 2;

        const y = 0*(x-z) * (x-1) * (x+1) * (z-1) * (z+1);
        return y;
    }
}

export default SimpleTerrain;
