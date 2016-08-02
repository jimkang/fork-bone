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
        [30, 50],
        [0, 20]
      ],
      lengthRange: [20, 48]
    }));

Output:

    [
      [20, 20],
      [20, 20]
    ]

A graph of the bend with the resulting widen points:

![Example graph](https://raw.githubusercontent.com/jimkang/fork-bone/gh-pages/meta/example-case.png)

Tests
-----

Run tests with `make test`.

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
