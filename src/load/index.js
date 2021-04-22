import * as THREE from "../../lib/three.module.js";
import { ThreeMFLoader } from "../../lib/3MFLoader.js"


export default function loadObject(path, scale = { x: 0.01, y: 0.01, z: 0.01 }) {
    // load model
    const loader = new ThreeMFLoader();


    return new Promise((resolve, reject) => {
        loader.load(path, function (obj) {
            const mixer = new THREE.AnimationMixer(obj);
            // const action = mixer.clipAction(obj.animations[0]);
            // action.play();

            obj.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            if (obj != null) {
                obj.scale.set(scale.x, scale.y, scale.z)
                resolve(obj)
            }
        })
    });
}