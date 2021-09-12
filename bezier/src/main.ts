import Two from "two.js";
import { HANDLE_COLOR, HANDLE_COLOR_FOCUSED } from './config';
import { drawTooltip, makeHandle, Point } from './drawing';
import { findClosestPoint, getIndex, makeCurve, r, randi, subdivide } from './math';
import './style.css';


// Make an instance of two and place it on the page.
var elem = document.getElementById('canvas');
console.log(elem)
var params = {
  width: window.innerWidth, height: window.innerHeight,
  type: Two.Types.svg
};
var two = new Two(params).appendTo(elem);



let points = [new Two.Anchor(r(), r()), new Two.Anchor(r(), r()), new Two.Anchor(r(), r()), new Two.Anchor(r(), r())]

let tooltip = new Two.Text("reeee", 100, 100)
tooltip.visible = false
two.add(tooltip)

let guides = new Two.Path(points)
guides.noFill()
two.add(guides)

let handles = points.map((point) => {
  return makeHandle(two, point)
})

let selected: Point | null = null

let dragging = false


// html
const resolutionEl = document.querySelector<HTMLInputElement>("#resolution")
const showGuidesEl = document.querySelector<HTMLInputElement>("#show-guides")
const resolutionCount = document.querySelector("#resolution-count")
const subdivideEl = document.querySelector("#subdivide")
const statsEl = document.querySelector("#stats")



// settings
function resolution() {
  return parseInt(resolutionEl.value)
}

function showGuides() {
  return showGuidesEl.checked
}


// buttons
subdivideEl.addEventListener("click", () => {
  console.log("subdivide")
  let result = subdivide(points)
  console.log(result)
  handles.forEach((handle) => {
    two.remove(handle.circle)
  })
  points = result.map(point => {
    return new Two.Anchor(point[0], point[1])
  })
  handles = points.map((point) => {
    return makeHandle(two, point)
  })
  guides.vertices = points

  anchors = makeCurve(points, resolution())
})



let anchors = makeCurve(points, resolution())

let curve = new Two.Path(anchors)
curve.linewidth = 2
curve.noFill()
two.add(curve)




elem?.addEventListener("mousedown", (e) => {
  dragging = true

  let x = e.clientX
  let y = e.clientY
  let point = new Two.Vector(x, y)

  selected = findClosestPoint(handles, point, 35)
  for (const handle of handles) {
    handle.circle.fill = HANDLE_COLOR
  }
  if (selected != null) {
    selected.circle.fill = HANDLE_COLOR_FOCUSED
    drawTooltip(tooltip, selected.circle.translation, getIndex(handles, selected))

  } else {
    tooltip.visible = false
  }
})

elem?.addEventListener("mouseup", (e) => {
  dragging = false
})

elem?.addEventListener("mousemove", (e) => {
  if (dragging) {
    let x = e.clientX
    let y = e.clientY
    let point = new Two.Vector(x, y)

    if (selected != null) {
      selected.circle.translation = point
      selected.anchor.x = point.x
      selected.anchor.y = point.y
      drawTooltip(tooltip, selected.circle.translation, getIndex(handles, selected))

    }
  }
})

elem?.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  let x = e.clientX
  let y = e.clientY
  let point = new Two.Vector(x, y)
  points.push(point)
  let handle = makeHandle(two, point)
  guides.vertices.push(handle.anchor)
  handles.push(handle)

  return false
})


two.bind('update', function (frameCount: number) {
  // This code is called everytime two.update() is called.
  // Effectively 60 times per second.
  // console.log(resolution.val)
  anchors = makeCurve(points, resolution())
  curve.vertices = anchors
  guides.visible = showGuides()

  resolutionCount.innerHTML = `${resolution()}`

  statsEl.innerHTML = `Points: ${points.length}, Degree: ${points.length - 1}, Lines: ${anchors.length}`
}).play();





