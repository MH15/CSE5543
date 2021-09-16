function parse(content) {
  let lines = content.split(/\r\n|\r|\n/);
  let ptr = 0;
  if (lines[ptr] != "BEZIER")
    throw new Error("File must begin with 'BEZIER'");
  while (lines[ptr].startsWith("#")) {
    ptr++;
  }
  ptr++;
  let [ndim, nump, ndegree] = validate(lines[ptr]);
  ptr++;
  let points = [];
  while (ptr < lines.length) {
    let chars = lines[ptr].split(" ");
    let x = parseFloat(chars[0]) * window.innerWidth;
    let y = parseFloat(chars[1]) * window.innerHeight;
    points.push([x, y]);
    ptr++;
  }
  let ncurves = (nump - 1) / ndegree;
  if (Math.round(ncurves) !== ncurves)
    throw new Error("degree does not match");
  return {
    points,
    degree: ndegree
  };
}
function validate(line) {
  let chars = line.split(" ");
  let ndim = parseInt(chars[0]);
  let nump = parseInt(chars[1]);
  let ndegree = parseInt(chars[2]);
  return [ndim, nump, ndegree];
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (res) => {
      resolve(res.target.result.toString());
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
function download(filename, text) {
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
export { download, parse, readFile };
