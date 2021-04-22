import * as THREE from "../../lib/three.module.js";


export default function createParticles() {
    let parameters
    const materials = [];
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite1 = new THREE.TextureLoader().load('../assets/images/snowflake1.png');
    const sprite2 = new THREE.TextureLoader().load('../assets/images/snowflake2.png');
    const sprite3 = new THREE.TextureLoader().load('../assets/images/snowflake3.png');
    const sprite4 = new THREE.TextureLoader().load('../assets/images/snowflake4.png');
    const sprite5 = new THREE.TextureLoader().load('../assets/images/snowflake5.png');

    let isParticles = false

    for (let i = 0; i < 10000; i++) {

        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));


    parameters = [
        [[1.0, 0.2, 0.5], sprite2, 20],
        [[0.95, 0.1, 0.5], sprite3, 15],
        [[0.90, 0.05, 0.5], sprite1, 10],
        [[0.85, 0, 0.5], sprite5, 8],
        [[0.80, 0, 0.5], sprite4, 5]
    ];

    function addParticles(){
        for (let i = 0; i < parameters.length; i++) {
    
            const color = parameters[i][0];
            const sprite = parameters[i][1];
            const size = parameters[i][2];
    
            materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
            materials[i].color.setHSL(color[0], color[1], color[2]);
    
            const particles = new THREE.Points(geometry, materials[i]);
    
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
    
            scene.add(particles);
    
    
    
        }
    }
    

    function sync(dt) { 
        
        if (weather) {

            if(!isParticles){
                addParticles()
                isParticles = true
            }
            for (let i = 0; i < scene.children.length; i++) {

                const object = scene.children[i];

                if (object instanceof THREE.Points) {

                    object.rotation.y = time * (i < 4 ? i + 10 : - (i + 10));

                }

            }
        }else {

            isParticles = false

            for (let i = 0; i < scene.children.length; i++) {

                const object = scene.children[i];

                if (object instanceof THREE.Points) {
                    scene.remove(object)

                }

            }

        }
    }

    syncList.push(sync);
}