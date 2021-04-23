import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import Stats from "../lib/stats.module.js";
import loadObject from "./load/index.js";

import { keyup, keydown } from "./input/index.js";

import createBox from "./scenery/box.js";
import createVehicle from "./vehicle/vehicle.js";
import createBuilding from "./scenery/building.js";
import createParticles from "./scenery/particles.js";
import createBoxPhysicsStatic from "./scenery/boxPhysicsStatic.js";
import createBoxPhysicsDynamic from "./scenery/boxPhysicsDynamic.js";

import skybox from "./scenery/skybox.js";

Ammo().then(start);

// - Functions -
function initGraphics() {
  container = document.getElementById("container");

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xbfd1e5);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    1000
  );
  controls = new OrbitControls(camera, renderer.domElement);

  camera.position.x = 0;
  camera.position.y = 4.39;
  camera.position.z = -35.11;

  // controls.minDistance = 10;
  controls.maxDistance = 100;

  skybox();
  createParticles();

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-30, 20, -30);

  scene.add(dirLight);

  materialDynamic = new THREE.MeshPhongMaterial({ color: 0xfca400 });
  materialStatic = new THREE.MeshPhongMaterial({ color: 0x2f2b2c });
  materialRamp = new THREE.MeshPhongMaterial({ color: 0x0060c4 });

  materialInteractive = new THREE.MeshPhongMaterial({ color: 0x000 });

  container.innerHTML = "";

  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  container.appendChild(stats.domElement);

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);

  const buttonStart = document.getElementById("button");
  buttonStart.addEventListener("click", () => {
    startGame();
  });

  const buttonWeather = document.getElementById("changeWeather");
  buttonWeather.addEventListener("click", () => {
    changeWeather();
  });

  // loading sound
  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  const soundRun = new THREE.Audio(listener);
  const soundStop = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("../assets/sound/car_run.ogg", function (buffer) {
    soundRun.setBuffer(buffer);
    soundRun.setLoop(true);
    soundRun.setVolume(0.2);
    soundCarRun = soundRun;
  });
  audioLoader.load("../assets/sound/car_stop.ogg", function (buffer) {
    soundStop.setBuffer(buffer);
    soundStop.setLoop(true);
    soundStop.setVolume(0.2);
    soundCarStop = soundStop;
  });
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
  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
}

function tick() {
  requestAnimationFrame(tick);
  let dt = clock.getDelta();
  for (let i = 0; i < syncList.length; i++) syncList[i](dt);
  physicsWorld.stepSimulation(dt, 10);
  controls.update(dt);
  renderer.render(scene, camera);
  time += dt;
  stats.update();
}

function createObjects() {
  createBox(new THREE.Vector3(0, -0.5, 0), ZERO_QUATERNION, 75, 1, 75, 0, 2);

  const quaternionRamp = new THREE.Quaternion(0, 0, 0, 1);
  quaternionRamp.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18);
  createBox(
    new THREE.Vector3(0, -1.5, 0),
    quaternionRamp,
    8,
    4,
    10,
    0,
    null,
    true
  );

  const size = 0.75;
  const nw = 8;
  const nh = 6;
  for (let j = 0; j < nw; j++)
    for (let i = 0; i < nh; i++)
      createBox(
        new THREE.Vector3(size * j - (size * (nw - 1)) / 2, size * i, 10),
        ZERO_QUATERNION,
        size,
        size,
        size,
        10
      );

  const quaterniontruckYellow1 = new THREE.Quaternion(0, 0, 0, 1);
  quaterniontruckYellow1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.04);

  const quaterniontruckYellow2 = new THREE.Quaternion(0, 0, 0, 1);
  quaterniontruckYellow2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.038);

  const quaterniontruckBlue = new THREE.Quaternion(0, 0, 0, 1);
  quaterniontruckBlue.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.216);

  const quaternionCarYellow1 = new THREE.Quaternion(0, 0, 0, 1);
  quaternionCarYellow1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.3);

  const quaternionCarYellow2 = new THREE.Quaternion(0, 0, 0, 1);
  quaternionCarYellow2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);

  const quaternionCarBlue = new THREE.Quaternion(0, 0, 0, 1);
  quaternionCarBlue.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);

  const quaternionCarWhite = new THREE.Quaternion(0, 0, 0, 1);
  quaternionCarWhite.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.3);

  const loading = Promise.all([
    createVehicle(new THREE.Vector3(0, 2, -10), ZERO_QUATERNION, wireframe),
    //carregando os predios e adicionando fisica
    createBuilding(
      "yellow_building.3mf",
      { x: 16.5, y: 5, z: 15.4 },
      { w: 23.7, l: 10, h: 23.5 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBuilding(
      "red_building.3mf",
      { x: -16.1, y: 5, z: 15.5 },
      { w: 23.7, l: 10, h: 23.5 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBuilding(
      "pink_building.3mf",
      { x: -16.3, y: 5, z: -17 },
      { w: 23.7, l: 10, h: 23.5 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBuilding(
      "blue_building.3mf",
      { x: 16.3, y: 5, z: -21 },
      { w: 23.7, l: 10, h: 15.8 },
      ZERO_QUATERNION,
      wireframe
    ),
    //carregando os caminhões e adicionando fisica
    createBoxPhysicsStatic(
      { x: -13, y: 1.5, z: 2.09 },
      { w: 6.3, l: 3, h: 2.47 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: -21, y: 1.5, z: 2.09 },
      { w: 6.3, l: 3, h: 2.47 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: -21, y: 1.5, z: 2.09 },
      { w: 6.3, l: 3, h: 2.47 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: -30.25, y: 1.5, z: 12.1 },
      { w: 2.47, l: 3, h: 9.25 },
      quaterniontruckYellow1,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: -13.3, y: 1.5, z: 34.55 },
      { w: 9.25, l: 3, h: 2.47 },
      ZERO_QUATERNION,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: 30.475, y: 1.5, z: 18.27 },
      { w: 2.47, l: 3, h: 9.25 },
      quaterniontruckYellow2,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: 22.68, y: 1.5, z: -9 },
      { w: 2.47, l: 3, h: 6.3 },
      quaterniontruckBlue,
      wireframe
    ),

    createBoxPhysicsStatic(
      { x: 35.26, y: 1.5, z: -15.7 },
      { w: 2.5, l: 3, h: 6.3 },
      ZERO_QUATERNION,
      wireframe
    ),
    //carregando os carros e adicionando fisica
    createBoxPhysicsDynamic(
      "car_orange1.3mf",
      { x: 16, y: 1.3, z: 29.57 },
      { w: 5, l: 2.5, h: 2.4 },
      ZERO_QUATERNION,
      1500,
      1,
      wireframe
    ),

    createBoxPhysicsDynamic(
      "car_orange2.3mf",
      { x: 7.5, y: 1.3, z: -10 },
      { w: 2.4, l: 2.5, h: 5 },
      ZERO_QUATERNION,
      1500,
      1,
      wireframe
    ),

    createBoxPhysicsDynamic(
      "car_yellow1.3mf",
      { x: 14, y: 1.3, z: -9 },
      { w: 2.4, l: 2.5, h: 5 },
      quaternionCarYellow1,
      1500,
      1,
      wireframe
    ),

    createBoxPhysicsDynamic(
      "car_yellow2.3mf",
      { x: -35, y: 1.3, z: -20 },
      { w: 2.4, l: 2.5, h: 5 },
      quaternionCarYellow2,
      1500,
      1,
      wireframe
    ),

    createBoxPhysicsDynamic(
      "car_blue.3mf",
      { x: -2.8, y: 1.3, z: -20 },
      { w: 2.4, l: 2.5, h: 5 },
      quaternionCarBlue,
      500,
      1,
      wireframe
    ),

    createBoxPhysicsDynamic(
      "car_white.3mf",
      { x: 30, y: 1.3, z: -28 },
      { w: 2.4, l: 2.5, h: 5 },
      quaternionCarWhite,
      800,
      1,
      wireframe
    ),
  ]);

  loadObject("../assets/city.3mf").then((obj) => {
    obj.receiveShadow = true;
    scene.add(obj);
  });

  loadObject("../assets/lines.3mf").then((obj) => {
    obj.castShadow = true;

    scene.add(obj);
  });
}

function changeWeather() {
  weather = !weather;
}

function startGame() {
  document.getElementById("initialPage").style.display = "none";
  document.getElementById("container").style.display = "block";

  tick();
}

function start() {
  // Detects webgl
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById("container").innerHTML = "";
  }

  // - Global variables -
  TRANSFORM_AUX = new Ammo.btTransform();

  ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);

  // Graphics variables
  clock = new THREE.Clock();

  // - Init -
  initGraphics();

  initPhysics();
  createObjects();
}
