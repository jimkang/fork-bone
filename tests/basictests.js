/* global __dirname */

var test = require('tape');
var ForkBone = require('../index');
var forkToHTML = require('../tools/fork-to-html');
var fs = require('fs');
var queue = require('d3-queue').queue;
var seedrandom = require('seedrandom');

var tolerance = 0.001;
var resultHTMLFragments = [];

var testCases = [
  {
    name: 'Obtuse fork',
    seed: 'qwer',
    opts: {
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150],
      obtuse: true
    },
    expected: [
      [-124.64430720856078, 53.23848192228287],
      [1.8625322946656702, -7.937984419985053]
    ]
  },

  {
    name: 'Symmetrical',
    seed: 'parappa',
    opts: {
      symmetrical: true,
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    },
    expected: [
      [-18.4488197660262, 27.722761762522595],
      [7.7227617625225955, 1.551180233973799]
    ]
  },

  {
    name: 'Obtuse symmetrical',
    seed: 'wsx',
    opts: {
      symmetrical: true,
      obtuse: true,
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    },
    expected: [
      [-110.61073394387975, 29.28792422429524],
      [9.287924224295239, -90.61073394387975]
    ]
  },

  {
    name: '45 degree angle bone',
    seed: 'qwer',
    opts: {
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    },
    expected: [
      [-118.3646756649802, -31.29135945482475],
      [-18.33805507569957, -1.1592943181148918]
    ]
  },

  {
    name: 'Vertical bone',
    seed: 'asdf',
    opts: {
      line: [[30, -100], [30, 100]],
      lengthRange: [48, 48]
    },
    expected: [
      [53.42125752552356, 141.89802735121435],
      [-14.159406284863252, 118.813474866924]
    ]
  },

  {
    name: 'Horizontal bone',
    seed: 'asdf',
    opts: {
      line: [[-50, 0], [-9, 0]],
      lengthRange: [5, 15]
    },
    expected: [
      [0.44496796706159003, -3.285206249412727],
      [-6.4002652655212735, 9.656157585206696]
    ]
  },

  {
    name: 'No length range',
    seed: 'asdf',
    opts: {
      line: [[30, 50], [0, 20]]
    },
    expected: [
      [-26.18939134218109, 3.4133854832853103],
      [18.305106475432563, -7.457659713148843]
    ]
  },

  {
    name: '0-vector, avoid NaN',
    seed: '2018-11-26T21:26:10.274Z',
    opts: {
      line: [[95.5, 12], [95.5, 12]],
      lengthRange: [1, 1],
      obtuse: true
    },
    expected: [[95.5, 12], [95.5, 12]]
  },

  {
    name: 'Handle really small differences',
    seed: '2018-11-26T21:26:10.274Z',
    opts: {
      line: [[95.5, 12], [95.50000001, 12.0000001]],
      lengthRange: [1, 1],
      obtuse: true
    },
    createOpts: {
      numberOfDecimalsToConsider: 8
    },
    expected: [
      [96.50000001, 12.0000001],
      [95.38956848318853, 12.993883834591772]
    ]
  }
];

(function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments);

  function queueTestRun(testCase) {
    q.defer(runTest, testCase);
  }
})();

function runTest(testCase, done) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var forkBone = ForkBone({
      random: seedrandom(testCase.seed),
      numberOfDecimalsToConsider: testCase.createOpts
        ? testCase.createOpts.numberOfDecimalsToConsider
        : null
    });
    var forkPoints = forkBone(testCase.opts);

    resultHTMLFragments.push(
      forkToHTML({
        title: testCase.name,
        originalLine: testCase.opts.line,
        forkPoints: forkPoints
      })
    );
    console.log('forkPoints:', forkPoints);
    forkPoints.forEach(comparePair);
    t.end();
    done();

    function comparePair(pair, i) {
      t.ok(
        Math.abs(pair[0] - testCase.expected[i][0]) < tolerance &&
          Math.abs(pair[1] - testCase.expected[i][1]) < tolerance,
        'Fork point is correct.'
      );
    }
  }
}

function writeOutHTMLFragments() {
  const html = `<html>
  <head>
    <title>Result graphs of basictests.js</title>
    <style>
        body {
          font-family: "Helvetica Neue", sans-serif;
        }

        path {
          fill: none;
          stroke-width: 1;
        }

        .original-line {
          stroke: #333;
        }

        .fork-line {
          stroke: hsl(327, 69%, 48%);
          stroke-dashoffset: 10;
          stroke-dasharray: 3, 2;
        }

        .fork-point {
          fill: hsla(327, 80%, 50%, 0.8);
        }
    </style>
  </head>

  <body>
  ${resultHTMLFragments.join('\n')}
  </body>
  </html>
   `;
  if (fs && fs.writeFileSync) {
    var filepath = __dirname + '/basic-test-results.html';
    fs.writeFileSync(filepath, html);
    console.log('Wrote rendered test results to', filepath);
  }
}
