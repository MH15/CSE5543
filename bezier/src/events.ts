import { HANDLE_COLOR, HANDLE_COLOR_FOCUSED } from "./config"
import { drawTooltip, makeHandle, Point } from "./drawing"
import { findClosestPoint, getIndex, makeCurve, subdivide } from "./math"

export type State = {
    dragging: boolean,
    selected: Point,
    tooltip: any,
    handles: Point[],
    points: any[][],
    pointsOnCurves: any[],
    guides: any,
    maxPoints: number
}

export function mouseupHandler(state: State) {
    state.dragging = false
}

export function mousemoveHandler(e: MouseEvent, state: State, Two: any) {
    if (state.dragging) {
        let x = e.clientX
        let y = e.clientY
        let point = new Two.Vector(x, y)

        if (state.selected != null) {
            state.selected.circle.translation = point
            state.selected.anchor.x = point.x
            state.selected.anchor.y = point.y
            drawTooltip(
                state.tooltip,
                state.selected.circle.translation,
                getIndex(state.handles, state.selected)
            )

        }
    }
}

export function mousedownHandler(e: MouseEvent, state: State, Two: any) {
    state.dragging = true

    let x = e.clientX
    let y = e.clientY
    let point = new Two.Vector(x, y)

    state.selected = findClosestPoint(state.handles, point, 35)
    for (const handle of state.handles) {
        handle.circle.fill = HANDLE_COLOR
    }
    if (state.selected != null) {
        state.selected.circle.fill = HANDLE_COLOR_FOCUSED
        drawTooltip(state.tooltip, state.selected.circle.translation, getIndex(state.handles, state.selected))

    } else {
        state.tooltip.visible = false
    }
}

export function subdivideHandler(state: State, Two: any, two: any, resolution: number) {
    // console.log("subdivide")
    let resultingCurves = subdivide(state.points)

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
    state.pointsOnCurves = makeCurve(state.points, resolution)
}


export function addpointHandler(e: MouseEvent, state: State, Two: any, two: any) {
    e.preventDefault()

    if (state.points[0].length < state.maxPoints) {
        let x = e.clientX
        let y = e.clientY
        let point = new Two.Vector(x, y)
        state.points[state.points.length - 1].push(point)
        let handle = makeHandle(two, point)
        state.guides.vertices.push(handle.anchor)
        state.handles.push(handle)
    }
    console.log(state)
    return false
}

