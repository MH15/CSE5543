import './style.css'


import Two from "two.js";

import { drawTooltip, makePoint, Point } from './drawing';
import { findClosestPoint, getIndex, makeCurve } from './math';
import { HANDLE_COLOR, HANDLE_COLOR_FOCUSED } from './config';

// Make an instance of two and place it on the page.
var elem = document.getElementById('canvas');
console.log(elem)
var params = {
  width: window.innerWidth, height: window.innerHeight,
  type: Two.Types.svg
};
var two = new Two(params).appendTo(elem);





let points = [new Two.Anchor(500, 190), new Two.Anchor(30, 19), new Two.Anchor(111, 92)]

let tooltip = new Two.Text("reeee", 100, 100)
tooltip.visible = false
two.add(tooltip)

let path = new Two.Path(points)
path.noFill()
two.add(path)

let handles = points.map((point) => {
  return makePoint(two, point)
})

let selected: Point | null = null

let dragging = false




let anchors = makeCurve(points)

let curve = new Two.Path(anchors)
curve.linewidth = 2
curve.noFill()
two.add(curve)






elem?.addEventListener("mousedown", (e) => {
  // if (selected != null) {
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

    anchors = makeCurve(points)
    curve.vertices = anchors

    // path.points = points
    two.update()
  }
})

elem?.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  let x = e.clientX
  let y = e.clientY
  let point = new Two.Vector(x, y)
  points.push(point)
  let handle = makePoint(two, point)
  path.vertices.push(handle.anchor)
  handles.push(handle)
  console.log(path.vertices)

  anchors = makeCurve(points)
  curve.vertices = anchors
  return false
})
// Don't forget to tell two to render everything
// to the screen
two.bind('update', function (frameCount: number) {
  // This code is called everytime two.update() is called.
  // Effectively 60 times per second.
}).play();





