---
title: Dojo and Node
date: 2012-12-01
summary: >
  Using client side JavaScript frameworks on server side NodeJS? “Crazy…” I can
  hear you mumble to yourself.  Well, I tend to disagree.
tags:
  - dojo
  - node.js
author: kitsonk
---

Using client side JavaScript frameworks on server side NodeJS? “Crazy…” I can hear you mumble to yourself. Well, I tend
to disagree.

The biggest advantage, is that you have already merged your language both client and server, so why not merge your
coding style? Having less of the basics to remember is always a good thing. It lets you focus on being more productive.
I have been working on a project for a while, and one of my personal requirements was to make it as Dojo like as
possible. Mainly as an experiment, but also to learn how “challenging” it would be. In this post, I want to share with
you some of the lessons I have learned.

My opinion, as well as others, is that CommonJS and Node abandoned AMD because “we don’t care about browser user agents”
and while that sort of posturing is maybe self-gratifying, it leaves those who don’t have the luxury of just coding for
the backend frustrated and confused. Some may consider it a religious argument, but there is little overhead and nothing
“bad” about AMD running server side. Certainly there are some aspects of AMD that aren’t needed under server side
JavaScript, but the only real “issue” is that generally you are a little more structured with your modules (woah,
organisation and structure, I know, we can’t really have that going on).

## Bootstrapping

The first thing you would need to do is bootstrap an AMD module loader. There is some good information on using
[RequireJS under Node](https://requirejs.org/docs/node.html) (including information on how to define AMD modules to work
without an AMD loader under Node), but the Dojo Loader is my loader of choice. So a basic sort of bootstrap would look
like this:

```js
dojoConfig = {
  baseUrl: "src/",
  async: 1,
  hasCache: {
    "host-node": 1,
    "dom": 0,
  },

  packages: [{
    name: "dojo",
    location: "dojo",
  }, {
    name: "app",
    location: "app",
  }],
};

require("./src/dojo/dojo.js");
```

This of course assumes that your Dojo installation is located in the `./src` directory along with your custom modules
located in `./src/app`. This of course will only load the Dojo Loader and nothing else, which would be a very boring
application. What I usually do is specify a root module, which then does whatever is needed by my application. For
example:

```js
var loadModule = "app/main";

dojoConfig = {
  baseUrl: "src/",
  async: 1,
  hasCache: {
    "host-node": 1,
    "dom": 0,
  },

  packages: [{
    name: "dojo",
    location: "dojo",
  }, {
    name: "app",
    location: "app",
  }],

  deps: [loadModule],
};

require("./src/dojo/dojo.js");
```

And now we just need an AMD module to load. Your main module could either be an AMD `require()` or AMD `define()`. I
won’t go into the subtleties of these two, but usually your main “block” of code should be a `require()`, but you should
note that relative MIDs don’t work with the standard `require()`, but need the context sensitive `require()`.

```js
require([], function () {
  console.log("Hello world!");
});
```

I usually name my “bootstrap” code `server.js` and place it in the root of my project. Then all you need to do from the
command prompt is:

```shell
$ node server
Hello world!
```

## Loading AMD Modules

Well, this is simple. Assuming your package map in your config was accurate, you just load modules to your hearts
content. So maybe we want to create a module that creates a “deferred/promise” based timeout named `wait.js`:

```js
define([
  "dojo/Deferred",
], function (Deferred) {
  var wait = function (milliseconds) {
    var timeout;
    var dfd = new Deferred(function (reason) {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
    timeout = setTimeout(function () {
      dfd.resolve();
    }, milliseconds);
    return dfd.promise;
  };

  return wait;
});
```

And then to use the module, we update our `main.js`:

```js
require([
  "app/wait",
], function (wait) {
  console.log("Hello world!");

  wait(1000).then(function () {
    console.log("I waited 1 second...");
  });
});
```

## Loading Node Modules

You might be saying “oh, this is great, but I have this Node module I want to use, and you replaced my `require()` with
this AMD stuff.” The good thing is that with Dojo 1.8, a new plugin module was included named `dojo/node`. This module
will allow you load a regular Node module. For example, if we wanted to load a file:

```js
require([
  "dojo/node!fs",
], function (fs) {
  console.log(fs.readFileSync("example.json", "utf8"));
});
```

`dojo/node` resolves modules in exactly the same way the Node native `require()` does, which is relative to where you
loaded the the Dojo Loader. So that means it will look in `./node_modules` for local modules if bootstrapped the loader
from the `./server.js`.

## The Dojo Way

Now that you are loading Dojo and other AMD modules, you might be feeling a bit more comfortable. One of great things
about Node is that it is non-blocking and most of the APIs are designed to run asynchronously, which in a lot of ways is
the Dojo way. The thing that will smack you in the face though is the propensity for Node like APIs to use callbacks
instead of a promise based architecture to provide this asynchronous type of programming. I personally just even hate
the way the code works, calling a callback calling with an err argument as the first argument and then any result
arguments after that.

When I started doing a lot with Node, I first just tried to adopt the style, but really started getting frustrated,
especially when having long chains of asynchronous functionality and I quickly longed for the day of Dojo Deferreds, so
I started writing functions to provide the promise interface.

Doing so is relatively straight forward, let’s for example, create a module that provides the Node fs.readFile as a
promise based call. To start off, a Node style code block would look like:

```js
var fs = require("fs");

fs.readFile("example.json", "utf8", function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

Now let’s create an AMD module, based on Dojo Deferred, that provides this API:

```js
define([
  "dojo/node!fs",
  "dojo/Deferred",
], function (fs, Deferred) {
  return {
    readFile: function () {
      var dfd = new Deferred(),
        args = Array.prototype.slice.call(arguments);
      args.push(function (err, data) {
        if (err) {
          dfd.reject(err);
        } else {
          dfd.resolve(data);
        }
      });
      fs.readFile.apply(this, args);
      return d.promise;
    },
  };
});
```

Then we need to use our new module:

```js
require([
  "app/fs",
], function (fs) {
  fs.readFile("example.json", "utf8").then(function (data) {
    console.log(data);
  }, function (err) {
    throw err;
  });
});
```

Now that feels significantly more “Dojo like”. Of course you could spend all day wrapping functions, which is why I
created [setten](https://github.com/kitsonk/setten). While it is still early days (and in writing this article I have
realised some benefits I could provide) it is available to make your Node code more “Dojo like”. I know there are other
libraries out there that deliver a promise based system for Node, but I am not aware of any that are based off of the
Dojo Promise API.

## Other Thoughts

I will admit I am still learning every day on how to get Dojo and Node working well together, but I am pretty happy with
the results. I am also finding that a fair few of the libraries out there provide CommonJS and AMD module support and
those are even easier to integrate. What is great about libraries that support AMD is that you have even more seamless
experience between the server and the browser user agent.

One of the early mistakes I did was trying to keep my server-side modules as a “sub-package” of my main package where I
would keep shared or client only modules. The problem becomes when you go to build your client code for deployment,
having all your server code mixed in isn’t so good. So I usually end up with three AMD packages in my `./src` directory,
which would be something like:

- `./src/app-server` – Server Only Modules
- `./src/app-client` – Client Only Modules
- `./src/app` – Shared Modules

Another thing, which I mentioned briefly above, is that your working directory for all of your code is the path where
you invoked the node binary. So, if you are dealing with paths for files, even in modules buried in packages somewhere,
remember what your working directory is. Relative `define()` paths work as the Dojo Loader figures out the absolute path
based on the configuration.

I have four main projects that are build around Dojo on Node. They are in various states of development and were done at
various times of my “learning” of how best to do Dojo on Node, but they maybe able to give you some ideas:

- [dote](https://github.com/kitsonk/dote) – A open collaboration forum
- [dojoment](https://github.com/kitsonk/dojoment) – A markdown based documentation wiki
- [doscuss](https://github.com/kitsonk/doscuss) – A community discussion/support forum
- kitsonkelly.com – My personal website

## Future

One of the things I want to play with at some point in the future is using Dojo DOM modules against the
[jsdom](https://github.com/tmpvar/jsdom) package. James Thomas has done a
[server_side_dijit](https://github.com/jthomas/server_side_dijit) project, so it does work, but I haven’t tried myself
yet.

I have yet to find any significant disadvantages or limitations with using Dojo server side, and like I said at the
start, it is a lot easier to have to deal with just one style of coding and since Node style of coding doesn’t work
client side, why not do Dojo-style coding server side?
