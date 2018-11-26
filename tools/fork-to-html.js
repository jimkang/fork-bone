const d3 = require('d3-shape');
const scaleToFit = require('scale-to-fit');

function bendToHTML(opts) {
  const { title, originalLine, forkPoints } = opts;

  const line = d3.line();
  line.curve(d3.curveLinear);

  const bounds = getBounds([
    originalLine[0],
    originalLine[1],
    forkPoints[0],
    forkPoints[1]
  ]);

  const boardWidth = 480;
  const boardHeight = 480;
  const margin = 20;

  const branchC = [originalLine[1], forkPoints[0]];
  const branchD = [originalLine[1], forkPoints[1]];

  var matrixPoints = scaleToFit({
    view: {
      left: 0,
      top: 0,
      right: boardWidth - 2 * margin,
      bottom: boardHeight - 2 * margin
    },
    content: bounds
  });

  matrixPoints[4] += margin;
  matrixPoints[5] += margin;

  return `  <p>${title}</p>
    <svg width="${boardWidth}" height="${boardHeight}">
      <g transform="matrix(${matrixPoints.join(' ')})">
        <path d=${line(originalLine)} class="original-line"></path>
        <path d=${line(branchC)} class="fork-line"></path>
        <path d=${line(branchD)} class="fork-line"></path>
        <circle r="1" cx="${forkPoints[0][0]}" cy="${
    forkPoints[0][1]
  }" class="widen-point"></circle>
        <circle r="1" cx="${forkPoints[1][0]}" cy="${
    forkPoints[1][1]
  }" class="widen-point"></circle>
      </g>
    </svg>
    `;
}

function getBounds(points) {
  var left = 0;
  var right = 0;
  var top = 0;
  var bottom = 0;

  points.forEach(updateBoundsForPoint);

  function updateBoundsForPoint(point) {
    if (point[0] < left) {
      left = point[0];
    } else if (point[0] > right) {
      right = point[0];
    }

    if (point[1] < top) {
      top = point[1];
    } else if (point[1] > bottom) {
      bottom = point[1];
    }
  }

  return {
    left: left,
    right: right,
    bottom: bottom,
    top: top
  };
}

module.exports = bendToHTML;
