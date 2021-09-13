
import Two from 'two.js';
import { HANDLE_COLOR } from './config';

export function makeHandle(two: any, anchor: any): Point {
    let circle = two.makeCircle(anchor.x, anchor.y, 5);
    circle.fill = HANDLE_COLOR
    // circle.stroke = 'orangered'
    circle.linewidth = 0

    return {
        circle: circle,
        anchor: anchor
    }
}

export type Point = {
    circle: any,
    anchor: any
}


export type Vector2 = [number, number];


export function drawTooltip(tooltip: any, translation: any, index: number) {
    tooltip.visible = true
    tooltip.translation = new Two.Vector(translation.x, translation.y - 15)
    tooltip.value = `Point ${index}\n(${round(translation.x / window.innerWidth)}, ${round(translation.y / window.innerHeight)})`
}

export const round = (num: number) => {
    return Math.round(num * 100) / 100
}