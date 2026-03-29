// проверяем ширину экрана браузера, в случае чего считываем "мобильную"
// если ширина меньше или равна 414, функция возвращает true
function isMobileGame() {
  return window.innerWidth <= 414
}

document.addEventListener('DOMContentLoaded', () => {
  startNoise('#noiseLayerFirst')
  startNoise('#noiseLayerSecurity')
  startIntro()
  initSecurityGame()
  startBlueNoise('#overloadNoiseLayer')
  initOverloadGame()
  startNoise('#collectionNoiseLayer')
  initCollectionGame()
  startNoise('#collectionNoiseLayer')
  startBlueNoise('#registrationNoiseLayer')
  initRegistrationBlock()
})

function startNoise(layerId) {
  let noiseLayer = document.querySelector(layerId)

  // возвращает случайное число от 0 до 1, задаем интервалы
  setInterval(() => {
    let chance = Math.random()

// если случайное число меньше 0.6, линия не создаётся
// если больше или равно 0.6, вызывается
    if (chance < 0.6) {
      return
    } else {
      createNoisePack(noiseLayer)
    }
  // интервал срабатывает каждые 120 миллисекунд
  }, 120)
}

// эта функция, которая создает один “пакет” линий (толсую и тонкую)
function createNoisePack(noiseLayer) {
  // создается новый div и добавляется новый класс (в котоырй потом линии кладем)
  let pack = document.createElement('div')
  pack.classList.add('noise-pack')

  // создается толстая линия
  let line = document.createElement('div')
  line.classList.add('noise-line')

  // создается тонкая линия
  let sub = document.createElement('div')
  sub.classList.add('noise-subline')

  // добавляем их в контейнер
  pack.append(line)
  pack.append(sub)

  pack.style.left = '0'

  // тут рандомное расположение
  let top = Math.random() * 90
  pack.style.top = top + '%'

  noiseLayer.append(pack)

  // тут рандомное время жизни линий высчитываем и удаляем контейнер
  let life = 600 + Math.random() * 1200
  setTimeout(() => {
    pack.remove()
  }, life)
}

// тоже самое только СИНИЕ
function startBlueNoise(layerId) {
  let noiseLayer = document.querySelector(layerId)


  setInterval(() => {
    let chance = Math.random()

    if (chance < 0.6) {
      return
    } else {
      createBlueNoisePack(noiseLayer)
    }
  }, 120)
}
function createBlueNoisePack(noiseLayer) {
  // контейнер для линий
  let pack = document.createElement('div')
  pack.classList.add('overload-noise-pack')

  // толстая линия
  let line = document.createElement('div')
  line.classList.add('overload-noise-line')

  // тонкая линия
  let sub = document.createElement('div')
  sub.classList.add('overload-noise-subline')

  // добавляем линии в контейнер
  pack.append(line)
  pack.append(sub)

  // теперь не всегда слева, а случайно по X
  let left = Math.random() * 55
  pack.style.left = left + '%'

  // случайная позиция по Y
  let top = Math.random() * 90
  pack.style.top = top + '%'

  // добавляем в слой
  noiseLayer.append(pack)

  // случайное время жизни
  let life = 600 + Math.random() * 1200

  setTimeout(() => {
    pack.remove()
  }, life)
}


// КНОПКА СТАРТ
function startIntro() {
  // находит текст и кнопку
  let textElement = document.querySelector('#tvText')
  let button = document.querySelector('#startBtn')

  textElement.style.opacity = '1'
// чтобы кнопка не была видна сначала
  button.classList.remove('visible')
// печать текста
  typeText(textElement, button)
}

function typeText(textElement, button) {
  // с неразрывным пробелом, по другому почему-то слипалось
  let fullText = 'ДОБРО\u00A0ПОЖАЛОВАТЬ..'
  // с первого символа
  let index = 0

  // интервал печати
  let typing = setInterval(() => {
    // то, что уже напечатано + следующий символ
    textElement.innerText = textElement.innerText + fullText[index]
    index = index + 1

    // когда заканчивваются символы, текст начинает мигать
    if (index == fullText.length) {
      clearInterval(typing)
      blinkThenHide(textElement, button)
    }
  }, 200)
}

// функция мигания
function blinkThenHide(textElement, button) {
  // создаю счетчик мигания
  let count = 0

  // создается интервал
  let blinking = setInterval(() => {
    // если текст видимый - делаем невидимым и наоборот + записываем в счетчик
    if (textElement.style.opacity == '0') {
      textElement.style.opacity = '1'
    } else {
      textElement.style.opacity = '0'
    }
    count = count + 1
    if (count == 6) {
      clearInterval(blinking)
      /* текст исчезает */
      textElement.style.opacity = '0'
      /* появляется кнопка */
      button.classList.add('visible')
      enableScroll(button)
    }
  }, 400)
}

// скролл вниз при клике на кнопку
function enableScroll(button) {
  button.addEventListener('click', () => {
    window.scrollTo({
      // высота видимой части окна браузера
      top: window.innerHeight,
      behavior: 'smooth'
    })
  })
}

// ЛАБИРИНТ будь он проклят

let gameStarted = false
let gameOver = false
let sonicMoveTimer
let currentPlayerIndex = 0
let currentSonicIndex = 0

// пути дл пк
// координаты типо слева сверху
let playerPath = [
  { x: 2, y: 33 },
  { x: 2, y: 28 },
  { x: 3, y: 22 },
  { x: 4, y: 16 },
  { x: 5, y: 14 },
  { x: 6, y: 13 },
  { x: 7, y: 11 },
  { x: 9, y: 23 },
  { x: 12, y: 26 },
  { x: 15, y: 28 },
  { x: 18, y: 29 },
  { x: 21, y: 29 },
  { x: 24, y: 27 },
  { x: 26, y: 23 },
  { x: 27, y: 19 },
  { x: 28, y: 16 },
  { x: 29, y: 14 },
  { x: 31, y: 11 },
  { x: 34, y: 11 },
  { x: 38, y: 11 }
]

let sonicPath = [
  { x: 95, y: 32 },
  { x: 91, y: 32 },
  { x: 89, y: 27 },
  { x: 88, y: 22 },
  { x: 85, y: 20 },
  { x: 80, y: 20 },
  { x: 75, y: 22 },
  { x: 71, y: 26 },
  { x: 67, y: 26 },
  { x: 63, y: 26 },
  { x: 60, y: 25 },
  { x: 58, y: 22 },
  { x: 56, y: 18 },
  { x: 54, y: 14 },
  { x: 52, y: 12 },
  { x: 48, y: 11 },
  { x: 44, y: 11 },
  { x: 40, y: 11 },
  { x: 36, y: 11 }
]

// пути для мобилки
let playerPathMobile = [
  { x: 52, y: 6 },

  { x: 56, y: 7 },
  { x: 60, y: 8 },
  { x: 64, y: 9 },
  { x: 67, y: 10 },
  { x: 68, y: 12 },
  { x: 66, y: 13 },
  { x: 63, y: 14 },
  { x: 59, y: 16 },
  { x: 56, y: 18 },
  { x: 54, y: 20 },
  { x: 53, y: 22 },
  { x: 53, y: 26 },
  { x: 54, y: 30 },
  { x: 58, y: 32 },
  { x: 62, y: 33 },
  { x: 66, y: 34 },
  { x: 66, y: 38 },
  { x: 66, y: 42 },
  { x: 66, y: 46 }
]

let sonicPathMobile = [
  { x: 52, y: 96 },
  { x: 54, y: 93 },
  { x: 57, y: 90 },
  { x: 60, y: 87 },
  { x: 61, y: 83 },
  { x: 60, y: 79 },
  { x: 58, y: 76 },
  { x: 58, y: 72 },
  { x: 59, y: 68 },
  { x: 61, y: 65 },
  { x: 64, y: 62 },
  { x: 66, y: 58 },
  { x: 66, y: 54 },
  { x: 66, y: 50 },
  { x: 66, y: 46 },
  { x: 66, y: 42 },
  { x: 66, y: 38 }
]

// проверяет экран, а следовательно какой путь использовать
function getPlayerPath() {
  if (isMobileGame()) {
    return playerPathMobile
  }

  return playerPath
}

function getSonicPath() {
  if (isMobileGame()) {
    return sonicPathMobile
  }

  return sonicPath
}

// начало игры

function initSecurityGame() {
  // поиск кнопок
  let startBtn = document.querySelector('#securityStartBtn')
  let errorBtn = document.querySelector('#errorBtn')
  let btnLeft = document.querySelector('#btnLeft')
  let btnRight = document.querySelector('#btnRight')

  // запуск игры по клику
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startSecurityGame()
    })
  }

  // при нажатии кнопки на окне игра обнуляется
  if (errorBtn) {
    errorBtn.addEventListener('click', () => {
      resetSecurityGame()
    })
  }

// клава на пк
  document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
      // чтобы стрелками не прокручивалась страница
      event.preventDefault()
      movePlayer(event)
    }
  })

// бинд кнопок на мобильном
  if (btnLeft) {
    btnLeft.addEventListener('click', () => {
      handlePlayerMove('ArrowLeft')
    })
  }

  if (btnRight) {
    btnRight.addEventListener('click', () => {
      handlePlayerMove('ArrowRight')
    })
  }
}

// утановка объектов по начальным координатам

function startSecurityGame() {
  let description = document.querySelector('#securityWindowWrap')
  let gameScreen = document.querySelector('#gameScreen')
  let popup = document.querySelector('#errorPopup')
  let controls = document.querySelector('#mobileControls')

  if (description) {
    description.classList.add('hidden')
  }

  if (gameScreen) {
    gameScreen.classList.add('visible')
  }

  if (popup) {
    popup.classList.remove('visible')
  }

  if (controls && window.innerWidth <= 768) {
    controls.classList.add('visible')
  }

  // обновляем состояние игры
  gameStarted = true
  gameOver = false
  currentPlayerIndex = 0
  currentSonicIndex = 0

  // помещаем комп и соника и соник сразу стартует
  placePlayer()
  placeSonic()
  startSonic()
}


// перемещение персонажей

function placePlayer() {
  let player = document.querySelector('#labPk')
  let path = getPlayerPath()

  // точка где сейчас стоит комп за который мы ходим (координата + %)
  player.style.left = path[currentPlayerIndex].x + '%'
  player.style.top = path[currentPlayerIndex].y + '%'
}

function placeSonic() {
  let sonic = document.querySelector('#labSonic')
  let path = getSonicPath()

// тоже установка соника в нужное место
  sonic.style.left = path[currentSonicIndex].x + '%'
  sonic.style.top = path[currentSonicIndex].y + '%'
}

// движение
function movePlayer(event) {
  handlePlayerMove(event.key)
}

function handlePlayerMove(key) {
  if (gameStarted == false || gameOver == true) {
    return
  }

  let path = getPlayerPath()


// проверяем, что путь еще не закончился
// переходим на следующую точку
// ставим комп на точку 
// проверяем столкновение с Соником
  if (key == 'ArrowRight') {
    // минус 1 потому что с 0 начинаются индексы массива, чтобы не выйти за границы маршрута
    if (currentPlayerIndex < path.length - 1) {
      currentPlayerIndex = currentPlayerIndex + 1
      placePlayer()
      checkCatch()
    }
  }

// идем на предыдущую точку
// ставим комп на точку
// проверяем столкновение
  if (key == 'ArrowLeft') {
    if (currentPlayerIndex > 0) {
      currentPlayerIndex = currentPlayerIndex - 1
      placePlayer()
      checkCatch()
    }
  }
}

// соник
function startSonic() {
  let path = getSonicPath()
  sonicMoveTimer = setInterval(() => {
    if (gameOver == true) {
      clearInterval(sonicMoveTimer)
      return
    }

// переходим к следующей точке
// двигаем Соника
// проверяем столкновение
// если путь закончился - остановка
    if (currentSonicIndex < path.length - 1) {
      currentSonicIndex = currentSonicIndex + 1
      placeSonic()
      checkCatch()
    } else {
      clearInterval(sonicMoveTimer)
    }
  }, 400)
}

// проверка столкновения
function checkCatch() {
  let playerPathCurrent = getPlayerPath()
  let sonicPathCurrent = getSonicPath()

  // текущие координаты
  let player = playerPathCurrent[currentPlayerIndex]
  let sonic = sonicPathCurrent[currentSonicIndex]

  // считаем расстояние по обеим осям
  let distanceX = Math.abs(player.x - sonic.x)
  let distanceY = Math.abs(player.y - sonic.y)
  // если оно крайне маленькое ПО ОБЕИМ осям, то засчитываем столкновение
  if (distanceX < 4 && distanceY < 4) {
    showErrorPopup()
  }
}

// попап
function showErrorPopup() {
  let popup = document.querySelector('#errorPopup')

  gameOver = true

  if (popup) {
    popup.classList.add('visible')
  }
}


// сброс игры

function resetSecurityGame() {
  let popup = document.querySelector('#errorPopup')
  let description = document.querySelector('#securityWindowWrap')
  let gameScreen = document.querySelector('#gameScreen')
  let controls = document.querySelector('#mobileControls')

  if (controls) {
    controls.classList.remove('visible')
  }

  if (popup) {
    popup.classList.remove('visible')
  }

  if (gameScreen) {
    gameScreen.classList.remove('visible')
  }

  if (description) {
    description.classList.remove('hidden')
  }
  clearInterval(sonicMoveTimer)

  gameStarted = false
  gameOver = false
  currentPlayerIndex = 0
  currentSonicIndex = 0

  placePlayer()
  placeSonic()
}


// ИГРА ПАПКИ

// состояние игры
let overloadStarted = false
// закончилась или нет
let overloadGameOver = false

// папка, которая сейчас "в игре"
let currentFolder = null
// положение по осям
let currentX = 0
let currentY = 0
// скорость движения за один шаг
let currentDX = 0
let currentDY = 0

// счетчик папок
let pileCount = 0
// таймер игры
let moveTimer = null

// подготовка игры (поиск элементов, навешиваем события)
function initOverloadGame() {
  let startBtn = document.querySelector('#overloadStartBtn')
  let popupBtn = document.querySelector('#popupBtn')
  let game = document.querySelector('#overloadGame')

// начало игры
  if (startBtn) {
    startBtn.addEventListener('click', startOverloadGame)
  }

//  обнуление игры
  if (popupBtn) {
    popupBtn.addEventListener('click', resetOverloadGame)
  }
// если игра найдена, то корзина двигается + отмена скрола на телефоне
  if (game) {
    game.addEventListener('mousemove', moveKorzinaMouse)
    game.addEventListener('touchmove', moveKorzinaTouch)
  }
}

// запуск
function startOverloadGame() {
  let windowWrap = document.querySelector('.overload-window-wrap')
  let game = document.querySelector('#overloadGame')
  let popup = document.querySelector('#overloadPopup')
  let pileLayer = document.querySelector('#pileLayer')
  let foldersLayer = document.querySelector('#foldersLayer')
  let korzina = document.querySelector('#korzina')

  if (windowWrap) {
    windowWrap.classList.add('hidden')
  }

  if (game) {
    game.classList.add('show')
  }

  // очищаем слои с папками
  if (pileLayer) {
    pileLayer.innerHTML = ''
  }

  if (foldersLayer) {
    foldersLayer.innerHTML = ''
  }

  // ставим корзину по центру
  if (korzina) {
    korzina.style.left = '50%'
  }

// очищаем таймер
  clearInterval(moveTimer)

  overloadStarted = true
  overloadGameOver = false
  pileCount = 0

// создаем нашу папку
  createFolder()
// каждые 20 секунд вызываем движение папки
  moveTimer = setInterval(() => {
    moveFolder()
  }, 20)
}

// движение корзины
function moveKorzinaMouse(event) {
// "ниче не делай еслии игра еще не началась или уже закончилась"
  if (overloadStarted == false) {
    return
  }

  if (overloadGameOver == true) {
    return
  }

  let game = document.querySelector('#overloadGame')
  let korzina = document.querySelector('#korzina')
  
// размеры и положение блока игры на экране
  let rect = game.getBoundingClientRect()
// положение мышки от левого края экрана - положение блока (чтобы координата была внутри блока игры, а не относительно всего экрана)
  let x = event.clientX - rect.left

  // ограничения по краям экрана (15% слева и справа "мертвые", туда корзину нельзя затащить)
  if (x < rect.width * 0.15) {
    x = rect.width * 0.15
  }

  if (x > rect.width * 0.85) {
    x = rect.width * 0.85
  }

  // и теперь переводим в проценты
  korzina.style.left = x / rect.width * 100 + '%'
}

function moveKorzinaTouch(event) {
  if (overloadStarted == false) {
    return
  }

  if (overloadGameOver == true) {
    return
  }

  // нельзя прокручивать страницу
  event.preventDefault()

  let game = document.querySelector('#overloadGame')
  let korzina = document.querySelector('#korzina')

  // такая же логика, что и на пк
  let rect = game.getBoundingClientRect()
  let x = event.touches[0].clientX - rect.left

  if (x < rect.width * 0.15) {
    x = rect.width * 0.15
  }

  if (x > rect.width * 0.85) {
    x = rect.width * 0.85
  }

  korzina.style.left = x / rect.width * 100 + '%'
}

// создаем папку
function createFolder() {
  // если больше 40 папок, показываем попап
  if (pileCount >= 40) {
    showOverloadPopup()
    return
  }

  let foldersLayer = document.querySelector('#foldersLayer')

  // создаем тег, добавляем картинку и вешвем стиль
  let folder = document.createElement('img')
  folder.src = 'images/papka.png'
  folder.className = 'papka-fly'
 
  // тут типо 4 рандомные траектории (0-4) (рандомное число от 0 до 1, умножаем на 4 и округляем)
  let line = Math.floor(Math.random() * 4)

  // появляется слева сверху и летит вправо вниз
  if (line == 0) {
  currentX = 8
  currentY = 36
  currentDX = 1.4
  currentDY = 0.7
}

// появляется слева снизу и летит вправо вниз
if (line == 1) {
  currentX = 8
  currentY = 50
  currentDX = 1.4
  currentDY = 0.55
}

// появляется справа сверху и летит влево вниз
if (line == 2) {
  currentX = 80
  currentY = 36
  currentDX = -1.2
  currentDY = 0.7
}

// появляется справа снизу и летит влево вниз
if (line == 3) {
  currentX = 80
  currentY = 50
  currentDX = -1.2
  currentDY = 0.55
}

// ставим в начальную точку
  folder.style.left = currentX + '%'
  folder.style.top = currentY + '%'

// добавляем в html и запоминаем как текущую
  foldersLayer.append(folder)
  currentFolder = folder
}


function moveFolder() {
  if (overloadStarted == false) {
    return
  }

  if (overloadGameOver == true) {
    return
  }

// двигаем папку
  currentX = currentX + currentDX
  currentY = currentY + currentDY

  // обновляем ее положение на экране
  currentFolder.style.left = currentX + '%'
  currentFolder.style.top = currentY + '%'

  // если попала в корзину убираем в кучу
  if (folderCaught() == true) {
    putFolderInPile()
    return
  }

  // если не была поймана и вылетела за границу - тоже в кучу, 72, потому что корзина где то на 68 стоит
  if (currentY > 72) {
    putFolderInPile()
    return
  }
}

// попадание в корзину
function folderCaught() {
  let game = document.querySelector('#overloadGame')
  let korzina = document.querySelector('#korzina')

  let gameRect = game.getBoundingClientRect()
  let korzinaRect = korzina.getBoundingClientRect()

  // из процентов в реальные координаты
  let folderX = gameRect.left + gameRect.width * currentX / 100
  let folderY = gameRect.top + gameRect.height * currentY / 100

  // зона корзин, куда должна попасть папка
  // типо левый край корзины + 20% от ее ширины
  let leftEdge = korzinaRect.left + korzinaRect.width * 0.2
  let rightEdge = korzinaRect.right - korzinaRect.width * 0.2
  let topEdge = korzinaRect.top
  let bottomEdge = korzinaRect.top + korzinaRect.height * 0.45

  // проверяем что все координаты попали - поймана
  if (folderX > leftEdge) {
  if (folderX < rightEdge) {
    if (folderY > topEdge) {
      if (folderY < bottomEdge) {
        return true
      }
    }
  }
}
  return false
}

function putFolderInPile() {
  let pileLayer = document.querySelector('#pileLayer')


  // удаляем летящую папку и удаляем переменную
  if (currentFolder) {
    currentFolder.remove()
    currentFolder = null
  }

  // создаем новый класс для папки в куче
  let folder = document.createElement('img')
  folder.src = 'images/papka.png'
  folder.className = 'papka-pile'

  // появляется на рандомных координатах и поворот
  let randomX = 6 + Math.random() * 78
  let randomY = 25 + Math.random() * 45
  let randomRotate = -25 + Math.random() * 50

  folder.style.left = randomX + '%'
  folder.style.top = randomY + '%'
  folder.style.transform = `rotate(${randomRotate}deg)`

  pileLayer.append(folder)

  // увеличиваем счетчик папок
  pileCount = pileCount + 1

  if (pileCount >= 40) {
    showOverloadPopup()
  } else {
    createFolder()
  }
}

function showOverloadPopup() {
  let popup = document.querySelector('#overloadPopup')

  overloadGameOver = true
  clearInterval(moveTimer)

  if (popup) {
    popup.classList.add('show')
  }
}

// сброс игры
// тоже самое, что в начале, но наоборот
function resetOverloadGame() {
  let windowWrap = document.querySelector('.overload-window-wrap')
  let game = document.querySelector('#overloadGame')
  let popup = document.querySelector('#overloadPopup')
  let pileLayer = document.querySelector('#pileLayer')
  let foldersLayer = document.querySelector('#foldersLayer')

  clearInterval(moveTimer)

  if (windowWrap) {
    windowWrap.classList.remove('hidden')
  }

  if (game) {
    game.classList.remove('show')
  }

  if (popup) {
    popup.classList.remove('show')
  }

  if (pileLayer) {
    pileLayer.innerHTML = ''
  }

  if (foldersLayer) {
    foldersLayer.innerHTML = ''
  }

  if (currentFolder) {
    currentFolder.remove()
    currentFolder = null
  }

  overloadStarted = false
  overloadGameOver = false
  pileCount = 0
}

// ИГРА РЫБЫ
// состояние начала игры
let collectionStarted = false
// состосние попапа
let collectionPopupOpen = false
// рыба хранится тут
let selectedFishElement = null
// имя рыбы сюда записываем
let selectedFishName = ''
// таймер движения рыбы
let fishMoveTimer = null

// массив рыыыыыыыыб
let fishList = [
  'fish_dog',
  'fish_hat',
  'fish_normal',
  'fish_not',
  'fish_roses',
  'fish_sneakers_2',
  'fish_sneakers',
  'fish_trash'
]

function initCollectionGame() {
  let startBtn = document.querySelector('#collectionStartBtn')
  let okBtn1 = document.querySelector('#fishOkBtn1')
  let okBtn2 = document.querySelector('#fishOkBtn2')
  let wtfBtn = document.querySelector('#fishWtfBtn')
  let resetBtns = document.querySelectorAll('.fish-reset-btn')

  if (startBtn) {
    startBtn.addEventListener('click', startCollectionGame)
  }

  if (okBtn1) {
    okBtn1.addEventListener('click', acceptFish)
  }

  if (okBtn2) {
    okBtn2.addEventListener('click', acceptFish)
  }

  if (wtfBtn) {
    wtfBtn.addEventListener('click', rejectFish)
  }

  // каждая кнопка в результирующем попапе, сбрасывает игру
  resetBtns.forEach((button) => {
    button.addEventListener('click', resetCollectionGame)
  })
}

function startCollectionGame() {
  let windowWrap = document.querySelector('.collection-window-wrap')
  let game = document.querySelector('#collectionGame')
  let fishLayer = document.querySelector('#fishLayer')
  let popup = document.querySelector('#fishPopup')
  // правильное отклонение
  let goodPopup = document.querySelector('#fishGoodPopup')
  // плохое отклонение (приняли мусорную рыбу)
  let badPopup = document.querySelector('#fishBadPopup')
  // отклонили нормальную рыбу
  let wrongFishPopup = document.querySelector('#fishWrongFishPopup')

  if (windowWrap) {
    windowWrap.classList.add('hidden')
  }

  if (game) {
    game.classList.add('show')
  }

  if (popup) {
    popup.classList.remove('show')
  }


// игра началась, но попап еще не открыт
  collectionStarted = true
  collectionPopupOpen = false
  selectedFishElement = null
  selectedFishName = ''

  createStartFish()
  startFishMovement()
}

function createStartFish() {
  let fishLayer = document.querySelector('#fishLayer')

  fishLayer.innerHTML = ''

  // вертикаль/горизонталь/ + скорость вправо, если - влево
  fishLayer.append(createOneFish('fish_dog', 18, 38, 0.22))
  fishLayer.append(createOneFish('fish_hat', 8, 68, 0.18))
  fishLayer.append(createOneFish('fish_normal', 34, 52, 0.2))
  fishLayer.append(createOneFish('fish_not', 72, 30, -0.22))
  fishLayer.append(createOneFish('fish_roses', 82, 62, -0.18))
  fishLayer.append(createOneFish('fish_sneakers_2', 55, 44, -0.2))
  fishLayer.append(createOneFish('fish_sneakers', 2, 78, 0.16))
  fishLayer.append(createOneFish('fish_trash', 78, 72, -0.24))
}

// создаем рыбо
function createOneFish(name, left, top, speed) {
// новый тег + даем имя
  let fish = document.createElement('img')
// создаю картинку силуэта рыбы
  fish.src = getFishSilhouetteSrc(name)
// даем класс, чтобы стили применились
  fish.className = 'silhouette-fish'
// на экран помещаем, координаты в %
  fish.style.left = left + '%'
  fish.style.top = top + '%'

  // использую dataset, чтобы хранить данные прямо внутри html
  fish.dataset.name = name
  fish.dataset.left = left
  fish.dataset.top = top
  fish.dataset.speed = speed

  // открываем попап этой рыбы по клику просто 
  fish.addEventListener('click', () => {
    openFishPopup(fish)
  })

  return fish
}

// начинаем движение
function startFishMovement() {
  clearInterval(fishMoveTimer)

  // каждые 20 мсекунд
  fishMoveTimer = setInterval(() => {
    moveAllFish()
  }, 20)
}

function moveAllFish() {
  if (collectionStarted == false) {
    return
  }

// чтобы не двигались, пока попап открыт, паузим типа
  if (collectionPopupOpen == true) {
    return
  }

  let allFish = document.querySelectorAll('.silhouette-fish')
 
  // достаем из дата сета для каждой рыбы и number - переводим в число
  allFish.forEach((fish) => {
    let left = Number(fish.dataset.left)
    let speed = Number(fish.dataset.speed)
    left = left + speed

    // ксли рыба плывет вправо и уже уплыла слишком далеко, переносим ее за левый край
    if (speed > 0 && left > 110) {
      left = -25
    }

    // и наоборот направо
    if (speed < 0 && left < -30) {
      left = 110
    }

    // обновляем позицию
    fish.dataset.left = left
    fish.style.left = left + '%'
  })
}

function openFishPopup(fish) {
  let popup = document.querySelector('#fishPopup')
  let popupImage = document.querySelector('#fishPopupImage')
  let popupName = document.querySelector('#fishPopupName')

  // запоминаем рыбу и ее имя
  collectionPopupOpen = true
  selectedFishElement = fish
  selectedFishName = fish.dataset.name

  popupImage.src = getFishImageSrc(selectedFishName)
  popupName.textContent = getFishLabel(selectedFishName)

  popup.classList.add('show')
}

function acceptFish() {
  let popup = document.querySelector('#fishPopup')
  let badPopup = document.querySelector('#fishBadPopup')

  if (popup) {
    popup.classList.remove('show')
  }

  collectionPopupOpen = false

  if (selectedFishName == 'fish_trash') {
    if (badPopup) {
      badPopup.classList.add('show')
    }
    return
  }

  // если норм рыба принята, то просто ее убираем с экрана и игра продолжается
  if (selectedFishElement) {
    selectedFishElement.remove()
    selectedFishElement = null
  }

  spawnReplacementFish()
}

function rejectFish() {
  let popup = document.querySelector('#fishPopup')
  let goodPopup = document.querySelector('#fishGoodPopup')
  let wrongFishPopup = document.querySelector('#fishWrongFishPopup')

  if (popup) {
    popup.classList.remove('show')
  }

  collectionPopupOpen = false

  if (selectedFishName == 'fish_trash') {
    if (goodPopup) {
      goodPopup.classList.add('show')
    }
  } else {
    if (wrongFishPopup) {
      wrongFishPopup.classList.add('show')
    }
  }
}

function spawnReplacementFish() {
  let fishLayer = document.querySelector('#fishLayer')
  let name = selectedFishName  

  // случайное расположение рыбы

  let top = 35 + Math.random() * 35
  let fromLeft = Math.random() > 0.5
  let left = 0
  let speed = 0

// если рыба появляется слева
// ставим ее за левый край
// даем + скорость

// если справа ставим за правый край
// даем - скорость
  if (fromLeft) {
    left = -20
    speed = 0.18 + Math.random() * 0.12
  } else {
    left = 110
    speed = -(0.18 + Math.random() * 0.12)
  }

  // добавляем на экран (возвращаем типо)
  fishLayer.append(createOneFish(name, left, top, speed))
}


// ищет силуэт оч удобно
function getFishSilhouetteSrc(name) {
  return 'images/' + name + '_silhouette.png'
}

// ищет обычную картинку
function getFishImageSrc(name) {
  return 'images/' + name + '.png'
}

function getFishLabel(name) {
  if (name == 'fish_dog') return 'рыбо собако'
  if (name == 'fish_hat') return 'рыбо шляпо'
  if (name == 'fish_normal') return 'fih'
  if (name == 'fish_not') return 'рыбо-нет'
  if (name == 'fish_roses') return 'рыбо розы'
  if (name == 'fish_sneakers_2') return 'рыбо кроссовко 2'
  if (name == 'fish_sneakers') return 'рыбо кроссовко'
  if (name == 'fish_trash') return 'рыбо долино мусора'

  return name
}

function resetCollectionGame() {
  let windowWrap = document.querySelector('.collection-window-wrap')
  let game = document.querySelector('#collectionGame')
  let fishLayer = document.querySelector('#fishLayer')
  let popup = document.querySelector('#fishPopup')
  let goodPopup = document.querySelector('#fishGoodPopup')
  let badPopup = document.querySelector('#fishBadPopup')
  let wrongFishPopup = document.querySelector('#fishWrongFishPopup')

  clearInterval(fishMoveTimer)

  if (windowWrap) {
    windowWrap.classList.remove('hidden')
  }

  if (game) {
    game.classList.remove('show')
  }

  if (fishLayer) {
    fishLayer.innerHTML = ''
  }

  if (popup) {
    popup.classList.remove('show')
  }

  if (goodPopup) {
    goodPopup.classList.remove('show')
  }

  if (badPopup) {
    badPopup.classList.remove('show')
  }

  if (wrongFishPopup) {
    wrongFishPopup.classList.remove('show')
  }

  collectionStarted = false
  collectionPopupOpen = false
  selectedFishElement = null
  selectedFishName = ''
}

// КНОПКА РЕГИСТРАЦИИ

function initRegistrationBlock() {
  let openBtns = document.querySelectorAll('.registration-open-btn')
  let windowWrap = document.querySelector('#registrationWindowWrap')
  let runawayBtn = document.querySelector('#registrationRunawayBtn')

  openBtns.forEach((button) => {
    button.addEventListener('click', () => {
      if (windowWrap) {
        windowWrap.classList.add('hidden')
      }

      if (runawayBtn) {
        runawayBtn.classList.add('show')
      }
    })
  })

  if (runawayBtn) {
    runawayBtn.addEventListener('mouseenter', moveRegistrationButton)
    runawayBtn.addEventListener('touchstart', moveRegistrationButton)
  }
}

function moveRegistrationButton(event) {
  let runawayBtn = document.querySelector('#registrationRunawayBtn')

  if (event.type == 'touchstart') {
    event.preventDefault()
  }

  // случайное положение кнопки
  let randomLeft = 10 + Math.random() * 70
  let randomTop = 35 + Math.random() * 45

  runawayBtn.style.left = randomLeft + '%'
  runawayBtn.style.top = randomTop + '%'
  runawayBtn.style.transform = 'translateX(0)'
}