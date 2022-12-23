---
title: Dojo 2.0
date: 2013-03-03
summary: >
  I have been working on a few things which I will be trying to campaign for as
  being part of Dojo 2.0.
tags:
  - dojo
author: kitsonk
---

I have been working on a few things which I will be trying to campaign for as
being part of Dojo 2.0. Almost everything I have been working on is included in
my [d2-proto](https://github.com/kitsonk/d2-proto) GitHub repository. I want to
cover off some off some of my thinking.

## Object Composition

declare has been the foundation of the “class” structure of Dojo. I know Eugene
has developed dcl, which is the successor to declare, but one of things that I
think declare doesn’t do is actually embrace JavaScript and its prototyping
based language with constructor functions. Instead it tries to take the path of
classical OOP inheritance.

The first challenge with this is that it leads to confusion among those
developers coming from other languages. I remember recently having a debate with
a developer trying to figure out how to create static methods in
Dojo/JavaScript.

Something that I think embraces the concepts of prototypes and constructor
functions is Kris Zyp’s [ComposeJS](https://github.com/kriszyp/compose). It
provides a way to “compose” prototypes and constructor functions. It also
leverages the concepts of Aspect Oriented Programming that have heavily
leveraged in “modern” Dojo, in particular the join point advice.

I have brought that into my
[Dojo 2.0 repository](https://github.com/kitsonk/d2-proto/blob/master/compose.js)
and have added an important key element in my mind, in embracing ES5 property
descriptors. By using the compose.property() decorator, you can generate ES5
properties in your prototypes:

```js
require(["d2-proto/compose"], function (compose) {
  var property = compose.property,
    accessor;
  var Widget = compose(function (parameters, node) {
    // some sort of constructor function
  }, {
    dataProperty: property({
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    }),
    accessorProperty: property({
      get: function () {
        return accessor;
      },
      set: function (value) {
        accessor = value;
      },
      enumerable: true,
      configurable: true,
    }),
  });

  var widget = new Widget();
});
```

In addition the accessor descriptors understand the other decorators, like the
AOP ones of `compose.before()`, `compose.around()` and `compose.after()` to be
able to provide very feature rich direct property access while not requiring
discreet property accessors like the current Dojo/Dijit `.get()` and `.set()`.

## Object Observation

In Dojo 1.5 `dojo/Stateful` was added, which was a core module that provided the
concept of discreet accessors and the ability to “watch” properties for changes.
`.watch()` was a debugging concept added to SpiderMonkey (Mozilla/Firefox) to
allow a level of debugging and never became mainstream. `dojo/Stateful` adopted
this. The concept is very useful, to know when a property changes and do
something about it. Now, ES5 properties deal with the ability to allow direct
property access, they don’t necessarily provide a easy way to actually observe
changes to your properties, for key concepts like data binding.

ES6 has the Harmony project, which part of it is specifying
[Object.observe()](https://github.com/arv/ecmascript-object-observe) which
provides in native code this feature of being able to observe changes to
objects. Of course waiting around for ES6 and `Object.observe()` is untenable
for most. So in order to solve this problem for now in Dojo 2.0, I have
developed a new foundation module named
[Observable](https://github.com/kitsonk/d2-proto/blob/master/Observable.js)
which tries to provide a very similar API to that of `Object.observe()` but only
leveraging ES5 features. It should be possible to offload this to the native API
when generally available.

## DOM Manipulation

Within the committers, there has been a fair amount of debate around the
direction of DOM manipulation in Dojo 2.0. The current thinking is to
potentially adopt JQuery 2.0 as the DOM manipulation engine of Dojo 2.0, or to
rewrite/refactor the existing DOM manipulation modules. There is also some who
think that Kris Zyp’s [put-selector](https://github.com/kriszyp/put-selector) is
worth consideration. I wanted to understand more about put-selector and so I
brought it into my repository as
[put](https://github.com/kitsonk/d2-proto/blob/master/put.js). Once I got my
hands on it, I was impressed with it. For those not familiar with it, it
leverages the concepts of CSS selectors to perform DOM manipulation. Instead of
having a complex API to create, modify, move and place DOM nodes and structure,
you simply use the one function of put. You likely have been using one form or
another of CSS selectors to select your DOM, which are the core of both JQuery
and `dojo/query`, so why not extend that paradigm to DOM creation and
manipulation?

There are those who are familiar with it who feel that its concise syntax can
easily lead to abuse and confusing code. This is potentially true, but like all
powerful tools, they can be misused. This is true of RegExp, which can easily
lead to confusing code, but they solve complex problems much quicker. My biggest
argument is that DOM selection requires a good grounding in CSS selectors, so
why not build on that knowledge? Developer’s being aware that other people may
read their code is far more important than hobbling people by dumbing down their
tools. A good developer should document their RegExp just as well as they
document their selectors.

## Declarative Syntax

As many of the Dojo committers know I am a huge supporter of having functional
parity between JavaScript and the Dojo declarative syntax. The declarative
syntax is one of the main reasons I was drawn to Dojo in the first place. While
I don’t use it personally anymore, I have quite a lot of interest in the
dojo/parser which drives the declarative syntax. Some of my first significant
contributions to Dojo are around the parser.

So of course I couldn’t pass up the opportunity to provide a new
[parser](https://github.com/kitsonk/d2-proto/blob/master/parser.js) as a
candidate for Dojo 2.0. From an API perspective is is very similar to the
current `dojo/parser` and has the same features, but it wholly drops the legacy
of the current parser. Also, it is designed to be a “speed demon”. My tests
indicate for certain tests it is about twice as fast as the current parser and
is even 20% faster than the `dojox/mobile/parser` which was specifically
designed to be efficient on mobile devices.

It still needs additional work, but my hope is that there will be only a single
parser for Dojo 2.0, once that is as lightweight and performant as possible for
mobile, provides only what is needed for complex templating and is as feature
rich for desktop applications. It might even be possible with `dojo/has` to
provide opportunities to built code that is tailored to the environment.

## Widgets

With, in my opinion, two of the core parts of the toolkit being different in
Dojo 2.0, it sort of calls for a different path with widgets. If object
composition and DOM manipulation change, there is an opportunity to take a look
further. Dijit has been a great strength of Dojo. Again, it was one of the
reasons that I was drawn to Dojo in the first place, because I wanted a
JavaScript toolkit and a widget framework as “one”. When I was looking around in
2008, there were very few that combined the two well, if at all.

But in my opinion, time has marched on. Dijit has become solid, feature
complete, but also relatively feature static, because the number of people and
organisations that have built on it. It is now almost impossible to make a
significant improvement in Dijit without causing havoc somewhere else
downstream. People need that dependability and stability though. There is a lot
of good in Dijit, a lot.

While I understood how to create my own Dijit based widgets, I will admit I
didn’t understand deeply the underpinnings of Dijit and widgets in general.
Therefore I wanted to see if I could create a widget based on compose and put. I
have created a very rough
[Widget](https://github.com/kitsonk/d2-proto/blob/master/widget/Widget.js) base
module based on this. This gave me enough to think about.

What is clear to me now is that while there needs to potentially be a Dijit 2.0
that works off Dojo Core 2.0, there needs to be another widget system as part of
the eco-system that can start afresh, being informed by Dijit but being
unleashed from the “shackles” of the Dijit 1.X legacy. I think there are some
key points that a new widget system needs to address:

- Isomorphism – The concept that the widget shouldn’t care about where it is
  rendered. As server side JavaScript continues to mature and there are
  constraints on the speed and power of mobile devices, isomorphism becomes even
  more important. One of the aspects of put is that it can render DOM strings
  without the need of the likes of esprima. It is quite conceivable isomorphism
  is achievable without too much work.
- Data Binding – Some additional solutions have been added to Dojo to solve this
  problem, like dojox/mvc, but ultimately I think that data binding is something
  that should be built into the core of a widget framework, instead of an
  adjunct. While Dijit has always been able to read from a data store to
  populate things like select lists, it hasn’t been as robust in being to update
  records and state based on binding to underlying data.
- Responsive – “Modern” widgets need to be built from their foundations to meet
  responsive design. Right now, the current solution is to touch enable Dijit
  and then develop dojox/mobile. And while there has been a lot of work between
  dojox/mobile and Dijit, they are essentially two different projects with
  dojox/mobile being built ontop of some of the foundation of Dijit. The need to
  have efficient code on the mobile platforms has led to a significant
  “fracturing” of the bases of Dijit to maintain the two different sets of
  widgets. The current framework also lacks any specific API features that allow
  developers to build responsive widgets. A new framework should build this into
  its foundations.
- Bundling of all 3 Technologies – Widgets are not just JavaScript objects with
  a DOM structure. There is a 3rd technology that is often relegated as a 2nd
  class citizen, that being CSS. Visual presentation and theming. To me, this
  has always felt slightly disconnected and there is no easy way of “bundling”
  or even “unbundling” the necessary CSS to run a widget in the current Dijit
  framework. There is no way for a widget to ensure its styling is loaded, nor a
  way to encapsulate it, so it can be composited into a “built” widget.

There maybe other key factors in widgets for Dojo 2.0, but in my mind these are
the key things at the moment we don’t have a ready answer for.

## Packaging, Wrap and Toolchain

One of the main areas that I first expressed a lot of my thinking for Dojo 2.0
was in the area of packaging, wrap and toolchain. It is the areas where my
thoughts were the most mature. As far as packaging, I laid out my thoughts as
well as took a lot of feedback from others in the
[Dojo 2.0 Packages and Distributions](https://docs.google.com/document/d/17B7A0eGbBAYsuZTQCnMnQ-xNiuB5NVc4vKYJqp3a_CE/edit?usp=sharing).
From a toolchain perspective, I laid out my thoughts about package management,
again with lots of feedback in
[Dojo Toolkit 2.0 Package Management](https://docs.google.com/document/d/17B7A0eGbBAYsuZTQCnMnQ-xNiuB5NVc4vKYJqp3a_CE/edit?usp=sharing).
There is more, but probably best left to a future post or discussion!

## In Conclusion

As always, these thoughts are my own, they don’t represent the way Dojo 2.0 will
go, but they lay out my thinking and will form the foundation of what I will
“campaign” for in Dojo 2.0. I always have always said, I would look into the
items I was interested in instead of trying to “boil the ocean”. I may pickup
more items that are of interest to me as we get further down the road to Dojo
2.0. The biggest thing I would like to do though is encourage (provoke?) others
to start making their case for Dojo 2.0.
