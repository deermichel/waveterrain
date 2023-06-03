const map = (t: number, x0: number, x1: number, y0: number, y1: number) => {
    return y0 + (y1-y0) * (t-x0) / (x1-x0);
}

export { map };
