import * as THREE from 'three';

export function createPlane(width, height, widthSegments, heightSegments) {
	let geometry = new THREE.BufferGeometry();

	const positions = [];
	const indices = [];
	const normals = [];
	const uvs = [];

	build({ positions, indices, normals, uvs }, width, height, widthSegments, heightSegments);

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	geometry.setIndex(indices);

	return geometry;
}

function build(buffers, width, height, widthSegments, heightSegments) {
	let { positions, indices, normals, uvs } = buffers;

	const wStep = width / widthSegments;
	const hStep = height / heightSegments;

	for (let h = 0; h <= heightSegments; h++) {
		const u = w / widthSegments;
		for (let w = 0; w <= widthSegments; w++) {
			const x = w * wStep - width / 2;
			const z = h * hStep - height / 2;
			const v = h / heightSegments;

			positions.push(x, 0, z);
			normals.push(0, -1, 0);
			uvs.push(u, v);

			if (w < widthSegments && h < heightSegments) {
				const a = w + h * (widthSegments + 1);
				const b = a + 1;
				const c = b + widthSegments;
				const d = c + 1;

				indices.push(a, b, c); // 0, 1, 2
				indices.push(b, d, c); // 1, 2, 3
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
