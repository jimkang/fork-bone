var createProbable = require('probable').createProbable;

function ForkBone(createOpts) {
  var random;
  var numberOfDecimalsToConsider;

  if (createOpts) {
    random = createOpts.random;
    numberOfDecimalsToConsider = createOpts.numberOfDecimalsToConsider;
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
    var angleRange;

    if (opts) {
      a = opts.line[0];
      b = opts.line[1];
      symmetrical = opts.symmetrical;
      lengthRange = opts.lengthRange;
      angleRange = opts.angleRange;
    }

    if (!lengthRange) {
      lengthRange = [10, 50];
    }
    if (!angleRange) {
      angleRange = [1, 89];
    }

    var forkLengthAlpha =
      lengthRange[0] + probable.roll(lengthRange[1] - lengthRange[0]);
    var forkLengthBeta =
      lengthRange[0] + probable.roll(lengthRange[1] - lengthRange[0]);

    var ab = subtractPairs(b, a);
    var forkVectors;
    if (symmetrical) {
      forkVectors = getSymmetricalForkVectors(ab, angleRange);
      forkLengthBeta = forkLengthAlpha;
    } else {
      forkVectors = getForkVectors(ab, angleRange);
    }

    // Avoid NaN while trying to change vector magnitudes.
    if (forkVectors[0][0] !== 0.0 || forkVectors[0][1] !== 0.0) {
      forkVectors[0] = changeVectorMagnitude(forkVectors[0], forkLengthAlpha);
    }
    if (forkVectors[1][0] !== 0.0 || forkVectors[1][1] !== 0.0) {
      forkVectors[1] = changeVectorMagnitude(forkVectors[1], forkLengthBeta);
    }

    return [addPairs(b, forkVectors[0]), addPairs(b, forkVectors[1])];
  }

  function getForkVectors(guide, angleRange) {
    return [
      getForkVector(guide, between(angleRange[0], angleRange[1]), false),
      getForkVector(guide, between(angleRange[0], angleRange[1]), true)
    ];
  }

  function getForkVector(guide, angleInDegrees, toTheLeft) {
    var angle = (angleInDegrees * Math.PI) / 180;
    if (!toTheLeft) {
      angle = -angle;
    }
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    return [
      guide[0] * cosAngle - guide[1] * sinAngle,
      guide[1] * cosAngle + guide[0] * sinAngle
    ];
  }

  function getSymmetricalForkVectors(guide, angleRange) {
    const angle = between(angleRange[0], angleRange[1]);
    return [
      getForkVector(guide, angle, false),
      getForkVector(guide, angle, true)
    ];
  }

  function between(a, b) {
    var range = b - a;
    var sign = range >= 0 ? 1 : -1;
    var precisionFactor = 1;
    if (numberOfDecimalsToConsider) {
      precisionFactor = Math.pow(10, numberOfDecimalsToConsider);
    }
    var extent =
      sign *
      (probable.roll(Math.abs(range * precisionFactor)) / precisionFactor);
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
  return multiplyPairBySingleValue(v, newMagnitude / currentMagnitude);
}

module.exports = ForkBone;
