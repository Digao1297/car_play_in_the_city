import * as THREE from "../../lib/three.module.js";
import loadObject from "../load/index.js"

export default function createBoxPhysicsDynamic(name, pos, size, quat, mass, friction, wireframe = false) {
    let mesh

    if (wireframe) {

        const material = new THREE.MeshBasicMaterial({
            color: 0x44aa88,
            wireframe: true,
        });
        const shape = new THREE.BoxGeometry(size.w, size.l, size.h, 1, 1, 1);
        mesh = new THREE.Mesh(shape, material);
        mesh.position.copy(pos);
        mesh.quaternion.copy(quat);
        scene.add(mesh);
    }
    const geometry = new Ammo.btBoxShape(new Ammo.btVector3(size.w * 0.5, size.l * 0.5, size.h * 0.5));

    return loadObject(`../assets/${name}`).then((obj) => {

        obj.castShadow = true

        if (!mass) mass = 0;
        if (!friction) friction = 1;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        body.setFriction(friction);
        //body.setRestitution(.9);
        //body.setDamping(0.2, 0.2);

        physicsWorld.addRigidBody(body);

        scene.add(obj)

        if (mass > 0) {
            body.setActivationState(DISABLE_DEACTIVATION);
            // Sync physics and graphics
            function sync(dt) {
                const ms = body.getMotionState();
                if (ms) {
                    ms.getWorldTransform(TRANSFORM_AUX);
                    const p = TRANSFORM_AUX.getOrigin();
                    const q = TRANSFORM_AUX.getRotation();
                    if (mesh != null) {
                        mesh.position.set(p.x(), p.y(), p.z());
                        mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
                    }
                    obj.position.set(p.x(), p.y(), p.z());
                    obj.quaternion.set(q.x(), q.y(), q.z(), q.w());

                }
            }

            syncList.push(sync);
        }


    })


}