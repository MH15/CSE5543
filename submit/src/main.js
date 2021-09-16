var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import Two from "../node_modules/two.js/build/two.module.js";
import { makeHandle, round } from "./drawing.js";
import { subdivideHandler, mousedownHandler, mouseupHandler, mousemoveHandler, addpointHandler } from "./events.js";
import { readFile, download, parse } from "./files.js";
import { makeCurve } from "./math.js";
/* empty css       */const elem = document.getElementById("canvas");
let two = new Two({
  width: window.innerWidth,
  height: window.innerHeight,
  type: Two.Types.svg
}).appendTo(elem);
const startEl = document.querySelector("#start");
const startFileEl = document.querySelector("#start-file");
const startNumberEl = document.querySelector("#start-number");
const startMenuEl = document.querySelector("#start-menu");
const filenameEl = document.querySelector("#filename");
const saveEl = document.querySelector("#save");
const resolutionEl = document.querySelector("#resolution");
const showGuidesEl = document.querySelector("#show-guides");
const resolutionCount = document.querySelector("#resolution-count");
const subdivideEl = document.querySelector("#subdivide");
const statsEl = document.querySelector("#stats");
const resolution = () => parseInt(resolutionEl.value);
const showGuides = () => showGuidesEl.checked;
let points = [[]];
let state = {
  dragging: false,
  selected: null,
  tooltip: new Two.Text("_", 100, 100),
  handles: points.flat().map((point) => {
    return makeHandle(two, point);
  }),
  points,
  pointsOnCurves: null,
  guides: new Two.Path(points.flat()),
  maxPoints: null
};
state.tooltip.visible = false;
two.add(state.tooltip);
state.guides.noFill();
two.add(state.guides);
subdivideEl.addEventListener("click", () => subdivideHandler(state, Two, two, resolution()));
startEl.addEventListener("click", (e) => __async(this, null, function* () {
  let num = startNumberEl.value;
  let file = startFileEl.files[0];
  if (file) {
    let content = yield readFile(file);
    goDisplay(content);
    startMenuEl.style.visibility = "hidden";
  } else if (num.length > 0) {
    let count = parseInt(num);
    goDraw(count);
    startMenuEl.style.visibility = "hidden";
  } else {
    alert("Please fill out one of the input fields.");
  }
}));
saveEl.addEventListener("click", (e) => {
  let filename = filenameEl.value;
  if (filename.length === 0)
    filename = "bezier.txt";
  let content = "BEZIER\n";
  let ndim = 2;
  let nump = state.handles.length;
  console.log(state);
  let ndegree = (nump - 1) / state.points.length;
  content += `${ndim} ${nump} ${ndegree}`;
  for (const point of state.handles) {
    content += "\n" + round(point.anchor.x / window.innerWidth) + " " + round(point.anchor.y / window.innerHeight);
  }
  download(filename, content);
  saveEl.innerHTML = "Saved!";
  setTimeout(() => {
    saveEl.innerHTML = "Save";
  }, 2e3);
});
function goDraw(count) {
  console.log("let the user draw");
  state.points = [[]];
  state.handles = [];
  state.maxPoints = count;
}
function goDisplay(content) {
  let { points: points2, degree } = parse(content);
  state.points = [];
  let resultingCurves = [];
  let i = 0;
  while (i < points2.length - degree) {
    resultingCurves.push(points2.slice(i, i + degree + 1));
    i += degree;
  }
  console.log(state.points);
  state.handles.forEach((handle) => {
    two.remove(handle.circle);
  });
  state.points = [];
  for (const curve2 of resultingCurves) {
    let anchors = curve2.map((point) => {
      return new Two.Anchor(point[0], point[1]);
    });
    state.points.push(anchors);
  }
  for (let i2 = 1; i2 < state.points.length; i2++) {
    let curve2 = state.points[i2];
    let last = state.points[i2 - 1];
    curve2[0] = last[last.length - 1];
  }
  state.handles = [];
  for (let i2 = 0; i2 < state.points.length; i2++) {
    for (let j = 0; j < state.points[i2].length; j++) {
      if (!(i2 > 0 && j == 0)) {
        state.handles.push(makeHandle(two, state.points[i2][j]));
      }
    }
  }
  state.guides.vertices = state.points.flat();
  state.pointsOnCurves = makeCurve(state.points, resolution());
}
let curve = new Two.Path(state.pointsOnCurves);
curve.linewidth = 2;
curve.noFill();
two.add(curve);
elem == null ? void 0 : elem.addEventListener("mousedown", (e) => mousedownHandler(e, state, Two));
elem == null ? void 0 : elem.addEventListener("mouseup", (e) => mouseupHandler(state));
elem == null ? void 0 : elem.addEventListener("mousemove", (e) => mousemoveHandler(e, state, Two));
elem == null ? void 0 : elem.addEventListener("click", (e) => addpointHandler(e, state, Two, two));
two.bind("update", function(frameCount) {
  var _a;
  if (state.points[0].length > 0) {
    state.pointsOnCurves = makeCurve(state.points, resolution());
    curve.vertices = state.pointsOnCurves;
    state.guides.visible = showGuides();
  }
  resolutionCount.innerHTML = `${resolution()}`;
  statsEl.innerHTML = `Points: ${state.points.flat().length}, Curves: ${state.points.length} Degree: ${state.points[0].length - 1}, Lines: ${(_a = state.pointsOnCurves) == null ? void 0 : _a.length}`;
}).play();
