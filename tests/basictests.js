var test = require('tape');
var ForkBone = require('../index');
var forkToHTML = require('../tools/fork-to-html');
var fs = require('fs');
var queue = require('d3-queue').queue;

const tolerance = 0.001;
var resultHTMLFragments = [];

var testCases = [
  {
    name: '45 degree angle bone',
    opts: {
      line: [
        [30, 50],
        [0, 20]
      ],
      lengthRange: [20, 48]
    },
    expected: [
      [20, 20],
      [1, 1]
    ]
  },

];

((function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments)

  function queueTestRun(testCase) {
    q.defer(runTest, testCase);
  }
})());

function runTest(testCase, done) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var forkBone = ForkBone({

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
