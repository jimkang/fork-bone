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
      line: [
        [30, 50],
        [0, 20]
      ],
      lengthRange: [20, 150],
      obtuse: true
    },
    expected: [
      [ -141.07030118178196, 57.61874698180852 ],
      [ 1.929051305189444, -8.935769577841661 ]
    ]
  },

  {
    name: 'Symmetrical',
    seed: 'parappa',
    opts: {
      symmetrical: true,
      line: [
        [30, 50],
        [0, 20]
      ],
      lengthRange: [20, 150]
    },
    expected: [
      [ -18.4488197660262, 27.722761762522595 ],
      [ 7.7227617625225955, 1.551180233973799 ]
    ]
  },

  {
    name: '45 degree angle bone',
    seed: 'qwer',
    opts: {
      line: [
        [30, 50],
        [0, 20]
      ],
      lengthRange: [20, 150]
    },
    expected: [
      [ -133.96312129524892, -38.05068589460786 ],
      [ -18.992985614117416, -1.9149834009047098 ]
    ]
  },

  {
    name: 'Vertical bone',
    seed: 'asdf',
    opts: {
      line: [
        [30, -100],
        [30, 100]
      ],
      lengthRange: [48, 48]
    },
    expected: [
      [ 65.61982915340042, 163.7199165966385 ],
      [ -39.919059951033475, 129.78800187262965 ]
    ]
  },

  {
    name: 'Horizontal bone',
    seed: 'asdf',
    opts: {
      line: [
        [-50, 0],
        [-9, 0]
      ],
      lengthRange: [5, 15]
    },
    expected: [
      [ 2.3339615604739095, -3.9422474992952727 ],
      [ -5.620344845177656, 12.553004860768706 ]
    ]
  },

  {
    name: 'No length range',
    seed: 'asdf',
    opts: {
      line: [
        [30, 50],
        [0, 20]
      ]
    },
    expected: [
      [ -30.41348671995223, 0.7381250773635877 ],
      [ 21.633307652783937, -12.449961479175904 ]
    ]
  }
];

((function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments);

  function queueTestRun(testCase) {
    q.defer(runTest, testCase);
  }
})());

function runTest(testCase, done) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var forkBone = ForkBone({
      random: seedrandom(testCase.seed)
    });
    var forkPoints = forkBone(testCase.opts);

    resultHTMLFragments.push(forkToHTML({
      title: testCase.name,
      originalLine: testCase.opts.line,
      forkPoints: forkPoints
    }));
    console.log(forkPoints);
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
  var filepath = __dirname + '/basic-test-results.html';
  fs.writeFileSync(filepath, html);
  console.log('Wrote rendered test results to', filepath);
}
