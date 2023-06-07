const map = (t: number, x0: number, x1: number, y0: number, y1: number) => {
    return y0 + (y1-y0) * (t-x0) / (x1-x0);
}

const lerp = (v0: number, v1: number, t: number) => {
    return (1-t)*v0 + t*v1;
}

const clamp = (x: number, min: number, max: number) => {
    return Math.min(Math.max(x, min), max);
}

export { map, lerp, clamp };
