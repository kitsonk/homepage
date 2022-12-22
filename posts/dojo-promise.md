---
title: dojo/promise
date: 2012-05-23 00:00:00
summary: >
  It seems that my dojo/request article got a few views, so I figured I would
  take a moment to talk about dojo/promise, another major enhancement in the
  core of the Dojo Toolkit in 1.8. Mark Wubben rewrote the promise API while
  keeping it compatible with the “modern” Dojo promise API.
tags:
  - dojo
author: kitsonk
---

It seems that my [dojo/request](./dojo-request) article got a few views, so I
figured I would take a moment to talk about
[dojo/promise](https://dojotoolkit.org/reference-guide/1.8/dojo/promise.html),
another major enhancement in the core of the
[Dojo Toolkit](https://dojotoolkit.org) in 1.8.
[Mark Wubben](https://novemberborn.net/) rewrote the promise API while keeping
it compatible with the “modern” Dojo promise API.

Just a reminder, the “modern” promise API arrived in Dojo 1.5, where “callback
chaining” and the promise was introduced. Prior to that you had to use
addCallback and addErrback when dealing with a Deferred object. As of 1.5, the
API changed so you could do something like this:

```js
var d = new Deferred();

d.then(function (results) {
  // Do something when the Deferred resolves
});
```

None of that changes for 1.8, but the underpinnings have totally changed and
there is a more robust API for managing promises and futures. In 1.8, the new
abstract class of `dojo/promise/Promise` is introduced. This provides the core
API of Promises in Dojo and is what `dojo/Deferred` now implements. Plus there
are a couple of new syntactically named methods:

```js
var d = new Deferred();

d.then(function (value) {
  // Do something when the promise completes
}, function (err) {
  // Do something when the promise errors
}, function (update) {
  // Do something when the promise provides progress
});

d.fail(function (err) {
  // Do something only when the promise fails
});

d.both(function (value) {
  // Do the same thing in case of success or failure
});
```

Dealing with multiple promises (like for example, making several requests to
several services) and then doing something when one or all of them were resolved
was dealt with `dojo/DeferredList`. While that is still there (and still works),
`dojo/promise` has introduced two new syntactically named modules
`dojo/promise/all` and `dojo/promise/first`, which will roll up a bunch of
promises and return you a new promise that could work something like this:

```js
require(["dojo/Deferred", "dojo/promise/all", "dojo/promise/first"]),
function(Deferred, all, first){
  var d1 = new Deferred();
  var d2 = new Deferred();
 
  all([d1, d2]).then(function(results){
    // Do something when both Deferreds are resolved
  });
 
  first([d1, d2]).then(function(results){
    // Do something when either of the Deferreds are resolved
  });
});
```

The last significant “new thing” in my opinion is that there is the
`dojo/promise/tracer`. What this does is essentially allow you to centrally
manage the events of Promises. What you do is load the module and then on any of
your Promises/Deferred, turn on trace by calling the `.trace()` (or
`.traceRejected()`):

```js
require(["dojo/promise/tracer", "dojo/Deferred"], function(tracer)){
  // Create a deferred
  var deferred = new Deferred();
  // Enable tracing
  deferred.promise.trace();
 
  // Setup event handlers
  tracer.on("resolved", function(args){
    // Handle a resolved event
  });
  tracer.on("rejected", function(args){
    // Handle a rejected event
  });
  tracer.on("progress", function(args){
    // Handle a progress event
  });
});
```

So like `dojo/request`, I think there are some really “cool” things coming in
1.8 in the “core” of Dojo.
