import * as THREE from 'three';

export function createSphere(radius, radialSegments, heightSegments) {
	let geometry = new THREE.BufferGeometry();

	const positions = [];
	const indices = [];
	const normals = [];
	const uvs = [];

	buildCap({ positions, indices, normals, uvs }, radius / 2, radialSegments, heightSegments, true);
	buildCap({ positions, indices, normals, uvs }, radius / 2, radialSegments, heightSegments, false);

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	geometry.setIndex(indices);

	return geometry;
}

function buildCap(buffers, radius, radialSegments, heightSegments, isTopCap) {
	let { positions, indices, normals, uvs } = buffers;

	const angleStep = (2 * Math.PI) / radialSegments;
	const bStep = Math.PI / heightSegments;

	// vertical segments
	for (let i = 0; i <= heightSegments; i++) {
		const r = i * bStep;
		const v = i / heightSegments;

		// radial segments
		for (let j = 0; j <= radialSegments; j++) {
			const angle = j * angleStep;
			const x = radius * Math.cos(angle) * Math.sin(r);
			const y = radius * Math.cos(r) * (isTopCap ? 1 : -1);
			const z = radius * Math.sin(angle) * Math.sin(r);
			const u = j / radialSegments;

			positions.push(x, y, z);
			normals.push(x, y, z);
			uvs.push(u, v);

			//We stop before the last row and last column
			if (i < heightSegments && j < radialSegments) {
				// The indices of the vertices
				const a = i * (radialSegments + 1) + j;
				const b = a + radialSegments + 1;
				const c = a + radialSegments + 2;
				const d = a + 1;

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}
	}

	console.log('POSICIONES');
	for (let i = 0; i < positions.length / 3; i++) {
		const idx = i * 3;
		const x = positions[idx];
		const y = positions[idx + 1];
		const z = positions[idx + 2];

		console.log(i + ':' + x + ',' + y + ',' + z);
	}

	console.log('INDICES');
	for (let i = 0; i < indices.length / 3; i++) {
		const idx = i * 3;
		const x = indices[idx];
		const y = indices[idx + 1];
		const z = indices[idx + 2];

		console.log(i + ':' + x + ',' + y + ',' + z);
	}
}
