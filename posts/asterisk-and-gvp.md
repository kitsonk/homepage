---
title: asterisk and gvp.
date: 2006-03-01 13:34:00
summary: >
  I recently heard from my friends at GDS Partners that are working in the
  Asterisk and Genesys space. I also have noticed a few hits on my web page
  about GVP and Asterisk. It inspired me to keep up with my Asterisk
  experiences.
tags:
  - asterisk
author: kitsonk
---

I recently heard from my friends at
[GDS Partners](https://web.archive.org/web/20060522185609/http://www.gdspartners.com/) that are working in the Asterisk
and Genesys space. I also have noticed a few hits on my web page about GVP and Asterisk. It inspired me to keep up with
my Asterisk experiences.

Recently I was able to setup GVP EE IP 7.0.1 in a testing environment for my current employers internal lab. In order to
maximize the use of hardware and be able to keep an environment that was “manageable” we decided to use VMWare to manage
everything. So I was able to have a GVP IP VCS loaded at home, along with some Nuance OSR and TTS ports available and an
Audium application sever.

The thing I realized was that I didn’t have an effective way to call into the test environment, until I realized I was
sitting on full featured PBX. So I went in, edited a couple of my Asterisk config files and had added a “trunk access”
code so that whatever I dialed after “4” on my Asterisk was passed to GVP as DNIS allowing me to trigger and test
multiple VXML applications.

The only technical glitch was that it appears that GVP doesn’t support SIP reinvite. So for a long time my calls were
getting dropped as my Cisco phone was trying to be reinvited to connect directly to the GVP and get Asterisk out of the
way.

So if you need a Open Source PBX but a very robust and feature rich self service solution, I would not at all be shy
with looking at combining Genesys GVP and Asterisk together.

I still need to get my hands on the Genesys SIP TServer and see what can be done to fully provide CTI and routing via
Genesys to the Asterisk platform.
