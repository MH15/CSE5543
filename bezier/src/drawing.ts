
import Two from 'two.js';
import { HANDLE_COLOR } from './config';

export function makePoint(two: any, anchor: any): Point {
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


export function drawTooltip(tooltip: any, translation: any, index: number) {
    tooltip.visible = true
    tooltip.translation = new Two.Vector(translation.x, translation.y - 15)
    tooltip.value = `Point ${index}\n(${translation.x}, ${translation.y})`
}