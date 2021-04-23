import * as THREE from "../../lib/three.module.js";

export default function createBoxPhysicsStatic(
  pos,
  size,
  quat,
  wireframe = false
) {
  let mass = 0;
  let friction = 0;

  if (wireframe) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x44aa88,
      wireframe: true,
    });
    const shape = new THREE.BoxGeometry(size.w, size.l, size.h, 1, 1, 1);
    const mesh = new THREE.Mesh(shape, material);
    mesh.position.copy(pos);
    mesh.quaternion.copy(quat);
    scene.add(mesh);
  }

  const geometry = new Ammo.btBoxShape(
    new Ammo.btVector3(size.w * 0.5, size.l * 0.5, size.h * 0.5)
  );

  if (!mass) mass = 0;
  if (!friction) friction = 1;

  //ammojs
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  geometry.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    geometry,
    localInertia
  );
  const body = new Ammo.btRigidBody(rbInfo);

  body.setFriction(friction);

  physicsWorld.addRigidBody(body);
}
