const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ширина поля игры
canvas.width = 1300
canvas.height = 800

//2:14 граница
const barrierMap = []
for (let i = 0; i < barrier.length; i += 70) {
    barrierMap.push(barrier.slice(i, 70 + i))
}

const boundaries = []
const offset = { //расположение персонажа
    x: -420,
    y: -445
}

barrierMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

//изображение карты
const image = new Image()
image.src ="./Img/map350.png"

//изображение передних объектов карты
const foregroundImage = new Image()
foregroundImage.src ="./Img/ForegroundObject.png"

 // изображение персонажа вниз
const playerDownImage = new Image()
playerDownImage.src = './Img/playerDown.png'

 // изображение персонажа вверх
const playerUpImage = new Image()
playerUpImage.src = './Img/playerUp.png'

 // изображение персонажа влево
const playerLeftImage = new Image()
playerLeftImage.src = './Img/playerLeft.png'

 // изображение персонажа вправо
const playerRightImage = new Image()
playerRightImage.src = './Img/playerRight.png'

//размещение персонажа на карте (canvans)
const player = new Sprite({
    position: {
        x: canvas.width / 2, //2:49
        y: canvas.height / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: { //добовляем изображения персонажа лево, право
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage

    }
})
console.log(player)

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foregroundObject = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})
//перемещение персонажа
const keys = {
    w: {
        prassed: false
    },
    a: {
        prassed: false
    },
    s: {
        prassed: false
    },
    d: {
        prassed: false
    }
}
//позиционирование границы

function rectangularBarrier ({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + player.width >= rectangle2.position.x && // отображение созданых границ для барьера
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + player.height >= rectangle2.position.y)


}

const movables = [background, ...boundaries, foregroundObject]
function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw() //отображение границы

    })
    player.draw()
    foregroundObject.draw()

    let moving = true
    player.moving = false
    if (keys.w.prassed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i <  boundaries.length; i++) { //код для столкновения персонажа с границей
            const boundary = boundaries[i]
            if (
                rectangularBarrier ({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                console.log('collading')
            moving = false
                break
            }
        }
        if(moving)
            movables.forEach(movable => {// movables отрожает что если персонаж перемещается то граница остается
                movable.position.y += 3
            })
    }
    else if (keys.a.prassed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i <  boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularBarrier ({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('collading')
            moving = false
                break
            }
        }
        if(moving)
        movables.forEach(movable => {
            movable.position.x += 3
        })
    }
    else if (keys.s.prassed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i <  boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularBarrier ({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                console.log('collading')
            moving = false
                break
            }
        }
        if(moving)
        movables.forEach(movable => {
            movable.position.y -= 3
        })
    }
    else if (keys.d.prassed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i <  boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularBarrier ({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('collading')
            moving = false
                break
            }
        }
        if(moving)
        movables.forEach(movable => {
            movable.position.x -= 3
        })
    }

}
animate()

let lastKey = ''

//перемещеие персонажа
window.addEventListener('keydown', (e) => {
    console.log(e.key)
    switch (e.key){
        case 'w':
            keys.w.prassed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.prassed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.prassed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.prassed = true
            lastKey = 'd'
            break
    }
    console.log(keys)
})

window.addEventListener('keyup', (e) => {
    console.log(e.key)
    switch (e.key){
        case 'w':
            keys.w.prassed = false
            break
        case 'a':
            keys.a.prassed = false
            break
        case 's':
            keys.s.prassed = false
            break
        case 'd':
            keys.d.prassed = false
            break
    }
    console.log(keys)
})