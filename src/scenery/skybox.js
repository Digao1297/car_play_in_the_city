import * as THREE from "../../lib/three.module.js";

export default function skybox() {

    return new Promise((resolve, reject) => {
        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load('../assets/skybox/skybox_front.png');
        let texture_bk = new THREE.TextureLoader().load('../assets/skybox/skybox_back.png');
        let texture_up = new THREE.TextureLoader().load('../assets/skybox/skybox_up.png');
        let texture_dn = new THREE.TextureLoader().load('../assets/skybox/skybox_down.png');
        let texture_rt = new THREE.TextureLoader().load('../assets/skybox/skybox_right.png');
        let texture_lf = new THREE.TextureLoader().load('../assets/skybox/skybox_left.png');

        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));


        for (let i = 0; i < 6; i++)
            materialArray[i].side = THREE.BackSide;

        let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
        let skybox = new THREE.Mesh(skyboxGeo, materialArray);
        scene.add(skybox);

        if (materialArray.length == 6)
            resolve()

    })


}