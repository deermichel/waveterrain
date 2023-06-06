export interface SimpleOrbitParams {
    centerX: number;
    centerZ: number;
    radiusX: number;
    radiusZ: number;
    freqX: number;
    freqZ: number;
    phaseShift: number;
}

class SimpleOrbit implements OrbitProvider<SimpleOrbitParams> {
    private static twoPi = 2 * Math.PI;
    private static defaultParams: SimpleOrbitParams = {
        centerX: 0,
        centerZ: 0,
        radiusX: 1,
        radiusZ: 1,
        freqX: 1,
        freqZ: 1,
        phaseShift: Math.PI / 2,
    };

    evaluate(t: number, params?: Partial<SimpleOrbitParams>) {
        const { centerX, centerZ, radiusX, radiusZ, freqX, freqZ, phaseShift } = { ...SimpleOrbit.defaultParams, ...params };

        // wrap t to [0, 1)
        while (t < 0) t += 1;
        while (t >= 1) t -= 1;

        const x = centerX + radiusX * Math.sin(SimpleOrbit.twoPi * freqX * t + phaseShift);
        const z = centerZ + radiusZ * Math.sin(SimpleOrbit.twoPi * freqZ * t);
        return { x, z };
    }
}

export default SimpleOrbit;
