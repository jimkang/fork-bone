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
    var symmetrical;
    var lengthRange;

    if (opts) {
      a = opts.line[0];
      b = opts.line[1];
      symmetrical = opts.symmetrical;
      lengthRange = opts.lengthRange;
    }

    if (!lengthRange) {
      lengthRange = [10, 50];
    }

    var forkLengthAlpha = lengthRange[0] + probable.roll(lengthRange[1]);
    var forkLengthBeta = lengthRange[0] + probable.roll(lengthRange[1]);

    var ab = subtractPairs(b, a);
    var forkVectors;

    if (symmetrical) {
      forkVectors = getSymmetricalForkVectors(ab);
      forkLengthBeta = forkLengthAlpha;
    }
    else {
      forkVectors = getForkVectors(ab);
    }

    return [
      addPairs(b, changeVectorMagnitude(forkVectors[0], forkLengthAlpha)),
      addPairs(b, changeVectorMagnitude(forkVectors[1], forkLengthBeta))
    ];
  }

  function getForkVectors(guide) {
    return [
      [
        between(guide[0], guide[1]),
        between(guide[1], -guide[0])
      ],
      [
        between(guide[0], -guide[1]),
        between(guide[1], guide[0])
      ]
    ];
  }

  function getSymmetricalForkVectors(boneDirection) {
    var perpendicularMagnitude = probable.rollDie(100)/100;
    var parallelMagnitude = probable.rollDie(100)/100;

    var perpendicularVector = [
      -boneDirection[1] * perpendicularMagnitude,
      boneDirection[0] * perpendicularMagnitude
    ];
    var parallelVector = [
      boneDirection[0] * parallelMagnitude,
      boneDirection[1] * parallelMagnitude
    ];

    return [
      addPairs(perpendicularVector, parallelVector),
      addPairs(multiplyPairBySingleValue(perpendicularVector, -1), parallelVector)
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

function changeVectorMagnitude(v, newMagnitude) {
  var currentMagnitude = getVectorMagnitude(v);
  return multiplyPairBySingleValue(v, newMagnitude/currentMagnitude);
}

module.exports = ForkBone;
