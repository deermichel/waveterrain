class Deferred<T> {
    public promise: Promise<T>;
    public resolve?: (value: T | PromiseLike<T>) => void;
    public reject?: (reason?: any) => void;

    constructor(func: () => void) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            func();
        });
    }
}

export default Deferred;
