---
title: dojo/request
date: 2012-05-20 00:00:00
summary: >
  In the forthcoming Dojo Toolkit 1.8, the dojo/request package, written by
  Bryan Forbes, has some really “cool” features in my opinion.
tags:
  - dojo
author: kitsonk
---

In the forthcoming [Dojo Toolkit](https://dojotoolkit.org) 1.8, the
[dojo/request](https://dojotoolkit.org/reference-guide/1.8/dojo/request.html)
package, written by [Bryan Forbes](https://www.reigndropsfall.net/), has some
really “cool” features in my opinion. While the package “modernises” the Dojo
IO/Request API, it also has some features that will really help end developers.

First, it is designed to Just Work™. It works in a browser environment or a
node.js environment seamlessly. For example, if I wanted to load some JSON and
do something with it, in a browser, I would do this:

```js
require(["dojo/request"], function(request){
  request.get("some.json", {
    handleAs: "json"
  }.then(function(response){
    // response.data contains the parsed object
  });
});
```

But let’s say you were doing it on [node.js](https://nodejs.org/). What would
you need to do then? You wouldn’t do a thing. You would simply run your code
with something like this `node ./dojo/dojo.js load=example` at a command line.
dojo/request will automatically figure out what platform you are on and load the
appropriate request provider for you.

The second “cool” feature in my opinion is the ability to use the
dojo/request/registry to “transparently” manage multiple request providers
without having to worry about which one you are specifically using. Just set it
up and fire your requests away. For example, take the situation that I would
like to use JSONP some of the time and JSON the rest of the time (maybe I have a
x-domain service where I have to use JSONP instead of just plain JSON). Well, in
order to do that, I would need to use dojo/request/script to get the JSONP, but
I couldn’t use it to just fetch plain JSON and want to use dojo/request/xhr
(which is the default provider for browsers). In order to do that, I would do
something like this:

```js
require(
  ["dojo/request/registry", "dojo/request/script"],
  function (request, script) {
    // Use a RegEx so that anything that ends with *.jsonp.js uses the
    // dojo/request/script provider
    request.register(/\.jsonp\.js$/i, script);

    // Now just make my requests like normal
    request.get("http://example.com/some.jsonp.js").then(function (response) {
      // Will use the script provider
    });

    request.get("some.json").then(function (response) {
      // Will use the platform default provider (dojo/request/xhr)
    });
  },
);
```

Lastly, maybe I have some strange, bizarre encoding (or maybe I need to do some
pre-transforms on my JSON or XML to properly convert them into objects). Using
dojo/request/handlers, I can add to the pre-existing handlers with my own, and
then can use the handleAs property to to utilise my custom handler:

```js
require(
  ["dojo/request/handlers", "dojo/request"],
  function (handlers, request) {
    handlers.register("custom", function (response) {
      // Now I do my custom handling of the response
      // returning whatever response.data should be:
      return something;
    });

    // Now I can use my customer handler
    request.get("something.odd", {
      handleAs: "custom",
    }).then(function (response) {
      // Now response.data will be whatever my handler returned
    });
  },
);
```

So while, Dojo Toolkit 1.8 will be a “stepping stone” to Dojo Toolkit 2.0, there
are some really cool features that you can use now.
