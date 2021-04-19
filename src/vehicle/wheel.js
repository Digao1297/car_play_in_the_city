import * as THREE from "../../lib/three.module.js";
import loadObject from "../load/index.js"


export default function createWheelMesh(radius, width, scale = { x: 0.01, y: 0.01, z: 0.01 }) {
    // return loadObject('../assets/tire.3mf', scale).then((fbx) => {

    //     scene.add(fbx);
    //     return fbx;
    // })
    const t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
    t.rotateZ(Math.PI / 2);
    const mesh = new THREE.Mesh(t, materialInteractive);
    mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), materialInteractive));
    scene.add(mesh);
    return mesh;
}