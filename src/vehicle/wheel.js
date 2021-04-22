import * as THREE from "../../lib/three.module.js";
import loadObject from "../load/index.js"


export default function createWheelMesh(radius, width, pos, scale = { x: 0.01, y: 0.01, z: 0.01 }) {
    // return loadObject('../assets/tire.3mf', scale).then((fbx) => {

    //     scene.add(fbx);
    //     return fbx;
    // })
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

    const t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
    t.rotateZ(Math.PI / 2);
    const mesh = new THREE.Mesh(t, materialInteractive);
    const line = new THREE.Mesh(new THREE.BoxGeometry(width, radius * 1.75, radius * .25, 1, 1, 1), material)

    if (pos.x() > 0) {
        line.position.x = -0.01
    } else {
        line.position.x = 0.01
    }

    mesh.add(line);
    scene.add(mesh);
    return mesh;
}