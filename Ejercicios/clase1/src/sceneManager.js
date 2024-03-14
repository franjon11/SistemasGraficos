import * as THREE from 'three';

const diffToMerge = 0.01;

export class SceneManager {
	scene;

	constructor(scene) {
		this.scene = scene;

		const light = new THREE.DirectionalLight(0xffffff, 1);

		light.position.set(2, 2, 2);
		this.scene.add(light);

		const ambientLight = new THREE.AmbientLight(0xdcdcdc);
		this.scene.add(ambientLight);

		this.createFloor();
		this.createThree();
		this.createLake();
		this.createCastle();
	}

	createFloor() {
		// plano completo verde
		const pasto = new THREE.Mesh(
			new THREE.PlaneGeometry(15, 15),
			new THREE.MeshPhongMaterial({ color: '#2f8335' })
		);
		pasto.rotation.set(Math.PI * (3 / 2), 0, 0);
		pasto.position.set(0, 0, -2);
		this.scene.add(pasto);
	}

	createCastle() {
		// edificio - rectangulo lleno
		const colorEstructura = '#ffe8c6';
		const colorTechoCono = '#5885ec';

		const anchoEstructura = 3;
		const altoEstructura = 1;

		const xEstructura = 0;
		const zEstructura = -4;
		const yEstructura = altoEstructura / 2;

		const estructura = new THREE.Mesh(
			new THREE.BoxGeometry(anchoEstructura, altoEstructura, anchoEstructura),
			new THREE.MeshPhongMaterial({ color: colorEstructura })
		);
		estructura.position.set(xEstructura, yEstructura + diffToMerge, zEstructura);
		this.scene.add(estructura);

		const tamXDesdeCentro = anchoEstructura / 2;
		const tamZDesdeCentro = anchoEstructura / 2;

		// puerta - rectangulo
		const altoPuerta = altoEstructura * (2 / 3);
		const zPuerta = zEstructura + tamZDesdeCentro;
		const puerta = new THREE.Mesh(
			new THREE.BoxGeometry(0.5, altoPuerta, 0),
			new THREE.MeshPhongMaterial({ color: '#b89567' })
		);
		puerta.position.set(0, altoPuerta / 2 + diffToMerge, zPuerta + diffToMerge);
		this.scene.add(puerta);

		// vértices - cilindro + cono
		for (let i = 0; i < 2; i++) {
			const lado = i == 0 ? 1 : -1;
			const v1AlturaBase = altoEstructura + 0.2;
			const v1AlturaTecho = 2;
			const vX = xEstructura + tamXDesdeCentro;
			const vZ = zEstructura + tamZDesdeCentro * lado;

			const v1Base = new THREE.Mesh(
				new THREE.CylinderGeometry(0.5, 0.5, v1AlturaBase, 10),
				new THREE.MeshPhongMaterial({ color: colorEstructura })
			);
			v1Base.position.set(vX, v1AlturaBase / 2, vZ);
			this.scene.add(v1Base);

			const v1Techo = new THREE.Mesh(
				new THREE.ConeGeometry(0.8, v1AlturaTecho, 10),
				new THREE.MeshPhongMaterial({ color: colorTechoCono })
			);
			v1Techo.position.set(vX, v1AlturaBase + v1AlturaTecho / 2, vZ);
			this.scene.add(v1Techo);

			const v2Base = new THREE.Mesh(
				new THREE.CylinderGeometry(0.5, 0.5, v1AlturaBase, 10),
				new THREE.MeshPhongMaterial({ color: colorEstructura })
			);
			v2Base.position.set(-vX, v1AlturaBase / 2, vZ);
			this.scene.add(v2Base);

			const v2Techo = new THREE.Mesh(
				new THREE.ConeGeometry(0.8, v1AlturaTecho, 10),
				new THREE.MeshPhongMaterial({ color: colorTechoCono })
			);
			v2Techo.position.set(-vX, v1AlturaBase + v1AlturaTecho / 2, vZ);
			this.scene.add(v2Techo);
		}
	}

	createLake() {
		const colorLago = '#61d2ff';

		// sublago1 - circulo grande
		const sublago1 = new THREE.Mesh(
			new THREE.CircleGeometry(1, 25),
			new THREE.MeshPhongMaterial({ color: colorLago })
		);
		sublago1.rotation.set(Math.PI * (3 / 2), 0, 0);
		sublago1.position.set(0, diffToMerge, 0.5);
		this.scene.add(sublago1);

		// sublago2 - circulo a penas mas chico
		const sublago2 = new THREE.Mesh(
			new THREE.CircleGeometry(0.9, 25),
			new THREE.MeshPhongMaterial({ color: colorLago })
		);
		sublago2.rotation.set(Math.PI * (3 / 2), 0, 0);
		sublago2.position.set(0, diffToMerge, -0.5);
		this.scene.add(sublago2);
	}

	createThree() {
		// tronco - cono alto
		const alturaTronco = 1;

		const xTronco = -1.5;
		const yTronco = alturaTronco / 2;

		const tronco = new THREE.Mesh(
			new THREE.ConeGeometry(0.1, alturaTronco, 10, 1),
			new THREE.MeshPhongMaterial({ color: '#52412d' })
		);
		tronco.position.set(xTronco, yTronco + diffToMerge, 0);
		this.scene.add(tronco);

		// hojas - esferas
		const colorHojas = '#22ba2c';
		const diffHojas = 0.1;
		const alturaHojas = alturaTronco - 0.3;

		const hoja1 = new THREE.Mesh(
			new THREE.SphereGeometry(0.3, 15, 15),
			new THREE.MeshPhongMaterial({ color: colorHojas })
		);
		hoja1.position.set(xTronco + diffHojas, alturaHojas, diffHojas);
		this.scene.add(hoja1);

		const hoja2 = new THREE.Mesh(
			new THREE.SphereGeometry(0.35, 15, 15),
			new THREE.MeshPhongMaterial({ color: colorHojas })
		);
		hoja2.position.set(xTronco - diffHojas, alturaHojas, diffHojas);
		this.scene.add(hoja2);

		const hoja3 = new THREE.Mesh(
			new THREE.SphereGeometry(0.4, 15, 15),
			new THREE.MeshPhongMaterial({ color: colorHojas })
		);
		hoja3.position.set(xTronco, alturaHojas + diffHojas, -diffHojas);
		this.scene.add(hoja3);
	}
}
