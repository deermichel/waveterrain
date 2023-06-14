class Parameter {
    private internal: number;
    private target: number;
    private momentum: number;
    private eps: number;

    get value() { return this.internal; }
    set value(value: number) { this.target = value; }

    constructor(initial: number, momentum: number = 0.05, eps: number = 0.001) {
        this.internal = initial;
        this.target = initial;
        this.momentum = momentum;
        this.eps = eps;
    }

    public tick() {
        if (Math.abs(this.internal - this.target) < this.eps) {
            this.internal = this.target;
        } else {
            this.internal = this.momentum * this.target + (1 - this.momentum) * this.internal;
        }
        return this.internal;
    }

    public setAndTick(target: number) {
        this.target = target;
        return this.tick();
    }
}

export default Parameter;
