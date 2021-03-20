const { ExtendedObject3D } = ENABLE3D


export default function (third, path, isAnimation = true) {


    let object = new ExtendedObject3D()
    let pos = { x: 0, y: 5, z: 0 }

    return third.load.fbx(path).then(fbx => {
        object.add(fbx)

        if (isAnimation) {

            third.animationMixers.add(object.animation.mixer)

            object.animation.add('Idle', fbx.animations[0])
            object.animation.play('Idle')
        }



        object.scale.set(0.01, 0.01, 0.01)
        object.position.set(pos.x, pos.y, pos.z)

        third.add.existing(object)
        third.physics.add.existing(object, { shape: 'box', offset: { y: 0.35 } })
        return object;
    })
}





