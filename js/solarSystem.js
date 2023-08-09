console.clear();
var planetSpeedLimiter = 12;
var align = false;
var planets = {
	sun: {
		radius: 1.0,
		orbitRadius: 0.0,
		angleSpeed: 0.0,
		color: 0xffaf01,
		trail: []
	},
	mercury: {
		radius: 0.059,
		orbitRadius: 0.62 + 0.6,
		angleSpeed: Math.PI / 9.4,
		color: 0xff8101,
		trail: []
	},
	venus: {
		radius: 0.093,
		orbitRadius: 0.85 + 0.6,
		angleSpeed: Math.PI / 15.0,
		color: 0xca8907,
		trail: []
	},
	earth: {
		radius: 0.096,
		orbitRadius: 1.0 + 0.7,
		angleSpeed: Math.PI / 19.1,
		color: 0x0167ff,
		trail: []
	},
	mars: {
		radius: 0.07,
		orbitRadius: 1.23 + 0.7,
		angleSpeed: Math.PI / 26.2,
		color: 0xff3b01,
		trail: []
	},
	jupiter: {
		radius: 0.32,
		orbitRadius: 2.28 + 0.5,
		angleSpeed: Math.PI / 65.8,
		color: 0xffc945,
		trail: []
	},
	saturn: {
		radius: 0.294,
		orbitRadius: 3.09 + 0.5,
		angleSpeed: Math.PI / 103.7,
		color: 0xffe6ab,
		trail: [],
		ringWidth: 0.04,
		ringColor: 0x56544e
	},
	uranus: {
		radius: 0.192,
		orbitRadius: 4.38 + 0.5,
		angleSpeed: Math.PI / 174.9,
		color: 0x00a576,
		trail: [],
		ringWidth: 0.01,
		ringColor: 0xc7f3f5
	},
	neptune: {
		radius: 0.189,
		orbitRadius: 5.49 + 0.5,
		angleSpeed: Math.PI / 244.5,
		color: 0x0a33ff,
		trail: []
	},
	pluto: {
		radius: 0.041,
		orbitRadius: 6.29 + 0.5,
		angleSpeed: Math.PI / 301.0,
		color: 0xbca88c,
		trail: []
	}
};

// World Configurations
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x131010);
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var camera = new THREE.OrthographicCamera(
	winWidth / -100,
	winWidth / 100,
	winHeight / 100,
	winHeight / -100,
	-500,
	1000
);
//var camera = new THREE.PerspectiveCamera( 75, winWidth / winHeight, 1, 1000 );

camera.position.x = 0.0;
camera.position.y = 7.0;
camera.position.z = 0.0;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({
	antialias: true,
	preserveDrawingBuffer: false
});
renderer.autoClear = false;
renderer.setClearColor("#000000");
renderer.setSize(winWidth, winHeight);
document.body.appendChild(renderer.domElement);

// Add in planets and sun
var sunmaterial = new THREE.MeshBasicMaterial({
	color: planets.sun.color,
	wireframe: false
});
for (var planetName in planets) {
	var planet = planets[planetName];
	var geometry = new THREE.SphereGeometry(planet.radius, 50, 50);
	var planetmaterial = new THREE.MeshToonMaterial({
		color: planet.color,
		shininess: 0,
		wireframe: false
	});
	if (planetName == "sun") {
		var mesh = new THREE.Mesh(geometry, sunmaterial);
	} else {
		var mesh = new THREE.Mesh(geometry, planetmaterial);
	}

	if (planetName == "saturn" || planetName == "uranus") {
		var ringGeometry = new THREE.TorusGeometry(
			planet.radius + 0.1,
			planet.ringWidth,
			18,
			100
		);
		var ringMaterial = new THREE.MeshBasicMaterial({
			color: planet.ringColor,
			side: THREE.DoubleSide
		});
		var ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
		ringMesh.rotation.y = Math.PI / 4;
		ringMesh.rotation.x = Math.PI / 4;

		planetGroup = new THREE.Group();
		planetGroup.add(mesh);
		planetGroup.add(ringMesh);

		planet.mesh = planetGroup;
		scene.add(planetGroup);
	} else {
		mesh.position.set(planet.orbitRadius, 0, 0);
	}

	// Orbit Ring
	var torusgeometry = new THREE.TorusGeometry(planet.orbitRadius, 0.01, 18, 100);
	var torusmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
	torusmaterial.transparent = true;
	torusmaterial.opacity = 0.3;
	var torus = new THREE.Mesh(torusgeometry, torusmaterial);

	if (planetName == "earth1") {
		planets.earth.mesh.position.y = 1.0;
		torus.rotation.y = Math.PI / 4;
	}
	torus.rotation.x = Math.PI / 2;
	scene.add(torus);

	planet.torus = torus;
	planet.angle = Math.PI / 2; //Math.random() * 2 * Math.PI;
	if (planetName != "saturn" && planetName != "uranus") {
		planet.mesh = mesh;
		scene.add(mesh);
	}
}

//Light
var sunlight = new THREE.PointLight(0xffffff, 1, 100);
sunlight.position.set(0, 10.0, 0);
scene.add(sunlight);

// Grid
var size = 50;
var divisions = 10;
var gridHelper = new THREE.GridHelper(size, divisions, 0xff0000);
//scene.add( gridHelper );
var sphereSize = 1;
var pointLightHelper = new THREE.PointLightHelper(sunlight, sphereSize);
//scene.add( pointLightHelper );

// Render Loop
var render = function () {
	requestAnimationFrame(render);
	for (var planetName in planets) {
		var p = planets[planetName];

		if (planetName == "earth1") {
			p.mesh.position.y = p.orbitRadius * Math.sin(p.angle);
		}
		p.mesh.position.x = p.orbitRadius * Math.sin(p.angle);
		p.mesh.position.z = p.orbitRadius * Math.cos(p.angle);
		p.angle += p.angleSpeed / planetSpeedLimiter;
	}
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	renderer.render(scene, camera);
};

render();
setTimeout(panDown, 3000);

var panCounter = 0.2;
function panDown() {
	if (camera.position.z <= 20.0) {
		//sunlight.position.z += 0.05
		camera.position.z += panCounter;
		if (panCounter > 0.02) {
			panCounter -= 0.001;
		}
		setTimeout(panDown, 10);
	} else {
		//$('#o1').css({'animation': 'type 2s forwards'});
		//$('#o2').css({'animation': 'type 1s forwards 1.5s'});
	}
}

// P5 map function
var map = function (n, start1, stop1, start2, stop2) {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

$(document).on("click", function (event) {
	var pageX = event.pageX;
	var pageY = event.pageY;

	if (align == false) {
		align = true;
		planetSpeedLimiter = 1.0;
	} else {
		align = false;
		planetSpeedLimiter = 12.0;
	}
});

window.addEventListener("resize", onResize, false);

function onResize() {
	winWidth = window.innerWidth;
	winHeight = window.innerHeight;

	var prevX = camera.position.x;
	var prevY = camera.position.y;
	var prevZ = camera.position.z;

	camera = new THREE.OrthographicCamera(
		winWidth / -100,
		winWidth / 100,
		winHeight / 100,
		winHeight / -100,
		-500,
		1000
	);
	//camera.position.x = 0.0;
	//camera.position.y = 7.0;
	//camera.position.z = 0.0;
	camera.position.x = prevX;
	camera.position.y = prevY;
	camera.position.z = prevZ;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
