import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Trail } from './trails';
export class SolarSystem {
	models = {};
	cameras = {
		earth: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000),
		moon: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000),
		iss: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000),
		apollo: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000),
	};
	currentCamera = 'apollo';
	envMapTexture = null;
	isReady = false;

	camerasPosition = {
		earth: new THREE.Vector3(-80, 0, 80),
		moon: new THREE.Vector3(0, 0, 50),
		iss: new THREE.Vector3(0, 30, 30),
		apollo: new THREE.Vector3(1, 2, 5),
	};
	constructor(scene) {
		this.scene = scene;
		// Load the solar system model

		const textureLoader = new THREE.TextureLoader();
		this.envMapTexture = textureLoader.load('maps/envMap1.jpg', (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			this.loadModels();
		});
	}

	loadModels() {
		const loader = new GLTFLoader();
		loader.load('models/solarSystem.glb', (gltf) => {
			// Callback function when the model is loaded
			this.onLoadComplete(gltf);
		});
	}

	buildHelpers() {
		this.helpers = new THREE.Group();
		this.trails = new THREE.Group();
		const ORBIT_RADIUS = 300;
		const EARTH_TILT = 23;
		let points = [];
		for (let i = 0; i <= 360; i += 10) {
			const x = ORBIT_RADIUS * Math.cos((i * Math.PI) / 180);
			const y = 0;
			const z = ORBIT_RADIUS * Math.sin((i * Math.PI) / 180);
			points.push(new THREE.Vector3(x, y, z));
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({ color: 0x2222ff, transparent: true, opacity: 0.5 });
		const circle = new THREE.Line(geometry, material);
		this.helpers.add(circle);

		points = [];
		for (let i = 0; i <= 360; i += 45) {
			const x = ORBIT_RADIUS * Math.cos((i * Math.PI) / 180);
			const z = ORBIT_RADIUS * Math.sin((i * Math.PI) / 180);

			const dx = Math.sin((EARTH_TILT * Math.PI) / 180) * 20;
			const dy = Math.cos((EARTH_TILT * Math.PI) / 180) * 20;
			points.push(new THREE.Vector3(x, dy, z + dx));
			points.push(new THREE.Vector3(x, -dy, z - dx));
		}
		const geo2 = new THREE.BufferGeometry().setFromPoints(points);
		const sticks = new THREE.LineSegments(geo2, material);
		this.helpers.add(sticks);
		this.helpers.visible = false;
		this.trails.visible = false;
		this.scene.add(this.helpers);
		this.scene.add(this.trails);

		this.earthTrail = new Trail(this.trails, 2000, new THREE.Vector3(0, 0, 0), 0.9);
		this.moonTrail = new Trail(this.trails, 2000, new THREE.Vector3(0, 0, 0), 100.7);
		this.issTrail = new Trail(this.trails, 2000, new THREE.Vector3(0, 0, 0), 0.5);
	}

	onLoadComplete(gltf) {
		// Code to handle the loaded model
		// ...
		gltf.scene.traverse((child) => {
			this.models[child.name] = child;
			console.log(child.name);
		});

		this.scene.add(this.models['sun']);
		this.scene.add(this.models['moon']);
		this.scene.add(this.models['earth']);
		this.scene.add(this.models['iss']);
		this.scene.add(this.models['apollo']);
		Object.values(this.models).forEach((model) => {
			model.castShadow = true;
			model.receiveShadow = true;
		});

		this.models['earth'].position.set(300, 0, 0);
		this.models['moon'].position.set(400, 0, 0);
		this.models['iss'].position.set(350, 0, 0);
		this.models['apollo'].position.set(450, 0, 0);

		this.models['apollo'].material.envMap = this.envMapTexture;
		this.models['iss'].material.envMap = this.envMapTexture;

		Object.entries(this.cameras).forEach(([name, camera]) => {
			this.models[name].add(camera);
			camera.position.copy(this.camerasPosition[name]);
			camera.lookAt(this.models[name].localToWorld(new THREE.Vector3(0, 0, 0)));
		});

		this.setupSceneGraph();
		this.buildHelpers();
		this.isReady = true;
	}

	DIST_TIERRA_SOL = 300;
	DIST_LUNA_TIERRA = 100;
	DIST_ISS_TIERRA = 50;

	setupSceneGraph() {
		/* *********************************************************************************

		    
			Consigna
			---------
		
			Definir el arbol de la escena de tal modo que las transformaciones de Tierra, la Luna, la Estacion Espacial (ISS) y
			la nave Apollo, repoduzcan los movimientos reales de cada cuerpo.

			Condiciones a cumplir:
			---------------------

			- La tierra rota alrededor del sol sobre el plano XZ (ciclo anual)
			- La tierra tiene su eje inclinado de 23 grados (ver explicacion en carpeta images/tierra*.jpg). 
			- El eje de la tierra no cambia su orientación respecto del sistema de coordenadas global (ver opcion showHelpers)
			- La tierra rota sobre su eje (ciclo del día)            
			- Rotación de la luna alrededor de la tierra (una vuelta cada 30 días y siempre expone la misma cara hacia la tierra)
			- La nave Apolo debe estar ubicada sobre la cara oculta de la luna
			- La ISS debe orbital alrededor de la tierra pasando por encima y por debajo de la misma y orientando sus paneles
			  en un plano perpendicular al vector normal de la superficie de la tierra.            

			*********************************************************************************
			*/

		let sun = this.models['sun'];
		let earth = this.models['earth'];
		let moon = this.models['moon'];
		let iss = this.models['iss'];
		let apollo = this.models['apollo'];

		let tierra = new THREE.Group();

		tierra.position.set(this.DIST_TIERRA_SOL, 0, 0);
		earth.position.set(0, 0, 0);
		moon.position.set(this.DIST_LUNA_TIERRA, 0, 0);
		iss.position.set(this.DIST_ISS_TIERRA, 0, 0);

		tierra.add(earth);
		tierra.add(moon);
		tierra.add(iss);

		this.models['tierra'] = tierra;

		apollo.position.set(10, 0, 0);
		moon.add(apollo);

		sun.add(tierra);
	}

	update(time) {
		if (!this.isReady) return;
		//console.log('time:', time);
		// Actualizar las transformaciones de los objetos de la escena
		let sun = this.models['sun'];
		let earth = this.models['earth'];
		let moon = this.models['moon'];
		let iss = this.models['iss'];
		let apollo = this.models['apollo'];
		let tierra = this.models['tierra'];

		// Actualizar aqui las transformaciones de los objetos de la escena
		// ...

		this.updateEarth(tierra, earth, time);
		this.updateMoon(moon, time);
		this.updateIss(iss, time);

		this.earthTrail.pushPosition(earth.localToWorld(new THREE.Vector3(0, 0, 0)));
		this.moonTrail.pushPosition(moon.localToWorld(new THREE.Vector3(0, 0, 0)));
		this.issTrail.pushPosition(iss.localToWorld(new THREE.Vector3(0, 0, 0)));
	}

	updateEarth(tierra, earth, time) {
		// rotación sobre el sol
		tierra.position.x = this.DIST_TIERRA_SOL * Math.cos(time * 0.1);
		tierra.position.z = this.DIST_TIERRA_SOL * Math.sin(time * 0.1);

		// rotacion sobre si mismo
		earth.rotation.order = 'XZY';

		earth.rotation.y = time;
		earth.rotation.z = this.gradToRad(23) * -1;
	}

	updateMoon(moon, time) {
		// rotación sobre la tierra
		moon.position.x = this.DIST_LUNA_TIERRA * Math.cos(time);
		moon.position.z = this.DIST_LUNA_TIERRA * Math.sin(time);
	}

	updateIss(iss, time) {
		// rotación sobre el sol
		iss.position.x = this.DIST_ISS_TIERRA * Math.cos(time);
		iss.position.y = this.DIST_ISS_TIERRA * Math.sin(time);

		// rotacion para que mire siempre como la normal
		iss.rotation.z = Math.PI / 2;
	}

	gradToRad(grad) {
		return (grad * Math.PI) / 180;
	}

	onResize(aspect) {
		Object.values(this.cameras).forEach((camera) => {
			camera.aspect = aspect;
			camera.updateProjectionMatrix();
		});
	}
	setCurrentCamera(name) {
		if (this.cameras[name]) {
			console.log('camera', name);
			this.currentCamera = name;
		}
	}
	getCurrentCamera() {
		return this.cameras[this.currentCamera];
	}
	showHelpers(value) {
		this.helpers.visible = value;
	}

	showTrails(value) {
		this.trails.visible = value;
	}
}
