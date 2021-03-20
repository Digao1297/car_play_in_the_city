import loadFBX from "./loadFBX.js"
import Ground from "./ground.js"


const { enable3d, Scene3D, Canvas } = ENABLE3D

class MainScene extends Scene3D {
    constructor() {
        super({ key: 'MainScene' })
        this.car
        this.tire
        this.ground
    }
    keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    }

    init() {
        this.accessThirdDimension()
    }



    async create() {
        this.car = await loadFBX(this.third, 'assets/jeep_done.fbx');
        this.tire = await loadFBX(this.third, '/assets/tire.fbx', false)
        this.ground = await Ground(this.third, '/assets/grass.jpg')
        this.third.camera.position.set(20, 20, 40)


        const press = (e, isDown) => {
            e.preventDefault()
            const { code } = e
            switch (code) {
                case 'KeyW':
                    this.keys.w = isDown
                    break
                case 'KeyA':
                    this.keys.a = isDown
                    break
                case 'KeyS':
                    this.keys.s = isDown
                    break
                case 'KeyD':
                    this.keys.d = isDown
                    break
                case 'Space':
                    this.keys.space = isDown
                    break
            }
        }
        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))
    }


    update() {
        const speed = 40

        if (this.keys.w) {
            // this.car.enableAngularMotor(true, -speed, 0.25)

        } else if (this.keys.s) {
            // this.car.enableAngularMotor(true, speed, 0.25)

        } else {
            // this.car.enableAngularMotor(true, 0, 0.05)

        }
    }
}

const config = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
        height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2)
    },
    scene: [MainScene],
    ...Canvas()
}

window.addEventListener('load', () => {
    enable3d(() => new Phaser.Game(config)).withPhysics('/lib/ammo/kripken')
})