---
title: dojo/parser
date: 2012-05-25
summary: >
  Ok, what is becoming a bit of a trend, I am adding a third to my series on
  forthcoming features in Dojo core in 1.8.
tags:
  - dojo
author: kitsonk
---

Ok, what is becoming a bit of a trend, I am adding a third to my series on
forthcoming features in Dojo core in 1.8. I have already covered
[dojo/promise](./dojo-promise) and [dojo/request](./dojo-request), now I am
going to cover changes to
[dojo/parser](https://dojotoolkit.org/reference-guide/1.8/dojo/parser.html).
This is something I am quite passionate about, since I had my hand directly
involved in the features that were added, with lots of help from Bill Keese and
Ben Hockey (and others).

With the full conversion to AMD in 1.7, there were likely a few features that
made the declarative syntax a bit more challenging to use, versus the
programmatic syntax. While the programmatic approach to Dojo is usually a better
way of creating applications, the declarative way is very popular with
developers, great for prototyping and a quick way to get started with Dojo,
especially when using the Dijit package of widgets.

For those not familiar with programmatic, versus declarative syntax, here is a
quick example of creating a Dijit button and making it log something to the
console when clicked. First here is how we would do it programatically:

```js
require(["dijit/form/Button"], function (Button) {
  var button = new Button({
    label: "Click Me!",
  }, "buttonNode");

  button.on("click", function () {
    console.log("I was clicked!");
  });
});
```

Now the same HTML snippet done declaratively:

```html
<button type="button" id="buttonNode" data-dojo-type="dijit.form.Button">
  <span>Click Me!</span>
  <script type="dojo/on" data-dojo-event="click">
    console.log("I was clicked!");
  </script>
</button>
```

The declarative syntax is then converted by the dojo/parser into instantiated
widgets, essentially converting your decorated HTML code into programmatic code.
It does the heavy lifting for you, so you don’t have to keep managing the nodes
in your document for all your widgets.

Now for the improvements in 1.8. The first was that you could only specify the
class in declarative syntax using a global class name (the old way, dot
notation, e.g. `dijit.form.Button`). With AMD and the deprecation of Dojo
declaring classes in the global namespace, this was starting to become a
problem. So now the dojo/parser accepts the Module ID (MID) as the type (e.g.
`dijit/form/Button`). In fact this is now the preferred way of referring to a
object type in declarative markup. For example, our button from above should be:

```html
<button type="button" id="buttonNode" data-dojo-type="dijit/form/Button">
  <span>Click Me!</span>
  <script type="dojo/on" data-dojo-event="click">
    console.log("I was clicked!");
  </script>
</button>
```

The second added feature is to bring the declarative scripting fully capable
with the introduction of `dojo/aspect` as the preferred way of modifying the
behaviour of an instance in Dojo. `dojo/aspect` supports the semantic concepts
of before, around and after which are part of Aspect Oriented Programming (AOP).
Now the declarative scripting supports those as well, so you can do the
following:

```html
<div data-dojo-type="...">
  <script
    type="dojo/aspect"
    data-dojo-advice="after"
    data-dojo-method="method1"
    data-dojo-args="e"
  >
    console.log("I ran after!");
  </script>
  <script
    type="dojo/aspect"
    data-dojo-advice="around"
    data-dojo-method="method2"
    data-dojo-args="origFn"
  >
    return function () { // Have to act as a function factory
      console.log("I ran before!");
      origFn.call(this); // You have to call the original function
      console.log("I ran after!");
    };
  </script>
  <script
    type="dojo/aspect"
    data-dojo-advice="before"
    data-dojo-method="method3"
    data-dojo-args="i"
  >
    console.log("I ran before!");
    i++; // Modifying argument
    return [i]; // Returning modified arguments to be used with original function
  </script>
</div>
```

Now for the “cool” feature, but which could easily cause quite unintended
consequences, is something called auto-require. This caused a lot of debate
within the Dojo developer community, mostly because you don’t have to be
explicit about your requirements with your declarative scripting. Basically if
the `dojo/parser` encounters a MID that isn’t loaded, it will attempt to load it
for you. It makes things easier, but it can mask problems and may cause a lot of
negative impact on performance when using built layers that may not contain all
the right modules. At the end of the day though we thought it was useful enough
to be included. Without it, you would have had to require all your modules used
in your declarative markup before invoking the parser, which would have looked
something like this for our button:

```js
require(
  ["dojo/ready", "dojo/parser", "dijit/form/Button"],
  function (ready, parser) {
    ready(function () {
      parser.parse();
    });
  },
);
```

> :information_source: It is still better, since 1.7 to manually invoke the
> `parser.parse()` instead of using parseOnLoad in dojoConfig.

Another new feature which fits well in the world of AMD is a declarative
require. This allows you to require in modules without having to do it within a
JavaScript code block in your code. What it essentially does, is allow you to
load modules and map them into the global namespace. A declarative require is a
`<script>` block that contains a JavaScript object that defines the mapping of
the modules and would look like this:

```html
<script type="dojo/require">
  "app.on": "dojo/on",
  myModule: "package/myModule"
</script>
```

Because of the auto-require and declarative require use Dojo’s loader (via
`require()`) and `require()` operates in an async fashion, it has meant that
dojo/parser now operates in a async fashion. Historically the `.parse()`
function returned an array of instantiated widgets. For backwards compatibility
reasons `.parse()` still returns an array, but it also behaves like a promise
too. When the parser does not need to use auto-require or declarative require or
Dojo loader is running in sync mode, this array will be populated with the
instantiated objects. When it is running in an async fashion, the array will be
empty but the promise will be resolved with an array of objects.

For new development it is best to ensure you treat `parser.parse()` as if it is
always running in an async fashion. So if you need access to the instantiated
objects or if you need to do something once the `.parse()` is finished, you
should do something like this:

```js
require(["dojo/parser", "dojo/ready"], function (parser, ready) {
  ready(function () {
    parser.parse().then(function (instances) {
      // do something
    });
  });
});
```

One piece that I am still working as I write this is to get the Dojo builder to
be able to analyse your HTML resources for a build, understand the dependencies
in the marked up code and allow you to build that into your built Dojo or a
layer. Hopefully this will help people avoid some of the issues that could occur
if they just used features like auto-require without thinking about the
consequences.

There is a lot of “good” stuff in the `dojo/parser` in 1.8 that makes it more
“modern” like other parts of Dojo. Hopefully for those who use it, these
features will help you take advantage of a modern Dojo and feel “left behind”.
