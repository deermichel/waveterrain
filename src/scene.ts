import * as THREE from "three";

class Scene {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private objects: Renderable[] = [];

    constructor() {
        this.renderer = this.createRenderer();
        this.camera = this.createCamera();
        this.scene = this.createScene();

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    public add(object: Renderable) {
        object.addToScene(this.scene);
        this.objects.push(object);
    }

    public render() {
        this.scene.rotation.y += 0.005;
        this.objects.forEach((object) => object.render());
        this.renderer.render(this.scene, this.camera);
    }

    private createRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    private createCamera() {
        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 4);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    private createScene() {
        const scene = new THREE.Scene();
        return scene;
    }
}

export default Scene;
