Meaningful.js
=============

**Lightweight Natural Intelligence Framework**

Meaningful.js is an experimental library which uses natural intelligence for dealing with meaning.
It introduces [simple markup](doc/syntax.md) for plain text, which allows answering to simple [questions](doc/questions.md) like `What is diameter of Jupiter?` or `Can I run OS_like_OS on my computer?`,  even in [simplified natural language](nl-questions.md) form, and solving uncomplicated [math problems](doc/execution.md) like `Mary has 5 apples, and Tom gave her 7 apples, then Mary ate 3 apples. How many apples does Mary have now?`.

Why this approach is different?
-------------------------------

1. It based on my [theory of meaning](doc/meaning.md), which is slightly different from existing ones and helps to represent meaning more adequately.
2. Markup may be applied to plain text. Therefore, potentially, its usage scope is wider than HTML or even Semantic Web one as you can apply it to any data.
3. Simple enough approach which can be used as soon as you is familiar with [syntax](doc/syntax.md) and [theory](doc/meaning.md), which are intuitive and quite straighforward.
4. It uses natural language but is not based on it as natural language model of meaning, which has certain [deficiencies](doc/meaning.md#language).

What this approach is not?
--------------------------

1. It does not relate to "semantic" tags or "semantic" elements of HTML.
2. It has no complexities of Semantic Web and no restrictions of microformats.

Explanations for [natural language and other approaches](doc/others.md).

What problems it tries to solve?
--------------------------------

* To start operating with meaning now and not waiting for too complex and/or not reliable and/or not affordable technologies. Simply put, to have manual solution for tasks which presumably will be automatically resolved in some future. But do we need to wait N more years for that?
* To use and understand meaning adequately.
* To have bridge between fully unstructured text and fully structured data.
* To allow to define meaning gradually, to simplify/complicate relations, to change level of abstraction or detailing, to omit information or add extra information if it is necessary.

When this approach can work for you?
------------------------------------

* Imagine you have data on some topic, which can be restricted with one web page (for example, data on [planets of Solar system](planets.html)).
   * Meaningful.js allows to create simple knowledge base on the base of one table and answer to simple [questions](doc/questions.md).
* A page about some application (for example, imaginary [operating system](operating-system.html))
   * Basing on this page and data about your computer you can figure out can you install OS on your computer.

More examples are in form of [unit tests](spec).
   
Where is "natural intelligence"?
--------------------------------

* It is markup which may make plain text more meaningful.

How to use it?
--------------

* Please check [use-cases](doc/use-cases.md)...
* ...[API](doc/api.md)...
* ...and [restrictions](doc/restrictions.md)

## Installation

The library can be used with node.js:

1. Install node.js
2. Run `npm install` in the current directory.
3. To run unit tests you need to install Jasmine module: `npm install -g jasmine`.

Please note, you can review package.json and do **not** install `jsdom` library ([UI unit tests](spec/meaning-ui-spec.js) uses it for testing html files but it makes the whole test suite run longer).

Also it can be added to html page with:

```html
	<script type="text/javascript" src="meaningful.js"></script>
	
	<script>
	$(document).ready(function() {
		meaningful.uiInit();
	});
	</script>
```

## Supported environments

Meaningful.js is available for Node.js as well as some browsers (Chrome, Firefox, and Internet Explorer).

## Maintainers

* Yuriy Guskov <muesli.fjagnn@alg.cimom> (key: 10-2-5-3)

Copyright (c) 2016 Yuriy Guskov. This software is licensed under the MIT License.
