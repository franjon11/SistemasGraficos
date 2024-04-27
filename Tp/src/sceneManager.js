import * as THREE from 'three';
import { loadModels } from './loader.js';
import { construirAgua, construirTerreno } from './mapa.js';

const ADD_HELPERS = false;

const modelPaths = [];

export class SceneManager {
	scene;

	path;
	locomotora;

	camaraPasajero;
	camaraConductor;

	textureMap;

	objetos = {};

	ready = false;

	constructor(scene) {
		this.scene = scene;
		const light = new THREE.DirectionalLight(0xffffff, 2);

		light.position.set(1, 1, 1);
		scene.add(light);

		const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(hemiLight);

		const grid = new THREE.GridHelper(20, 20);
		scene.add(grid);

		const axes = new THREE.AxesHelper(100);
		scene.add(axes);

		//this.buildPath();
		this.loadTextures();
	}

	prepareScene() {
		console.log('texture laoadead');
		const mapa = construirTerreno(20, 20, this.textureMap);
		this.scene.add(mapa);

		const agua = construirAgua(20, 20);
		this.scene.add(agua);

		this.objetos['mapa'] = mapa;
		this.objetos['agua'] = agua;
		/* loadModels(modelPaths, (models) => {
			this.ready = true;
		}); */

		this.ready = true;
	}

	buildPath() {
		this.path = new THREE.CatmullRomCurve3([
			new THREE.Vector3(100, 0, 0),
			new THREE.Vector3(700, 0, 0),
			new THREE.Vector3(600, 0, 600),
			new THREE.Vector3(0, 0, 700),
			new THREE.Vector3(-600, 0, 600),
			new THREE.Vector3(-700, 0, 0),
			new THREE.Vector3(-600, 0, -600),
			new THREE.Vector3(0, 0, -700),
			new THREE.Vector3(600, 0, -600),
			new THREE.Vector3(700, 0, 0),
			new THREE.Vector3(100, 0, 0),
		]);

		const points = this.path.getPoints(100);
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({ color: 0x990000 });
		const line = new THREE.Line(geometry, material);

		this.scene.add(line);
	}

	onResize(aspect) {
		this.camaraPasajero.aspect = aspect;
		this.camaraPasajero.updateProjectionMatrix();
		this.camaraConductor.aspect = aspect;
		this.camaraConductor.updateProjectionMatrix();
	}

	animate(params) {
		if (!this.ready) return;

		this.objetos['agua'].position.y = params.alturaAgua;
		/*
		 params contiene:
			posicionSobreRecorrido
			anguloCabina
			anguloBrazo
			anguloAntebrazo
			anguloPala
		
		*/

		// TODO => actualizar angulos

		// TODO => ubicar vehiculo en el recorrido
		//this._ubicarVehiculo(params.posicionSobreRecorrido);
	}

	_ubicarVehiculo(u) {
		let pos = this.path.getPointAt(Math.min(0.98, u));
		pos.y += 10;
		this.locomotora.position.set(pos.x, pos.y, pos.z);
		let target = this.path.getPointAt((u + 0.01) % 1);
		target.y += 10;
		let tangente = new THREE.Vector3();
		tangente.subVectors(target, pos).normalize();
		let yAxis = new THREE.Vector3(0, 1, 0);

		let normal = new THREE.Vector3();
		normal.crossVectors(yAxis, tangente).normalize();
		let target2 = new THREE.Vector3();
		target2.addVectors(pos, normal);
		this.locomotora.lookAt(target2);
	}

	loadTextures() {
		this.textureMap = new THREE.TextureLoader().load(
			'../maps/elevationMap.png',
			() => this.prepareScene(),
			function (xhr) {
				// The texture is being loaded
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			function (error) {
				// The texture was not loaded
				console.log('An error happened');
				console.log(error);
			}
		);
	}
}
