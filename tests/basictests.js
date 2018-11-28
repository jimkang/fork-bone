/* global __dirname */

var test = require('tape');
var ForkBone = require('../index');
var forkToHTML = require('../tools/fork-to-html');
var fs = require('fs');
var queue = require('d3-queue').queue;
var seedrandom = require('seedrandom');

var resultHTMLFragments = [];

var testCases = [
  {
    name: 'Obtuse fork',
    seed: 'qwer',
    opts: {
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150],
      angleRange: [60, 85]
    }
  },

  {
    name: 'Acute fork',
    seed: 'qwer',
    opts: {
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 50],
      angleRange: [2, 30]
    }
  },

  {
    name: 'Symmetrical',
    seed: 'parappa',
    opts: {
      symmetrical: true,
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    }
  },

  {
    name: 'Obtuse symmetrical',
    seed: 'wsx',
    opts: {
      symmetrical: true,
      angleRange: [60, 80],
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    }
  },

  {
    name: '45 degree angle bone',
    seed: 'qwer',
    opts: {
      line: [[30, 50], [0, 20]],
      lengthRange: [20, 150]
    }
  },

  {
    name: 'Vertical bone',
    seed: 'asdf',
    opts: {
      line: [[30, -100], [30, 100]],
      lengthRange: [48, 48]
    }
  },

  {
    name: 'Horizontal bone',
    seed: 'asdf',
    opts: {
      line: [[-50, 0], [-9, 0]],
      lengthRange: [5, 15]
    }
  },

  {
    name: 'No length range',
    seed: 'asdf',
    opts: {
      line: [[30, 50], [0, 20]]
    }
  },

  {
    name: '0-vector, avoid NaN',
    seed: '2018-11-26T21:26:10.274Z',
    opts: {
      line: [[95.5, 12], [95.5, 12]],
      lengthRange: [1, 1],
      angleRange: [4, 70]
    }
  },

  {
    name: 'Handle really small differences',
    seed: '2018-11-26T21:26:10.274Z',
    opts: {
      line: [[95.5, 12], [95.50000001, 12.0000001]],
      lengthRange: [1, 1]
    },
    createOpts: {
      numberOfDecimalsToConsider: 8
    }
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
    forkPoints.forEach(checkPair);
    t.end();
    done();

    function checkPair(pair) {
      t.ok(!isNaN(pair[0]), 'x is valid.');
      t.ok(!isNaN(pair[1]), 'y is valid.');
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
