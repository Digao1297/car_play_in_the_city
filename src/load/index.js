import * as THREE from "../../lib/three.module.js";
import { ThreeMFLoader } from "../../lib/3MFLoader.js"


export default function loadObject(path, scale = { x: 0.01, y: 0.01, z: 0.01 }) {
    // load model
    const loader = new ThreeMFLoader();


    return new Promise((resolve, reject) => {
        loader.load(path, function (fbx) {
            const mixer = new THREE.AnimationMixer(fbx);
            console.log(fbx);
            // const action = mixer.clipAction(fbx.animations[0]);
            // action.play();

            fbx.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            if (fbx != null) {
                fbx.scale.set(scale.x, scale.y, scale.z)
                resolve(fbx)
            }
        })
    });
}