<link rel="stylesheet" href="meaningful.css"/>Syntax
======

Meaningful markup applies to plain text with curly bracket elements. Markup can include references and relations.

> <pre>
> The Sun <span class="rel">{#1 has property #2}</span> has <span class="rel"> {#2/}</span> color <span class="rel">{/#2}</span>
> </pre>

Alternative syntax with square brackets:

> <pre>
> The Sun <span class="rel">[#1 has property #2]</span> has <span class="rel"> [#2/]</span> color <span class="rel">[/#2]</span>
> </pre>

* `#1` is a reference for `the Sun`
* `#2` is a reference for `color`
* They linked with `has property` relation

Identifiers
-----------

Identifiers are all words between boundaries of a sentence or punctuation or markup. Here `The Sun` and `yellow` are identifiers:

> <pre>
> The Sun <span class="rel">{is}</span> yellow
> </pre>

`is` is both a markup and an identifier.

References
----------

References start with `#` sign and can be trailing:

> <pre>
> planet <span class="rel">{#1}</span>
> </pre>

Or surrounding starting with `/` sign:

> <pre>
> <span class="rel">{/}</span> planet <span class="rel">{/#1}</span>
> </pre>

Or starting and ending with reference name:

> <pre>
> <span class="rel">{#1/}</span> planet <span class="rel">{/#1}</span>
> </pre>

Please note, sometimes reference is required just to mark up boundaries of a word or a phrase (otherwise this word will be merged with adjacent words into phrase):

> <pre>
> The Sun <span class="rel">{/}</span>atmosphere<span class="rel">{/#1}</span> has yellow color
> </pre>

Relations
---------

Relations without references link a preceding word (source) and a succeeding one (destination).

> <pre>
> The Sun <span class="rel">{has property}</span> color
> </pre>

Or it may include reference. Here `The Sun` has `#1` reference and `has property` color:

> <pre>
> The Sun <span class="rel">{#1 has property #2}</span> has <span class="rel"> {/}</span> color <span class="rel">{/#2}</span>
> </pre>

Unknown
-------

Unknown (_) modifier usually corresponds to question words:

> <pre>
> What<span class="rel">{_}</span> <span class="rel">{is}</span> star
> </pre>

Modifiers
---------

Modifiers (starts with `@`) usually express unary relation, which hints on some characteristics of object-action or relation.

> <pre>
> humans<span class="rel">{@person} {does}</span> live <span class="rel">{has property #1 #2}</span> on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1 @space}</span> for <span class="rel">{#2/}</span>thousand years<span class="rel">{/#2 @time period}</span>
> </pre>

Currently supported following modifiers: `@space`, `@time`, `@person`, `@thing`, `@action`, `@cause`, `@effect`, `@able` (some of them used only in [questions](questions.md)).

Extensions
----------

Extensions (starts with `@`) may help to interpret meaning, which is more specific (for example, which relates to math, logic, etc).

> <pre>
> OS_like_OS <span class="rel">{is done}</span> run <span class="rel">{has property}</span> on <span class="rel">{/}</span>computer <span class="rel">{/#c has #1}</span> with <br/>
> 	<span class="indent"><span class="rel">{/}</span>1 <span class="rel">{#2} {@math greater than} {@math units of}</span> GHz<span class="rel">{#3}</span> or faster <span class="rel">{/}</span></span> <br/>
> 	<span class="indent">processor<span class="rel">{/#1} {has property frequency} {has condition #2}</span></span> <br/>
> </pre>