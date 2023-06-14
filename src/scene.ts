import * as THREE from "three";

class Scene {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private objects: Renderable[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = this.createRenderer();
        this.scene = this.createScene();
        this.camera = this.createCamera();
        window.addEventListener("resize", () => this.resizeRenderer());

        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
    }

    public add(object: Renderable) {
        object.addToScene(this.scene);
        this.objects.push(object);
    }

    public render() {
        this.scene.rotation.y += 0.002;
        this.objects.forEach((object) => object.render());
        this.renderer.render(this.scene, this.camera);
    }

    private createRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
        const { width, height } = this.canvas.getBoundingClientRect();
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        return renderer;
    }

    private createScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    private createCamera() {
        const { width, height } = this.canvas.getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 2, 4);
        camera.lookAt(this.scene.position);
        return camera;
    }

    private resizeRenderer() {
        const { width, height } = this.canvas.getBoundingClientRect();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }
}

export default Scene;
