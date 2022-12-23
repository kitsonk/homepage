---
title: ES5 Accessor Properties
date: 2013-02-03
summary: >
  I have been messing around this weekend with Object.defineProperty and
  realising some unanticipated behaviour when using accessor properties and
  prototype inheritance.
topic:
  - javascript
author: kitsonk
---

I have been messing around this weekend with `Object.defineProperty` and
realising some unanticipated behaviour when using accessor properties and
prototype inheritance. Essentially it boils down to this, accessor properties
are only ever owned by the Object they are defined on.

For example, if I were to do the following:

```js
var proto = {},
  fooValue;
Object.defineProperty(proto, "foo", {
  get: function () {
    return fooValue;
  },
  set: function (value) {
    fooValue = value;
  },
  enumerable: true,
});

var obj = Object.create(proto);

obj.foo = "bar";

proto.hasOwnProperty("foo"); // returns true
obj.hasOwnProperty("foo"); // returns false
```

Now I hadn’t actually expected that. So you have a choice, in your constructor
function, you can iterate through your prototype, looking for accessor
properties and copy the property descriptor directly on the instance, or you can
leave well enough alone.
