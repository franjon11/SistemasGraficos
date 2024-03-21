import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, container, font, text;

function setupThreeJs() {
	container = document.getElementById('container3D');

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x777777);
	scene = new THREE.Scene();

	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 3, 6);
	camera.lookAt(0, 0, 0);

	const controls = new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onResize);
	onResize();
}

function loadFont() {
	const loader = new FontLoader();
	loader.load('fonts/gentilis_regular.typeface.json', function (response) {
		font = response;
		buildScene();
	});
}

function buildScene() {
	const gridHelper = new THREE.GridHelper(10, 10);
	scene.add(gridHelper);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
	scene.add(hemisphereLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

	const coneGeometry = new THREE.ConeGeometry(0.25, 1);
	const coneMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
	const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
	coneMesh.position.set(-2, 0.5, -2);
	scene.add(coneMesh);

	let coneMesh2 = coneMesh.clone();
	coneMesh2.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
	coneMesh2.position.set(2, 0.5, -2);
	scene.add(coneMesh2);

	const parameters = {
		font: font,

		size: 0.6,
		height: 0.1,
		curveSegments: 2,

		bevelThickness: 0.1,
		bevelSize: 0,
		bevelEnabled: false,
	};

	let geo = new TextGeometry('3D', parameters);
	let mat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
	text = new THREE.Mesh(geo, mat);
	text.matrixAutoUpdate = false;
	window.text = text;

	const axesHelper = new THREE.AxesHelper(1);
	scene.add(axesHelper);

	const axesHelper2 = new THREE.AxesHelper(0.5);
	text.add(axesHelper2);
	scene.add(text);

	const loader = new GLTFLoader();
	loader.load('/models/targets.glb', function (gltf) {
		const targets = gltf.scene;
		scene.add(targets);
	});

	// *************************************************************************************
	//	Ejercicio:
	//	definir la matriz de transformación para cada uno de los 4 modelos en violeta
	//  y clonar el texto para cada uno de ellos
	//  Ayuda: las rotaciones son multiplos de Math.PI/4 (radianes)
	//        las escalas son multiplos de 0.25
	// *************************************************************************************

	copiarEjemplo1(scene);
	copiarEjemplo2(scene);
	copiarEjemplo3(scene);
	copiarEjemplo4(scene); // TODO ==> FALTA ESTE

	// *************************************************************************************
}

function copiarEjemplo1(scene) {
	let copy = text.clone();
	const m = new THREE.Matrix4();
	const mT = new THREE.Matrix4();
	const mR = new THREE.Matrix4();
	const mS = new THREE.Matrix4();
	const rotAxis = new THREE.Vector3(0, 0, 1).normalize();

	mT.makeTranslation(-2, 0, 0);
	mR.makeRotationAxis(rotAxis, Math.PI / 4);
	mS.makeScale(2, 1, 1);

	multiply(m, mT, mR, mS);

	copy.matrix.copy(m);
	scene.add(copy);
}

function copiarEjemplo2(scene) {
	let copy = text.clone();
	const m = new THREE.Matrix4();
	const mT = new THREE.Matrix4();
	const mR = new THREE.Matrix4();
	const mS = new THREE.Matrix4();
	const rotAxis = new THREE.Vector3(0, 1, 0).normalize();

	mT.makeTranslation(-1, 0, 1);
	mR.makeRotationAxis(rotAxis, Math.PI / 2);
	mS.makeScale(0.5, 1, 4);

	multiply(m, mT, mR, mS);

	copy.matrix.copy(m);
	scene.add(copy);
}

function copiarEjemplo3(scene) {
	let copy = text.clone();
	const m = new THREE.Matrix4();
	const mT = new THREE.Matrix4();
	const mR = new THREE.Matrix4();
	const mS = new THREE.Matrix4();
	const rotAxis = new THREE.Vector3(0, 1, 0).normalize();

	mT.makeTranslation(0, 0, -1);
	mR.makeRotationAxis(rotAxis, Math.PI / 4);
	mS.makeScale(1, 2, 1);

	multiply(m, mT, mR, mS);

	copy.matrix.copy(m);
	scene.add(copy);
}

function copiarEjemplo4(scene) {
	let copy = text.clone();
	const m = new THREE.Matrix4();
	const mT = new THREE.Matrix4();
	const mR = new THREE.Matrix4();
	const mS = new THREE.Matrix4();

	mT.makeTranslation(2, 0, 0);

	const rotAxis = new THREE.Vector3(1, 0, 0).normalize();
	mR.makeRotationAxis(rotAxis, -Math.PI / 4);

	mS.makeScale(-1, 0.5, 1);

	multiply(m, mT, mR, mS);

	copy.matrix.copy(m);
	scene.add(copy);
}

// m = mT * mR * mS --> donde mR es (mRz * mRy * mRx)
const multiply = (m, mT = null, mR = null, mS = null) => {
	if (mT != null) m.multiply(mT);
	if (mR != null) m.multiply(mR);
	if (mS != null) m.multiply(mS);
};

function onResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

setupThreeJs();
loadFont();
animate();
