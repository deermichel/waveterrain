import { lerp, map } from "./utils";

class SampledOrbit implements OrbitProvider {
    private orbit!: Float32Array;
    private segments!: number;

    constructor(orbit: Float32Array = new Float32Array(0), segments: number = 0) {
        this.setOrbit(orbit, segments);
    }

    setOrbit(orbit: Float32Array, segments: number) {
        if (orbit.length !== segments * 2) {
            throw new Error("orbit.length !== segments * 2");
        }
        this.orbit = orbit;
        this.segments = segments;
    }

    evaluate(t: number) {
        if (this.segments === 0) return { x: 0, z: 0 };

        // wrap t to [0, 1)
        while (t < 0) t += 1;
        while (t >= 1) t -= 1;

        // map [0, 1) to [0, segments)
        const i = map(t, 0, 1, 0, this.segments);
        const i_int = Math.floor(i);
        const i_frac = i - i_int;

        // linear interpolation
        const idx0 = i_int * 2;
        const idx1 = ((i_int + 1) % this.segments) * 2;
        const x = lerp(this.orbit[idx0], this.orbit[idx1], i_frac);
        const z = lerp(this.orbit[idx0 + 1], this.orbit[idx1 + 1], i_frac);

        return { x, z };
    }
}

export default SampledOrbit;
