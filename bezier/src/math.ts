import { Point } from "./drawing"

import Two from "two.js";

export function findClosestPoint(points: any[], position: any, range: number): null | any {
    let closest = null
    let distance = range
    for (const p of points) {
        let len = p.circle.translation.distanceTo(position)
        if (len < distance) {
            distance = len
            closest = p
        }
    }

    return closest
}

export function getIndex(handles: Point[], point: Point) {
    let index = handles.findIndex(i => {
        return i.anchor.equals(point.anchor)
    })
    return index
}

export function randi(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


export function makeCurve(anchors: any[], resolution: number) {
    // console.log('updateing the curve')

    let pointArrays = anchors.map(point => {
        return [point.x, point.y]
    })
    var b = bezier(pointArrays);


    let curve = []
    for (var t = 0; t <= resolution; t++) {
        let point = b(t / resolution)
        let anchor = new Two.Anchor(point[0], point[1])
        curve.push(anchor)
    }
    return curve
}


function bezier(pts: any[]) {
    return function (t: number) {
        // do..while loop in disguise
        for (var a = pts; a.length > 1; a = b) {
            // cycle over control points
            for (var i = 0, b = [], j; i < a.length - 1; i++) {
                // cycle over dimensions
                for (b[i] = [], j = 0; j < a[i].length; j++) {
                    b[i][j] = a[i][j] * (1 - t) + a[i + 1][j] * t;  // interpolation

                }
            }

        }
        return a[0];
    }
}
