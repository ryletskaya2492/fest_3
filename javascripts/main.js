// анимация телевизионных линий

document.addEventListener('DOMContentLoaded', () => {
  startNoise()
})

// рандомные интервалы
function startNoise() {
  let noiseLayer = document.querySelector('#noiseLayer')

  setInterval(() => {
    let chance = Math.random()

    if (chance < 0.6) {
      return
    }

    else createNoisePack(noiseLayer)
  }, 120)
}

// добавление линий на слой с уловием "шанс" > 0.6
function createNoisePack(noiseLayer) {

  let pack = document.createElement('div')
  pack.classList.add('noise-pack')

  let line = document.createElement('div')
  line.classList.add('noise-line')

  let sub = document.createElement('div')
  sub.classList.add('noise-subline')

  pack.append(line)
  pack.append(sub)

  pack.style.left = '0'


//   рандомное расположение
  let top = Math.random() * 90
  pack.style.top = top + '%'
  noiseLayer.append(pack)


//   время существования на слое
  let life = 600 + Math.random() * 1200

// удаление с слоя
  setTimeout(() => {
    pack.remove()
  }, life)
}


document.addEventListener('DOMContentLoaded', () => {
  startNoise()
  startIntro()
})


// КНОПКА СТАРТ
function startIntro() {
  let textElement = document.querySelector('#tvText')
  let button = document.querySelector('#startBtn')

  textElement.style.opacity = '1'

  button.classList.remove('visible')

  typeText(textElement, button)
}

function typeText(textElement, button) {
  let fullText = 'ДОБРО\u00A0ПОЖАЛОВАТЬ..'
  let index = 0

  let typing = setInterval(() => {
    textElement.innerText = textElement.innerText + fullText[index]
    index = index + 1

    if (index == fullText.length) {
      clearInterval(typing)
      blinkThenHide(textElement, button)
    }
  }, 200)
}

function blinkThenHide(textElement, button) {
  let count = 0

  let blinking = setInterval(() => {
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

function enableScroll(button) {
  button.addEventListener('click', () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  })
}