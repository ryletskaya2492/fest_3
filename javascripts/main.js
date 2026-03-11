// проверяем ширину экрана браузера, в случае чего считываем "мобильную"
// если ширина меньше или равна 414, функция возвращает true
function isMobileGame() {
  return window.innerWidth <= 414
}

document.addEventListener('DOMContentLoaded', () => {
  startNoise('#noiseLayerHero')
  startNoise('#noiseLayerSecurity')
  startIntro()
  initSecurityGame()
})

function startNoise(layerId) {
  let noiseLayer = document.querySelector(layerId)

  if (!noiseLayer) {
    return
  }

  // возвращает случайное число от 0 до 1, задаем интервалы
  setInterval(() => {
    let chance = Math.random()

// если случайное число меньше 0.6, линия не создаётся.
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
      top: window.innerHeight,
      behavior: 'smooth'
    })
  })
}

// ЛАБИРИНТ

let gameStarted = false
let gameOver = false
let sonicMoveTimer
let currentPlayerIndex = 0
let currentSonicIndex = 0

// пути дл пк

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

// инициализация

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
  gameStarted = true
  gameOver = false
  currentPlayerIndex = 0
  currentSonicIndex = 0

  placePlayer()
  placeSonic()
  startSonic()
}

// перемещение персонажей

function placePlayer() {
  let player = document.querySelector('#labPk')
  let path = getPlayerPath()

  if (!player) {
    return
  }

  // точка где сейчас стоит комп за который мы ходим
  player.style.left = path[currentPlayerIndex].x + '%'
  player.style.top = path[currentPlayerIndex].y + '%'
}

function placeSonic() {
  let sonic = document.querySelector('#labSonic')
  let path = getSonicPath()

  if (!sonic) {
    return
  }

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
    // минут 1 потому что с 0 начинаются, чтобы не выйти за границы маршрута
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
  clearInterval(sonicMoveTimer)

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