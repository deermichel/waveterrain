import { map } from "./utils";

class SampledTerrainProvider implements TerrainProvider {
    private terrain!: Float32Array;
    private segments!: number;

    constructor(terrain: Float32Array = new Float32Array(0), segments: number = 0) {
        this.setTerrain(terrain, segments);
    }

    setTerrain(terrain: Float32Array, segments: number) {
        if (terrain.length !== segments * segments) {
            throw new Error("terrain.length !== segments * segments");
        }
        this.terrain = terrain;
        this.segments = segments;
    }

    evaluate(x: number, z: number) {
        if (this.segments === 0) return 0;

        // wrap x and z to [-1, 1)
        while (x < -1) x += 2;
        while (x >= 1) x -= 2;
        while (z < -1) z += 2;
        while (z >= 1) z -= 2;

        // map [-1, 1) to [0, segments)
        const i = map(x, -1, 1, 0, this.segments);
        const j = map(z, -1, 1, 0, this.segments);
        const i_int = Math.floor(i);
        const j_int = Math.floor(j);
        const i_frac = i - i_int;
        const j_frac = j - j_int;

        // bilinear interpolation
        const y = (i_: number, j_: number) => {
            const idx = (i_ % this.segments) * this.segments + (j_ % this.segments);
            return this.terrain[idx];
        };
        const v00 = y(i_int, j_int);
        const v01 = y(i_int, j_int + 1);
        const v10 = y(i_int + 1, j_int);
        const v11 = y(i_int + 1, j_int + 1);
        const u0 = (1 - i_frac) * v00 + i_frac * v10;
        const u1 = (1 - i_frac) * v01 + i_frac * v11;
        const out = (1 - j_frac) * u0 + j_frac * u1;

        return out;
    }
}

export default SampledTerrainProvider;
