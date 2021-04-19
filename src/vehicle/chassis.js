import * as THREE from "../../lib/three.module.js";
import loadObject from "../load/index.js"


export default function createChassisMesh(scale = { x: 0.01, y: 0.01, z: 0.01 }) {
    return loadObject('../assets/jeep.3mf', scale).then((fbx) => {

        scene.add(fbx);
        return fbx;
    })

}