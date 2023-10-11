// Based on Ibon Tolosana's procedural grass demo using CAAT
// https://hyperandroid.github.io/CAAT/documentation/demos/demo10/garden_org.html
// https://twitter.com/hyperandroid
// 参考地址 https://codepen.io/osublake/pen/JYpOOK
import gsap, { Power1 } from "gsap"

const log = console.log.bind(console)

class Grass {
  constructor(
    path,
    offset,
    width,
    height,
    minHeight,
    maxHeight,
    maxAngle,
    startAngle
  ) {
    this.path = path

    this.width = random(4, 8)
    this.height = random(150, maxHeight)
    this.maxAngle = random(10, maxAngle)
    this.angle = (Math.random() * randomSign() * startAngle * Math.PI) / 180

    const offsetX = 1.5

    // Start position
    const sx = offset / 2 + random(width - offset)
    const sy = height

    // Curvature
    const csx = sx - offsetX
    const csy = sy - this.height / (Math.random() < 0.5 ? 1 : 2)

    // Parallel point
    const psx = csx
    const psy = csy

    const dx = sx + this.width
    const dy = sy

    this.coords = [sx, sy, csx, csy, psx, psy, dx, dy]

    this.growing = false
    this.morphed = false

    this.start = 0
    this.elapsed = 0

    this.height_ = this.height
    this.height = random(200, Math.min(500, this.height))

    const ambient = 0.85

    const color = [
      Math.floor(random(16, 48) * ambient),
      Math.floor(random(100, 255) * ambient),
      Math.floor(random(16, 48) * ambient),
    ]

    const w = this.width / 2
    const d = `M${sx},${sy + 2},h${w},h${w}z`

    gsap.set(path, { fill: `rgb(${color})`, attr: { d } })
  }

  rise() {
    this.morphed = true
    this.growing = false
    this.elapsed = now() - this.start

    gsap.to(this, random(2.5, 3.5), {
      height: this.height_,
      ease: Power1.easeInOut,
    })
  }

  morph(morphSVG) {
    const time = random(1.5, 3.5)
    const delay = random(0.5, 4.5)

    this.growing = true

    gsap.to(this.path, time, {
      morphSVG,
      delay,
      onComplete: () => this.rise(),
    })
  }

  update(time) {
    if (this.growing) return

    time -= this.elapsed

    const coords = this.coords
    const tip = Math.sin(time * 0.0007)

    const th =
      this.angle +
      Math.PI / 2 +
      ((tip * Math.PI) / 180) * (this.maxAngle * Math.cos(time * 0.0002))
    const px = coords[0] + this.width + this.height * Math.cos(th)
    const py = coords[1] - this.height * Math.sin(th)

    let d = `M${coords[0]},${coords[1]}`
    d += `C${coords[0]},${coords[1]},${coords[2]},${coords[3]},${px},${py}`
    d += `C${px},${py},${coords[4]},${coords[5]},${coords[6]},${coords[7]}z`

    if (!this.morphed) {
      this.morph(d)
      this.start = now()
    } else {
      this.path.setAttribute("d", d)
    }
  }

  destroy() {
    gsap.killTweensOf(this)
    gsap.killTweensOf(this.path)

    this.path.parentElement.removeChild(this.path)
  }
}

const xmlns = "http://www.w3.org/2000/svg"

const perf = window.performance
const now = perf ? perf.now.bind(perf) : Date.now

const stage = document.querySelector("#stage")

const start = now()
let blades = []

const offset = 400
const width = 1200
const height = 600
const total = 40

const minHeight = 125
const maxHeight = height * 0.8
const maxAngle = 20
const startAngle = 40

gsap.set(stage, { width, height })
gsap.ticker.add(render)

function render() {
  const elapsed = now() - start

  if (!blades.length) return

  for (let i = 0; i < total; i++) {
    blades[i].update(elapsed)
  }
}

function createSVG(type, parent) {
  const node = document.createElementNS(xmlns, type)
  parent && parent.appendChild(node)
  return node
}

function random(min, max) {
  if (max == null) {
    max = min
    min = 0
  }
  return min + Math.random() * (max - min)
}

function randomSign() {
  return Math.random() < 0.5 ? 1 : -1
}

function init() {
  blades.forEach((blade) => blade.destroy())

  blades = []

  for (let i = 0; i < total; i++) {
    const path = createSVG("path", stage)
    blades[i] = new Grass(
      path,
      offset,
      width,
      height,
      minHeight,
      maxHeight,
      maxAngle,
      startAngle
    )
  }
}
export { init }
