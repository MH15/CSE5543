import Two from "two.js";
import { makeHandle, round } from './drawing';
import { fileHandler, mousedownHandler, mousemoveHandler, mouseupHandler, addpointHandler, State, subdivideHandler } from "./events";
import { readFile, parse, download } from "./files";
import { makeCurve } from './math';
import './style.css';


// Make an instance of two and place it on the page.
const elem = document.getElementById('canvas');
let two = new Two({
  width: window.innerWidth, height: window.innerHeight,
  type: Two.Types.svg
}).appendTo(elem)

// Get UI elements
const startEl = document.querySelector<HTMLInputElement>("#start")
const startFileEl = document.querySelector<HTMLInputElement>("#start-file")
const startNumberEl = document.querySelector<HTMLInputElement>("#start-number")
const startMenuEl = document.querySelector<HTMLInputElement>("#start-menu")

const filenameEl = document.querySelector<HTMLInputElement>("#filename")
const saveEl = document.querySelector<HTMLInputElement>("#save")

const resolutionEl = document.querySelector<HTMLInputElement>("#resolution")
const showGuidesEl = document.querySelector<HTMLInputElement>("#show-guides")
const resolutionCount = document.querySelector("#resolution-count")
const subdivideEl = document.querySelector("#subdivide")
const statsEl = document.querySelector("#stats")

// settings
const resolution = () => parseInt(resolutionEl.value)
const showGuides = () => showGuidesEl.checked


// list of lists of location values for each curve, each list describes one curve
// let points = [
//   [new Two.Anchor(r(), r()), new Two.Anchor(r(), r()), new Two.Anchor(r(), r()), new Two.Anchor(r(), r())]
// ]
// let points = [
//   [new Two.Anchor(283, 486), new Two.Anchor(315, 143), new Two.Anchor(633, 109), new Two.Anchor(658, 451)]
// ]

let points: any[] = [[]]



let state: State = {
  dragging: false,
  selected: null,
  tooltip: new Two.Text("_", 100, 100),
  // handles for the user to select, one for each point in all curves
  handles: points.flat().map((point) => {
    return makeHandle(two, point)
  }),
  points: points,
  // find points on all the bezier curves
  pointsOnCurves: null,
  // lines drawn directly between each point in all curves
  guides: new Two.Path(points.flat()),
  maxPoints: null
}

state.tooltip.visible = false
two.add(state.tooltip)

state.guides.noFill()
two.add(state.guides)



// buttons
subdivideEl.addEventListener("click", () => subdivideHandler(state, Two, two, resolution()))
startEl.addEventListener("click", async (e) => {
  let num = startNumberEl.value
  let file = startFileEl.files[0]

  if (file) {
    // load curve from file
    let content = await readFile(file)

    goDisplay(content)
    startMenuEl.style.visibility = "hidden"

  } else if (num.length > 0) {
    // allow user to draw points
    let count = parseInt(num)
    goDraw(count)
    startMenuEl.style.visibility = "hidden"
  } else {
    alert("Please fill out one of the input fields.")
  }
})

saveEl.addEventListener("click", (e) => {
  let filename = filenameEl.value
  if (filename.length === 0) filename = "bezier.txt"

  let content = "BEZIER\n"

  let ndim = 2
  let nump = state.handles.length
  console.log(state)
  let ndegree = (nump - 1) / state.points.length
  content += `${ndim} ${nump} ${ndegree}`

  for (const point of state.handles) {
    content += "\n" + round(point.anchor.x / window.innerWidth) + " " + round(point.anchor.y / window.innerHeight)
  }

  download(filename, content)
})


function goDraw(count: number) {
  console.log("let the user draw")
  state.points = [[]]
  state.handles = []
  state.maxPoints = count
}


function goDisplay(content: string) {
  let { points, degree } = parse(content)
  state.points = []

  const curveSize = degree + 1

  let resultingCurves = []

  let i = 0
  while (i < points.length - 3) {
    resultingCurves.push(points.slice(i, i + 4))
    i += 3
  }



  console.log(state.points)

  // remove the old handles
  state.handles.forEach((handle) => {
    two.remove(handle.circle)
  })

  // clear the points double array
  state.points = []
  // add new bezier curves
  for (const curve of resultingCurves) {
    let anchors = curve.map(point => {
      return new Two.Anchor(point[0], point[1])
    })
    state.points.push(anchors)
  }

  // share inner points
  // all curves besides the first one share the last point of the curve before them
  for (let i = 1; i < state.points.length; i++) {
    let curve = state.points[i]
    let last = state.points[i - 1]
    curve[0] = last[last.length - 1]
  }

  // add new handles for each point in each curve of the points array
  state.handles = []
  for (let i = 0; i < state.points.length; i++) {
    for (let j = 0; j < state.points[i].length; j++) {
      // don't add two handles for shared points on the curves
      if (!(i > 0 && j == 0)) {
        state.handles.push(makeHandle(two, state.points[i][j]))
      }
    }
  }

  state.guides.vertices = state.points.flat()
  state.pointsOnCurves = makeCurve(state.points, resolution())

}

let curve = new Two.Path(state.pointsOnCurves)
curve.linewidth = 2
curve.noFill()
two.add(curve)


elem?.addEventListener("mousedown", (e) => mousedownHandler(e, state, Two))
elem?.addEventListener("mouseup", (e) => mouseupHandler(state))
elem?.addEventListener("mousemove", (e) => mousemoveHandler(e, state, Two))
elem?.addEventListener("click", (e) => addpointHandler(e, state, Two, two))


two.bind('update', function (frameCount: number) {
  // This code is called everytime two.update() is called.
  // Effectively 60 times per second.
  // console.log(resolution.val)
  if (state.points[0].length > 0) {

    state.pointsOnCurves = makeCurve(state.points, resolution())
    curve.vertices = state.pointsOnCurves
    state.guides.visible = showGuides()
  }

  resolutionCount.innerHTML = `${resolution()}`

  statsEl.innerHTML = `Points: ${points.length}, Degree: ${points.length - 1}, Lines: ${state.pointsOnCurves?.length}`
}).play();





