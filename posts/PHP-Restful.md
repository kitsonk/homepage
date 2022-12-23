---
title: PHP Restful
date: 2011-05-21
summary: >
  I have been working with the dojo Toolkit for a couple of years and one of the
  things that I had to do was implement a RESTful class handler in PHP to
  support the ability to implement RESTful services.
topic:
  - dojo
  - php
author: kitsonk
---

I have been working with the [dojo Toolkit](https://dojotoolkit.org/) for a
couple of years and one of the things that I had to do was implement a RESTful
class handler in PHP to support the ability to implement RESTful services. In
particular I wanted to use the
[dojox.data.JsonRestStore](http://dojotoolkit.org/reference-guide/dojox/data/JsonRestStore.html)
which supported things like filtering, lazy loading, paging and several other
advanced features and have implemented all those in my class. It is written for
PHP 5.3 or later (since it leverages namespaces) and I am making it available
under the BSD license. I also have just recently moved it to GitHub, so you can
fork it to your hearts content.

[kitsonk/php-kpk](https://github.com/kitsonk/php-kpk)

In addition I do have a sort of example application working which combines Dojo
and my classes available at
[kitsonk/examples](https://github.com/kitsonk/examples).

(Also, you should check out the new
[dojo.store.JsonRest](http://dojotoolkit.org/reference-guide/dojo/store/JsonRest.html))
