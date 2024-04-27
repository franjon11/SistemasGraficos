import * as THREE from 'three';
import { materials } from './material';
import { ElevationGeometry } from '../geometrias/elevationGeometry.js';

export function construirTerreno(width, height, texture) {
	// PASTO
	const amplitude = 3;
	const widthSegments = 100;
	const heightSegments = 100;
	const geoTerreno = ElevationGeometry(width, height, amplitude, widthSegments, heightSegments, texture);

	const terreno = new THREE.Mesh(geoTerreno, materials['pasto']);

	return terreno;
}

export function construirAgua(width, height) {
	const geoAgua = new THREE.PlaneGeometry(width * 0.98, height * 0.98);
	const agua = new THREE.Mesh(geoAgua, materials['agua']);
	agua.position.set(0, 0.4, 0);
	agua.rotation.set(-Math.PI / 2, 0, 0);

	return agua;
}
