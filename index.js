var createProbable = require('probable').createProbable;

function ForkBone(createOpts) {
  var random;
  if (createOpts) {
    random = createOpts.random;
  }
  var probable = createProbable({
    random: random
  });

  return forkBone;

  function forkBone(opts) {
    var a;
    var b;
    var lengthRange;
    var extensionExtent = 20;

    if (opts) {
      a = opts.line[0];
      b = opts.line[1];
      lengthRange = opts.lengthRange;
    }

    var ab = subtractPairs(b, a);
    var forkVectors = getForkVectors(ab);

    return [
      addPairs(b, forkVectors[0]),
      addPairs(b, forkVectors[1])
    ];

    function normalizePointToAB(point) {
      return point * magnitudeRatioABToBC;
    }
  }

  function getForkVectors(guide) {
    // var cExtension = probable.roll(extensionExtent);
    // var dExtension = probable.roll(extensionExtent);
    // var c = [0, 0];
    // var d = [0, 0];

    return [
      [
        between(guide[0], guide[1]),
        between(guide[1], -guide[0])
        // guide[1] + probable.roll(-guide[0] - guide[1])
      ],
      [
        between(guide[0], -guide[1]),
        between(guide[1], guide[0])
      ]
    ];
  }

  function between(a, b) {
    var range = b - a;
    var sign = range >= 0 ? 1 : -1;
    // TODO: Make this OK for really small numbers.
    var extent = sign * probable.roll(Math.abs(range));
    return a + extent;
  }
}


function getVectorMagnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function addPairs(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function subtractPairs(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function multiplyPairBySingleValue(pair, single) {
  return [pair[0] * single, pair[1] * single];
}

function getPerpendicularVector(v) {
  return [-v[1], v[0]];
}

function changeVectorMagnitude(v, newMagnitude) {
  var currentMagnitude = getVectorMagnitude(v);
  return multiplyPairBySingleValue(v, newMagnitude/currentMagnitude);
}

module.exports = ForkBone;
