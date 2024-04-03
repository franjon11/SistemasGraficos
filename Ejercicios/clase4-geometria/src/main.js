import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createCylinder, createClosedCylinder } from './cylinder.js';

import { createSphere } from './sphere.js';

import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { createPlane } from './plane.js';

let scene, camera, renderer, container, sceneManager;

function setupThreeJs() {
	container = document.getElementById('container3D');

	renderer = new THREE.WebGLRenderer();
	scene = new THREE.Scene();

	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(4, 4, 4);
	camera.lookAt(0, 0, 0);

	const controls = new OrbitControls(camera, renderer.domElement);

	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);
	let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
	scene.add(directionalLightHelper);
	directionalLight.position.set(0, 0, 2);

	const pointLight = new THREE.PointLight(0xffffff, 10);
	pointLight.position.set(3, 1, 0);
	scene.add(pointLight);
	let pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
	scene.add(pointLightHelper);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.25);
	//scene.add(hemisphereLight);

	const gridHelper = new THREE.GridHelper(5, 5);
	scene.add(gridHelper);

	window.addEventListener('resize', onResize);
	onResize();
}

function onResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
}

const colors = {
	plane: 0xff9900,
	sphere: 0x1a648b,
	cyl: 0xff9900,
};

function buildScene() {
	const axes = new THREE.AxesHelper(100);
	scene.add(axes);

	//const geoCyl = createCylinder(1, 3, 16, 3);
	//const geoClosedCyl = createClosedCylinder(1, 3, 12, 3);
	const geoSph = createSphere(2, 15, 15);

	//const geoPla = createPlane(4, 2, 4, 2);

	const defaultMaterial = new THREE.MeshPhongMaterial({
		color: colors['sphere'],
		side: THREE.DoubleSide, // COMO QUEREMOS QUE SE VEAN LOS TRIANGULOS (TRASERO Y/O FRONTAL), EN ESTE CASO LOS MUESTRA DE AMBOS LADOS, POR DEFECTO SON FRONTALES
		wireframe: false, // PARA QUE DIBUJE COMO LINEAS LOS TRIANGULOS (PARA DEBUG)
		shininess: 100, // PARA EL MANEJO DE LA ILUMNACIÓN
		flatShading: true,
	});
	const normalMaterial = new THREE.MeshNormalMaterial();

	const material = defaultMaterial;
	// normalMaterial: pinta las superficies con el valor de las normales (r:x, g:y, b:z)
	// defaultMaterial: pinta de manera solida con el color.

	// ¡¡¡¡¡¡ CILINDRO ABIERTO !!!!!!!!
	//const cylinder = new THREE.Mesh(geoCyl, material);
	//scene.add(cylinder);

	// ¡¡¡¡¡¡ CILINDRO CERRADO !!!!!!!!
	//const cylinderClosed = new THREE.Mesh(geoClosedCyl, material);
	//scene.add(cylinderClosed);

	// ¡¡¡¡¡¡ ESFERA !!!!!!!!
	const sphere = new THREE.Mesh(geoSph, material);
	scene.add(sphere);

	/// ¡¡¡¡¡¡¡¡ PLANO !!!!!!!!!
	/* const plane = new THREE.Mesh(geoPla, material);
	scene.add(plane); */

	// para mostrar las normales
	/* let normalMeshHelper = new VertexNormalsHelper(sphere, 0.2, 0x00ff00, 1);
		scene.add(normalMeshHelper); */
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

setupThreeJs();
buildScene();
animate();
