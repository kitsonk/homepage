---
title: Criticism of Dojo?
date: 2012-08-17
summary: >
  With the release of Dojo 1.8, I thought I might share my thoughts on
  criticisms of Dojo and if I think they are valid.  So I am going to try to
  take an honest look at those criticisms and give my opinion of where the
  community is at.
tags:
  - dojo
author: kitsonk
---

With the release of [Dojo 1.8](https://dojotoolkit.org/blog/dojo-1-8-released),
I thought I might share my thoughts on criticisms of Dojo and if I think they
are valid. So I am going to try to take an honest look at those criticisms and
give my opinion of where the community is at.

## Dojo is Slow

One of the biggest criticisms levelled at Dojo. It is a largely historical one.
With Dojo 1.7 and the full introduction of
[AMD](https://dojotoolkit.org/documentation/tutorials/1.8/modules/), a lot of it
is no longer valid. The challenging thing is that Dojo does let you do “stupid
things”. Most complex software lets you do “stupid things”. Running against an
unoptimised source distribution is a bad idea. Trying to deploy a complex
application against a CDN is a bad idea. But I would not say it is fair to write
Dojo off for that.

## Dojo is Complex

Yes. There are over a 1000+ modules in a distribution. It is everything and a
kitchen sink plus a
[little more](https://dojotoolkit.org/reference-guide/1.8/dojox/index.html). Is
that complexity intimidating? It can be, but it isn’t insurmountable. It is
true, other libraries are less complex, but then you do spend your time
re-inventing the wheel or trying to find an add on library that might work and
hopefully not clash with something else. One of the big factors with the mode to
AMD though is to try to make it easier to pick and choose what you want out of
Dojo and other libraries.

## The Documentation Sucks

A hopefully historical point. While the
[documentation with 1.8](https://dojotoolkit.org/documentation/) isn’t perfect,
it is a significant step forward. Not only did we change a lot in 1.7 we also
broke a lot of the documentation, most notably the API Viewer. It is now
[working](https://dojotoolkit.org/api/). The reference guide has had over 1500
edits to improve it and there have been vast improvements to the tutorials with
even more coming. While it isn’t an excuse, in relative terms my opinion was
were really in the middle of the pack. Hopefully we have moved closer to the
top.

## Contributing is Hard

Yes, but it is easier with the eCLA available
[here](http://dojofoundation.org/about/claForm). The Dojo Toolkit and the Dojo
Foundation take their openness seriously. On a moral level, open is open and
stealing other people’s work without their permission is bad. I personally take
pride in the fact that every line of code in Dojo Toolkit has someones name
against it who has attested it is their own work. That level of commitment to
clean IP garners a significant level of respect from some large corporations who
invest their time and money into Dojo too. So contributing to Dojo has a bit of
hassle, but the benefits of being totally serious about being open and free are
worth it. On the other hand, being relatively new committer on the scene I have
found the community very welcoming and encouraging.

## ES5/HTML5/CSS3 are Good Enough

All three of these (and eventually ES6) are dramatic improvements over what was
there just a few short years ago, and some of the core capabilities of Dojo are
better served by “native” functionality. But Dojo isn’t about
[querying](https://dojotoolkit.org/reference-guide/1.8/dojo/query.html) and
[manipulating the DOM](https://dojotoolkit.org/reference-guide/1.8/dojo/dom.html)
or building a website, Dojo is about building enterprise applications. As the
underlying technologies continue to mature, Dojo will and does back away from
trying to solve those problems. But if you just go with underlying technologies,
you will quickly find your self collecting small snippets of this and that to
try to solve a problem and sooner or later you end up with a frankenstein of an
application.

## Dojo is Old

I prefer the word “mature”. It is true that in internet terms, Dojo is very old.
That doesn’t mean it has “jumped the shark” though. What I really like about 1.8
is that some of the core APIs were swapped out with wholly new implementations
(e.g.
[dojo/request](https://dojotoolkit.org/reference-guide/1.8/dojo/request.html)
and
[dojo/promise](https://dojotoolkit.org/reference-guide/1.8/dojo/promise.html)).
That is a sign of a toolkit that can adapt and change.

## Yeah, but NodeJS will Change Everything

Been [there](https://dojotoolkit.org/reference-guide/1.8/dojo/node.html), done
[that](https://github.com/kitsonk/kitsonkelly.com), got the [t-shirt](/).

## I Don’t Like AMD

I am not very fond of watermelon. In my opinion that is a slightly more logical
stance than not liking AMD. While there is “debate” about AMD and its applicably
in the server environment, I don’t know of a reasonable logical alternative.
Having a well defined, dynamically loadable, module structure is necessary. It
isn’t optional. Dojo already was well structured this way and AMD improved upon
that. If there was one benefit you can’t have because of AMD, then I might be
willing to change my mind.

## There Isn’t Enough Market Penetration

Ok. Potentially accurate. A lot of usage of Dojo isn’t on the public facing web.
Dojo is used to build a lot of enterprise applications and is incorporated in
many commercial products. Dojo market share on the public web does
[continue to grow](https://w3techs.com/technologies/details/js-dojo), albiet
slowly. But, market share doesn’t necessarily have bearing on stability,
maturity, openness, performance, or really anything that someone should consider
when selecting a toolkit. It’s market penetration doesn’t also reflect on the
capabilities of the core community and committers. Most open source projects
have a small core of people who actually are active in the project and Dojo is
far from one person maintaining a code base, which you can get is some fairly
significant projects.

## Conclusion

For me, it is always good to be “self critical” so that you can challenge
yourself to improve the things you don’t have just quite right. Dojo Toolkit,
like anything out there, doesn’t have everything write, but in my opinion it has
a lot less wrong than you might assume and it has a lot of people that care
about it that are working to make it better. I am quite excited about what will
come over the next year. I am personally confident Dojo 2.0 over the next couple
of months will start to become something tangible and exciting. Hopefully we can
build on the 8 years of lessons learned during the course of the project to
provide a toolkit that will meet the next generation of thin client
applications.
