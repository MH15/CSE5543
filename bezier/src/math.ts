import { Point, Vector2 } from "./drawing"

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
    return Math.floor(Math.random() * (max - min) + min);
}


export function makeCurve(bezierCurves: any[][], resolution: number): any[] {
    let nestedAnchors = bezierCurves.map(bezierCurve => {
        let pointArrays = bezierCurve.map(controlPoint => {
            return [controlPoint.x, controlPoint.y]
        })
        var b = bezier(pointArrays);

        let actualResolution = resolution * bezierCurve.length

        let anchors = []
        for (var t = 0; t <= actualResolution; t++) {
            let point = b(t / actualResolution)
            let anchor = new Two.Anchor(point[0], point[1])
            anchors.push(anchor)
        }
        return anchors
    })



    return nestedAnchors.flat()
}


function lerpVector(t: number, a: Vector2, b: Vector2) {
    let result = [0, 0]
    // for each dimension x and y
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] * (1 - t) + b[i] * t
    }
    return result
}


function bezier(pts: any[]) {
    return function (u: number): Vector2 {
        const n = pts.length

        // for i = 0 to n do q_i_0 = q_i
        let q = new Array(n)
        for (let i = 0; i < n; i++) {
            q[i] = new Array(n)
            q[0][i] = pts[i]
        }

        for (let k = 1; k < n; k++) {
            for (let i = 0; i < n - k; i++) {
                let a = q[k - 1][i]
                let b = q[k - 1][i + 1]
                q[k][i] = lerpVector(u, a, b)
            }
        }

        return q[n - 1][0]

    }
}

export function subdivide(bezierCurves: any[][]): any[][] {
    let resultingCurves = []
    // subdivide each curve
    for (const curve of bezierCurves) {
        let pts = curve.map(point => {
            return [point.x, point.y]
        })

        const n = pts.length
        const c = 1 / 2

        // for i = 0 to n do q_i_0 = q_i
        let q = new Array(n)
        for (let i = 0; i < n; i++) {
            q[i] = new Array(n)
            q[0][i] = pts[i]
        }

        for (let k = 1; k < n; k++) {
            for (let i = 0; i < n - k; i++) {
                let a = q[k - 1][i]
                let b = q[k - 1][i + 1]
                q[k][i] = lerpVector(c, a, b)
            }
        }

        let result = []

        // first half
        for (let i = 0; i < n; i++) {
            result[i] = q[i][0]
        }

        resultingCurves.push(result)
        result = []
        // second half
        for (let i = 0; i < n; i++) {
            result[i] = q[n - i - 1][i]
        }
        resultingCurves.push(result)
    }
    return resultingCurves
}


export function r() {
    return randi(25, Math.min(window.innerWidth, window.innerHeight) - 25)
}