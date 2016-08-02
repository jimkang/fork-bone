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
    var xCD = getXForCAndD(ab, b, extensionExtent);
    var yCD = getYForCAndD(ab, b, extensionExtent);
    var c = [xCD[0], yCD[0]];
    var d = [xCD[1], yCD[1]];
    return [c, d];

    function normalizePointToAB(point) {
      return point * magnitudeRatioABToBC;
    }
  }

  function getXForCAndD(ab, b, extensionExtent) {
    var cExtension = probable.roll(extensionExtent);
    var dExtension = probable.roll(extensionExtent);
    var cx = 0;
    var dx = 0;

    if (ab[0] < 0) {
      cx = b[0] - cExtension;
      dx = b[0] + dExtension;
    }
    else {
      cx = b[0] + cExtension;
      dx = b[0] - dExtension;      
    }

    return [cx, dx];
  }

  function getYForCAndD(ab, b, extensionExtent) {
    var cExtension = probable.roll(extensionExtent);
    var dExtension = probable.roll(extensionExtent);
    var cy = 0;
    var dy = 0;

    if (ab[1] < 0) {
      cy = b[1] + cExtension;
      dy = b[1] - dExtension;
    }
    else {
      cy = b[1] - cExtension;
      dy = b[1] + dExtension;      
    }

    return [cy, dy];
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
