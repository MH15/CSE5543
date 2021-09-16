import Two from "../node_modules/two.js/build/two.module.js";
function findClosestPoint(points, position, range) {
  let closest = null;
  let distance = range;
  for (const p of points) {
    let len = p.circle.translation.distanceTo(position);
    if (len < distance) {
      distance = len;
      closest = p;
    }
  }
  return closest;
}
function getIndex(handles, point) {
  let index = handles.findIndex((i) => {
    return i.anchor.equals(point.anchor);
  });
  return index;
}
function makeCurve(bezierCurves, resolution) {
  let nestedAnchors = bezierCurves.map((bezierCurve) => {
    let pointArrays = bezierCurve.map((controlPoint) => {
      return [controlPoint.x, controlPoint.y];
    });
    var b = bezier(pointArrays);
    let actualResolution = resolution * bezierCurve.length;
    let anchors = [];
    for (var t = 0; t <= actualResolution; t++) {
      let point = b(t / actualResolution);
      let anchor = new Two.Anchor(point[0], point[1]);
      anchors.push(anchor);
    }
    return anchors;
  });
  return nestedAnchors.flat();
}
function lerpVector(t, a, b) {
  let result = [0, 0];
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] * (1 - t) + b[i] * t;
  }
  return result;
}
function bezier(pts) {
  return function(u) {
    const n = pts.length;
    let q = new Array(n);
    for (let i = 0; i < n; i++) {
      q[i] = new Array(n);
      q[0][i] = pts[i];
    }
    for (let k = 1; k < n; k++) {
      for (let i = 0; i < n - k; i++) {
        let a = q[k - 1][i];
        let b = q[k - 1][i + 1];
        q[k][i] = lerpVector(u, a, b);
      }
    }
    return q[n - 1][0];
  };
}
function subdivide(bezierCurves) {
  let resultingCurves = [];
  for (const curve of bezierCurves) {
    let pts = curve.map((point) => {
      return [point.x, point.y];
    });
    const n = pts.length;
    const c = 1 / 2;
    let q = new Array(n);
    for (let i = 0; i < n; i++) {
      q[i] = new Array(n);
      q[0][i] = pts[i];
    }
    for (let k = 1; k < n; k++) {
      for (let i = 0; i < n - k; i++) {
        let a = q[k - 1][i];
        let b = q[k - 1][i + 1];
        q[k][i] = lerpVector(c, a, b);
      }
    }
    let result = [];
    for (let i = 0; i < n; i++) {
      result[i] = q[i][0];
    }
    resultingCurves.push(result);
    result = [];
    for (let i = 0; i < n; i++) {
      result[i] = q[n - i - 1][i];
    }
    resultingCurves.push(result);
  }
  return resultingCurves;
}
export { findClosestPoint, getIndex, makeCurve, subdivide };
