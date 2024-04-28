import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { SceneManager } from './sceneManager.js';
let scene, camera, renderer, container, sceneManager;

const params = {
	alturaAgua: 0.4,
};

const MAX_ALTURA_AGUA = 1.2;
const MIN_ALTURA_AGUA = 0.2;

// setup
function setupThreeJs() {
	container = document.getElementById('container3D');

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x999999);
	scene = new THREE.Scene();

	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(10, 15, 10);
	camera.lookAt(0, 0, 0);

	const controls = new OrbitControls(camera, renderer.domElement);

	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.25);
	scene.add(hemisphereLight);

	window.addEventListener('resize', onResize);
	onResize();

	// TODO => EVENTOS DE TECLADO
	window.addEventListener('keydown', (event) => {
		/* if (event.key === 'c') {
			switch (params.camaraActual) {
				case 'general':
					params.camaraActual = 'vehiculo';
					break;
				case 'vehiculo':
					params.camaraActual = 'conductor';
					break;
				case 'conductor':
					params.camaraActual = 'general';
					break;
			}
		} */
	});
}

function onResize() {
	let aspect = container.offsetWidth / container.offsetHeight;
	camera.aspect = aspect;
	camera.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	if (sceneManager) sceneManager.onResize(aspect);
}

function animate() {
	requestAnimationFrame(animate);
	sceneManager.animate(params);

	renderer.render(scene, camera);
}

setupThreeJs();
sceneManager = new SceneManager(scene);
animate();
