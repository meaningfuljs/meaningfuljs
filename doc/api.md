API
===

* `meaningful.build(string, opts)`

   builds meaningful markup into internal repository and index ([unit tests for building](../spec/meaning-building-spec.js) and [unit tests for relations](../spec/meaning-relations-spec.js))

* `meaningful.query(string, opts)`

   queries internal repository and index to answer [questions](questions.md) ([unit tests for querying](../spec/meaning-querying-spec.js))

* `meaningful.ask(string, opts)`

   allows to execute [simplified natural language queries](nl-questions.md) ([unit tests for querying](../spec/meaning-querying-spec.js))

* `meaningful.execute(string, opts)`

   [executes](execution.md) meaningful markup ([unit tests for executing](../spec/meaning-executing-spec.js))

* `meaningful.reset()`

   resets internal structures

* `meaningful.config(opts)`

   adds configuration options into global config

UI API
======

Read about [meaning applying to HTML](html-applying.md) before using UI API.

* `meaningful.uiInit()`

   call of `uiInit` required when DOM tree is ready to find all meaningful tags and build them

* `meaningful.uiBuild(jQuery, opts)`

   call of `uiBuild` required for [UI unit tests](../spec/meaning-ui-spec.js)