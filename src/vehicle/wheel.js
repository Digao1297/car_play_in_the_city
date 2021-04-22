import * as THREE from "../../lib/three.module.js";
import loadObject from "../load/index.js"


export default function createWheelMesh(dir) {
    return loadObject(`../assets/tires_${dir}.3mf`).then((obj) => {
 
        scene.add(obj);
        return obj;
    })
   
}