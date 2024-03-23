import * as THREE from 'three';
// Desplazamientos relativos entre piezas:
//
// chasis       >>      cabina        0,25,0
// cabina       >>      brazo         20, 20, -10
// brazo        >>      antebrazo     -102,0,0
// antebrazo    >>      pala          -60,0,0
// chasis       >>      eje            20,5,0
// eje          >>      llanta         0,0,25
// llanta       >>      cubierta       0,0,0
// llanta       >>      tuerca         0,0,3
//
// ***************************************************************

export function armarSolucion({ chasis, cabina, brazo, antebrazo, pala, eje, llanta, cubierta, tuerca, vehiculo }) {
	armarParteSuperior({ chasis, cabina, brazo, antebrazo, pala });
	armarParteInferior({ chasis, eje, llanta, cubierta, tuerca });
	// chasis -> vehiculo
	chasis.position.set(0, 0, 0);
	vehiculo.add(chasis);
}

function armarParteSuperior({ chasis, cabina, brazo, antebrazo, pala }) {
	// pala -> antebrazo
	pala.position.set(-60, 0, 0);
	antebrazo.add(pala);
	antebrazo.position.set(-102, 0, 0);
	// antebrazo -> brazo
	brazo.add(antebrazo);
	brazo.position.set(20, 20, -10);
	// brazo -> cabina
	cabina.add(brazo);
	cabina.position.set(0, 25, 0);
	// cabina -> chasis
	chasis.add(cabina);
}

function armarRueda({ llanta, cubierta, tuerca }) {
	let rueda = new THREE.Group();
	// cubierta -> rueda
	let auxCubierta = cubierta.clone();
	auxCubierta.position.set(0, 0, 0);
	rueda.add(auxCubierta);
	// llanta -> rueda
	let auxLlanta = llanta.clone();
	auxLlanta.position.set(0, 0, 0);
	rueda.add(auxLlanta);

	const radio = 7;
	for (let ang = 0; ang < 2 * Math.PI; ang = ang + Math.PI / 4) {
		let auxTuerca = tuerca.clone();
		auxTuerca.position.set(radio * Math.cos(ang), radio * Math.sin(ang), 3);
		rueda.add(auxTuerca);
	}

	return rueda;
}

function armarEje({ eje, llanta, cubierta, tuerca }) {
	let tren = eje.clone();

	let rueda1 = armarRueda({ llanta, cubierta, tuerca });
	rueda1.position.set(0, 0, -25);
	rueda1.rotation.y = Math.PI;
	tren.add(rueda1);

	let rueda2 = armarRueda({ llanta, cubierta, tuerca });
	rueda2.position.set(0, 0, 25);
	tren.add(rueda2);

	return tren;
}

function armarParteInferior({ chasis, eje, llanta, cubierta, tuerca }) {
	let trenDelantero = armarEje({ eje, llanta, cubierta, tuerca });
	trenDelantero.position.set(-20, 5, 0);
	chasis.add(trenDelantero);

	let trenTrasero = armarEje({ eje, llanta, cubierta, tuerca });
	trenTrasero.position.set(20, 5, 0);
	chasis.add(trenTrasero);

	// oculto los objetos que se van a duplicar
	eje.visible = false;
	llanta.visible = false;
	cubierta.visible = false;
	tuerca.visible = false;
}
