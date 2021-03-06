fork-bone
==================

Given a "bone" line, creates two points. If a line is drawn from the end of the bone to each of the points, these two new lines will be branches that "fork" off of the bone. The points, while chosen randomly, create branches that are guaranteed to:

- Not be on the same side of the ray that would be created by extending the bone indefinitely.
- Form an acute angle with the bone ray.
- Be within the length range specified.

[Check out some examples.](http://jimkang.com/fork-bone)

Installation
------------

    npm install fork-bone

Usage
-----

    var ForkBone = require('fork-bone');

    var forkBone = ForkBone();
    
    console.log(forkBone({
      line: [
        [-50, 0],
        [-9, 0]
      ],
      lengthRange: [5, 15]
    }));

Output:

    [
      [ 2.3339615604739095, -3.9422474992952727 ],
      [ -5.620344845177656, 12.553004860768706 ]
    ]

A graph of the line with the resulting fork:

![Example graph](https://raw.githubusercontent.com/jimkang/fork-bone/gh-pages/meta/example-case.png)

Pass `symmetrical: true` if you want the forks to be symmetrical.
Pass `angleRange: [<lower bound in degrees>, <upper bound>` if you want to have a particular angle away from ray extending from the end of the bone. For example, `[30, 45]` will result in forks that are between 60 and 90 degrees apart from each other.
Pass a two-element array in `lengthRange` if you want to define the fork length range. The first element should be the bottom of the range, and the second should be the top.

When creating `ForkBone`, you can optionally pass two opts:

  - `random`: A function that behaves like `Math.random`. You can substitute one created by [seedrandom](https://github.com/davidbau/seedrandom) or something you've written yourself. Helps with situations in which you want reproducible results.
  - `numberOfDecimalsToConsider`: A positive number that tells it how precise to be when picking numbers in a range. If it encounters a range of 0.001, by default, it will always pick 0. (If the range is 100, it'll pick a whole number between 0 and 99.) If you specify 3 as `numberOfDecimalsToConsider`, it can pick numbers like 0.003 and 0.995. Useful for working for points that are really close together.

Tests
-----

Run tests with `make test`.

Run test in browser with `make test-firefox`.

Tests and tools require Node 6. Module itself should work in all versions of Node and modern browsers.

License
-------

The MIT License (MIT)

Copyright (c) 2016 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
