import { HANDLE_COLOR, HANDLE_COLOR_FOCUSED } from "./config.js";
import { drawTooltip, makeHandle } from "./drawing.js";
import { getIndex, findClosestPoint, subdivide, makeCurve } from "./math.js";
function mouseupHandler(state) {
  state.dragging = false;
}
function mousemoveHandler(e, state, Two) {
  if (state.dragging) {
    let x = e.clientX;
    let y = e.clientY;
    let point = new Two.Vector(x, y);
    if (state.selected != null) {
      state.selected.circle.translation = point;
      state.selected.anchor.x = point.x;
      state.selected.anchor.y = point.y;
      drawTooltip(state.tooltip, state.selected.circle.translation, getIndex(state.handles, state.selected));
    }
  }
}
function mousedownHandler(e, state, Two) {
  state.dragging = true;
  let x = e.clientX;
  let y = e.clientY;
  let point = new Two.Vector(x, y);
  state.selected = findClosestPoint(state.handles, point, 35);
  for (const handle of state.handles) {
    handle.circle.fill = HANDLE_COLOR;
  }
  if (state.selected != null) {
    state.selected.circle.fill = HANDLE_COLOR_FOCUSED;
    drawTooltip(state.tooltip, state.selected.circle.translation, getIndex(state.handles, state.selected));
  } else {
    state.tooltip.visible = false;
  }
}
function subdivideHandler(state, Two, two, resolution) {
  let resultingCurves = subdivide(state.points);
  state.handles.forEach((handle) => {
    two.remove(handle.circle);
  });
  state.points = [];
  for (const curve of resultingCurves) {
    let anchors = curve.map((point) => {
      return new Two.Anchor(point[0], point[1]);
    });
    state.points.push(anchors);
  }
  for (let i = 1; i < state.points.length; i++) {
    let curve = state.points[i];
    let last = state.points[i - 1];
    curve[0] = last[last.length - 1];
  }
  state.handles = [];
  for (let i = 0; i < state.points.length; i++) {
    for (let j = 0; j < state.points[i].length; j++) {
      if (!(i > 0 && j == 0)) {
        state.handles.push(makeHandle(two, state.points[i][j]));
      }
    }
  }
  state.guides.vertices = state.points.flat();
  state.pointsOnCurves = makeCurve(state.points, resolution);
}
function addpointHandler(e, state, Two, two) {
  e.preventDefault();
  if (state.points[0].length < state.maxPoints) {
    let x = e.clientX;
    let y = e.clientY;
    let point = new Two.Vector(x, y);
    state.points[state.points.length - 1].push(point);
    let handle = makeHandle(two, point);
    state.guides.vertices.push(handle.anchor);
    state.handles.push(handle);
  }
  console.log(state);
  return false;
}
export { addpointHandler, mousedownHandler, mousemoveHandler, mouseupHandler, subdivideHandler };
