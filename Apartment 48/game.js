const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


//ширина поля игры
canvas.width = 900
canvas.height = 900

//2:14 граница
const barrierMap = []
for (let i = 0; i < st1Barrier.length; i += 8) {
    barrierMap.push(st1Barrier.slice(i, 8 + i))
}

const boundaries = []
const offset = { //расположение персонажа
    x: 100,
    y: 80
}

barrierMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2278)
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
image.src ="./Img/1st.png"


const Nura = new Image()
Nura.src = './Img/Nura.png'

const Alko = new Image()
Alko.src = './Img/Alko.png'

//изображение передних объектов карты

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


const npcs = {
    map2: [
        new Sprite({
            position: { x: 600, y: 400 },
            image: Alko,
            frames: { max: 1 },
            isStatic: true
        })
    ],
    map3: [
        new Sprite({
            position: { x: 800, y: 400 },
            image: Nura,
            frames: { max: 1 },
            isStatic: true
        })
    ]
};

// // Добавляем в начало кода (после объявления переменных)
// const portal = {
//         x: 490,  // координаты портала на первой карте
//         y: 460,
//         width: 200,
//         height: 50,
//         targetMap: 'map2',
//         targetX: 400,  // координаты появления на второй карте
//         targetY: 360
// }// Можно добавить другие порталы

const portals = {
    map1: [
        { x: 490, y: 460, width: 200, height: 50, targetMap: 'map2', targetX: 400, targetY: 300 }
    ],
    map2: [
        { x: 400, y: 300, width: 200, height: 50, targetMap: 'map1', targetX: 660, targetY: 150 },
        { x: 400, y: 400, width: 200, height: 50, targetMap: 'map3', targetX: 400, targetY:  300}
    ],
    map3: [
        { x: 400, y: 300, width: 200, height: 50, targetMap: 'map2', targetX: 400, targetY: 400 }
    ]
};

let currentMap = 'map1';  // Текущая карта
const mapImages = {
    map1: image,  // Ваше текущее изображение карты
    map2: new Image(),  // Добавьте вторую карту
    map3: new Image()
}
mapImages.map1.src = "./Img/1st.png";
mapImages.map2.src = "./Img/2st.png"; // Путь ко второй карте
mapImages.map3.src = "./Img/3st.png";


// Функция проверки столкновения с порталом
function checkPortalCollision() {
    if (!portals[currentMap]) return;

    const playerWorldX = player.position.x + background.position.x;
    const playerWorldY = player.position.y + background.position.y;

    portals[currentMap].forEach(portal => {
        if (
            playerWorldX < portal.x + portal.width &&
            playerWorldX + player.width > portal.x &&
            playerWorldY < portal.y + portal.height &&
            playerWorldY + player.height > portal.y
        ) {
            console.log(`Collision with portal to ${portal.targetMap}`);
            changeMap(portal.targetMap, portal.targetX, portal.targetY);
        }
    });
}

// Добавляем обработчик нажатия клавиши E
window.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E') {
        checkPortalCollision();
    }
});

// Функция смены карты
function changeMap(newMap, newX, newY) {
    if (currentMap === newMap) return;
    currentMap = newMap;
    player.position.x = newX;
    player.position.y = newY;
    background.image = mapImages[newMap];
    console.log(`Переход на карту ${newMap}`);
}

//размещение персонажа на карте (canvans)
const player = new Sprite({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    image: playerDownImage,
    frames: { max: 4 },
    sprites: { up: playerUpImage, left: playerLeftImage, right: playerRightImage, down: playerDownImage }
});

const background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: mapImages[currentMap]
});


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
 
function drawPortal() {
    if (!portals[currentMap]) return;

    portals[currentMap].forEach(portal => {
        const screenX = portal.x - background.position.x;
        const screenY = portal.y - background.position.y;

        c.fillStyle = 'blue';
        c.fillRect(screenX, screenY, portal.width, portal.height);

        c.fillStyle = 'white';
        c.font = 'bold 20px Arial';
        c.fillText('E', screenX + portal.width / 2 - 5, screenY + portal.height / 2 + 5);
    });
}

const movables = [background, ...boundaries]
function animate() {
    window.requestAnimationFrame(animate)
    background.draw()

    // Отрисовываем порталы (только на текущей карте)
    boundaries.forEach(boundary => {
        boundary.draw() //отображение границы
    })
    
    drawPortal()

    if (npcs[currentMap]) {
        npcs[currentMap].forEach(npc => {
            // Рисуем NPC с учетом смещения камеры
            c.drawImage(
                npc.image,
                npc.position.x - background.position.x,  // Учитываем смещение фона
                npc.position.y - background.position.y,
                npc.width,
                npc.height
            );
        });
    }
    // Отрисовка игрока
    player.draw();
    
    // Отладочная информация

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