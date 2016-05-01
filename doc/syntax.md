<link rel="stylesheet" href="meaningful.css"/>Syntax
======

Meaningful markup applies to plain text with square bracket elements. Markup can include references and relations.

<div class="meaningful">
The Sun <span class="rel">[#1 has property #2]</span> has <span class="rel"> [#2/]</span> color <span class="rel">[/#2]</span>
</div>

* `#1` is a reference for `the Sun`
* `#2` is a reference for `color`
* They linked with `has property` relation

Identifiers
-----------

Identifiers are all words between boundaries of a sentence or punctuation or markup. Here `The Sun` and `yellow` are identifiers:

<div class="meaningful">
The Sun <span class="rel">[is]</span> yellow
</div>

`is` is both a markup and an identifier.

References
----------

References start with `#` sign and can be trailing:

<div class="meaningful">
planet <span class="rel">[#1]</span>
</div>

Or surrounding starting with `/` sign:

<div class="meaningful">
<span class="rel">[/]</span> planet <span class="rel">[/#1]</span>
</div>

Or starting and ending with reference name:

<div class="meaningful">
<span class="rel">[#1/]</span> planet <span class="rel">[/#1]</span>
</div>

Please note, sometimes reference is required just to mark up boundaries of a word or a phrase (otherwise this word will be merged with adjacent words into phrase):

<div class="meaningful">
The Sun <span class="rel">[/]</span>atmosphere<span class="rel">[/#1]</span> has yellow color
</div>

Relations
---------

Relations without references link a preceding word (source) and a succeeding one (destination).

<div class="meaningful">
The Sun <span class="rel">[has property]</span> color
</div>

Or it may include reference. Here `The Sun` has `#1` reference and `has property` color:

<div class="meaningful">
The Sun <span class="rel">[#1 has property #2]</span> has <span class="rel"> [/]</span> color <span class="rel">[/#2]</span>
</div>

Unknown
-------

Unknown (_) modifier usually corresponds to question words:

<div class="meaningful">
What<span class="rel">[_]</span> <span class="rel">[is]</span> star
</div>

Modifiers
---------

Modifiers (starts with `@`) usually express unary relation, which hints on some characteristics of object-action or relation.

<div class="meaningful">
humans<span class="rel">[@person] [does]</span> live <span class="rel">[has property #1 #2]</span> on <span class="rel">[#1/]</span>Earth<span class="rel">[/#1 @space]</span> for <span class="rel">[#2/]</span>thousand years<span class="rel">[/#2 @time period]</span>
</div>

Currently supported following modifiers: `@space`, `@time`, `@person`, `@thing`, `@action`, `@cause`, `@effect`, `@able` (some of them used only in [questions](questions.md)).

Extensions
----------

Extensions (starts with `@`) may help to interpret meaning, which is more specific (for example, which relates to math, logic, etc).

<div class="meaningful">
OS_like_OS <span class="rel">[is done]</span> run <span class="rel">[has property]</span> on <span class="rel">[/]</span>computer <span class="rel">[/#c has #1]</span> with <br/>
	<span class="indent"><span class="rel">[/]</span>1 <span class="rel">[#2] [@math greater than] [@math units of]</span> GHz<span class="rel">[#3]</span> or faster <span class="rel">[/]</span></span> <br/>
	<span class="indent">processor<span class="rel">[/#1] [has property frequency] [has condition #2]</span></span> <br/>
</div>