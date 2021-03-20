


export default async function (third, path) {

    third.warpSpeed('-ground')

    third.load.preload('grass', path)

    const grass = await third.load.texture('grass')
    grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
    grass.offset.set(0, 0)
    grass.repeat.set(50, 50)

    const ground = third.physics.add.ground({ width: 500, height: 500, y: 0 }, { phong: { map: grass } })
    ground.body.setFriction(1)
    return ground
}



