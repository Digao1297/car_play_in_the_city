import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import Stats from "../lib/stats.module.js";
import loadObject from "./load/index.js"

import createBox from "./scenery/box.js"
import createVehicle from "./vehicle/vehicle.js"
import createChassisMesh from "./vehicle/chassis.js"
import { keyup, keydown } from "./input/index.js"


Ammo().then(function (Ammo) {

	// Detects webgl
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
		document.getElementById('container').innerHTML = "";
	}

	// - Global variables -
	TRANSFORM_AUX = new Ammo.btTransform();
	ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);


	// Graphics variables
	clock = new THREE.Clock();

	// - Functions -
	function initGraphics() {

		container = document.getElementById('container');
		speedometer = document.getElementById('speedometer');

		scene = new THREE.Scene();


		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0xbfd1e5);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
		camera.position.x = -4.84;
		camera.position.y = 4.39;
		camera.position.z = -35.11;
		camera.lookAt(new THREE.Vector3(0.33, -0.40, 0.85));
		controls = new OrbitControls(camera, renderer.domElement);



		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(10, 10, 5);
		scene.add(dirLight);

		materialDynamic = new THREE.MeshPhongMaterial({ color: 0xfca400 });
		materialStatic = new THREE.MeshPhongMaterial({ color: 0x2F2B2C });
		materialInteractive = new THREE.MeshPhongMaterial({ color: 0x000 });

		container.innerHTML = "";

		container.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);

		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', keydown);
		window.addEventListener('keyup', keyup);
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	function initPhysics() {
		// Physics configuration
		collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		broadphase = new Ammo.btDbvtBroadphase();
		solver = new Ammo.btSequentialImpulseConstraintSolver();
		physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
		physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
	}

	function tick() {
		requestAnimationFrame(tick);
		let dt = clock.getDelta();
		for (let i = 0; i < syncList.length; i++)
			syncList[i](dt);
		physicsWorld.stepSimulation(dt, 10);
		controls.update(dt);
		renderer.render(scene, camera);
		time += dt;
		stats.update();
	}


	function createObjects() {

		createBox(new THREE.Vector3(0, -0.5, 0), ZERO_QUATERNION, 75, 1, 75, 0, 2);

		const quaternion = new THREE.Quaternion(0, 0, 0, 1);
		quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18);
		createBox(new THREE.Vector3(0, -1.5, 0), quaternion, 8, 4, 10, 0);

		const size = .75;
		const nw = 8;
		const nh = 6;
		for (let j = 0; j < nw; j++)
			for (let i = 0; i < nh; i++)
				createBox(new THREE.Vector3(size * j - (size * (nw - 1)) / 2, size * i, 10), ZERO_QUATERNION, size, size, size, 10);

		createVehicle(new THREE.Vector3(0, 0, 0), ZERO_QUATERNION);

		loadObject("../assets/city.3mf").then((fbx) => {
			scene.add(fbx)
		})

		loadObject("../assets/lines.3mf").then((fbx) => {
			scene.add(fbx)
		})

	}



	// - Init -
	initGraphics();
	initPhysics();
	createObjects();
	tick();
});


