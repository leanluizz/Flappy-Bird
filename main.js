
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    
    let borda = novoElemento('div', 'borda')
    let corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)


    this.setAltura = altura => corpo.style.height = `${altura}px`
}
// const b = new Barreira(true)
// b.setAltura(300)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    ]
  

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }
    
}
const BarreirasAcess = new Barreiras()

function Passaro(alturaJogo) {
    let voando = false

    const Bird = this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = '../dom/imgs/passaro.png'
    this.elemento.style.display = "none";
    document.querySelector(".play").addEventListener("click", function BirdApp() {
        Bird.style.display = "block";
    })
    const CharArray = [
    document.querySelector(".skin-0"),
    document.querySelector(".skin-1"), 
    document.querySelector(".skin-2"), 
    document.querySelector(".skin-3") , 
    document.querySelector(".skin-4")
]
CharArray[0].addEventListener("click", () =>{
    Bird.src = "./dom/imgs/passaro.png"
})
CharArray[1].addEventListener("click", () =>{
    Bird.src = "img/skin-flappy-yellow.png"
})
CharArray[2].addEventListener("click", () =>{
    Bird.src = "img/flappy-skin-red.png"
})
CharArray[3].addEventListener("click", () =>{
    Bird.src = "img/flappy-angrybird-red-removebg-preview.png"
})
CharArray[4].addEventListener("click", () =>{
    Bird.src = "img/flappy-chicken-skin.png"
})
    this.getY = () => parseInt(Bird.style.bottom.split('px')[0])
    this.setY = y => Bird.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}



function Progresso() {
    const record = this.elemento = novoElemento('div', 'record')
    this.elemento.style.display = "none"
    document.querySelector(".play").addEventListener("click", function test() {
         record.style.display = "block"
    })

    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
   
}

// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    const  ArrayListLose = [
         document.querySelector(".par-de-barreiras"),
         document.querySelector(".passaro"),
         document.querySelector(".record"),
         document.querySelector(".corpo"),
         document.querySelector(".borda")
     ]

    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
        if (colidiu) {
            Menu.style.display = "block"
            ArrayListLose.forEach((e) => e.style.display = "none")
        }
        
    })
    return colidiu
}
const Menu = document.querySelector(".overflow-menu");
const Skin = document.querySelector(".Menu-char");
const MapMenu = document.querySelector(".Menu-map");
const wm = document.querySelector("[wm-flappy]");

   
const ListMapArray = [
    document.querySelector(".map-0"),
    document.querySelector(".map-1"),
    document.querySelector(".map-2"),
    document.querySelector(".map-3"),
    document.querySelector(".map-4")
]
ListMapArray[0].addEventListener("click", () =>{
    wm.style.backgroundImage = "url(img/sky-padrão.gif)"
})
ListMapArray[1].addEventListener("click", () =>{
    wm.style.backgroundImage = "url(img/gif-night.gif)"
})
ListMapArray[2].addEventListener("click", () =>{
    wm.style.backgroundImage = "url(img/sky-pirates.gif)"
})
ListMapArray[3].addEventListener("click", () =>{
    wm.style.backgroundImage = "url(img/sky-city.gif)"
})
ListMapArray[4].addEventListener("click", () =>{
    wm.style.backgroundImage = "url(img/sky-china.gif)"
})

document.querySelector(".play").addEventListener("click",  () => {
    Menu.style.display = "none";
})
document.querySelector(".skin").addEventListener("click",  () => { 
   Skin.style.display = "block";
})
document.querySelector(".map").addEventListener("click",  () => { 
    MapMenu.style.display = "block";
 })
document.querySelector(".button-X-char").addEventListener("click", () => {
    Skin.style.display = "none";
})
document.querySelector(".button-X-map").addEventListener("click", () => {
    MapMenu.style.display = "none";
})

function FlappyBird() {
    this.pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++this.pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))


     this.Lose = () => {
        progresso.atualizarPontos(this.pontos = 0)
     }

    this.start = () => {

        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
                this.Lose()
                location.reload()
            }
        }, 20)
    }
}


const Start = new FlappyBird()
document.querySelector(".play").addEventListener("click", function GO() {
    Start.start()
}) 