import Two from "../node_modules/two.js/build/two.module.js";
import { HANDLE_COLOR } from "./config.js";
function makeHandle(two, anchor) {
  let circle = two.makeCircle(anchor.x, anchor.y, 5);
  circle.fill = HANDLE_COLOR;
  circle.linewidth = 0;
  return {
    circle,
    anchor
  };
}
function drawTooltip(tooltip, translation, index) {
  tooltip.visible = true;
  tooltip.translation = new Two.Vector(translation.x, translation.y - 15);
  tooltip.value = `Point ${index}
(${round(translation.x / window.innerWidth)}, ${round(translation.y / window.innerHeight)})`;
}
const round = (num) => {
  return Math.round(num * 1e4) / 1e4;
};
export { drawTooltip, makeHandle, round };
