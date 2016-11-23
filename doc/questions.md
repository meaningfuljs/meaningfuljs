<link rel="stylesheet" href="meaningful.css"/>Questions
=========

Any question is comparing of complexes of object-actions and relations with or without unknown. Further meaningful.js [syntax](syntax.md) is used, you can also check [simplified natural language questions](nl-questions.md) and [unit tests for questions](../spec/meaning-querying-spec.js).

Structural questions
--------------------

Imagine we have following information:

> <pre>
> The Sun <span class="rel">{is instance of}</span> star
> Sirius <span class="rel">{is instance of}</span> star
> star <span class="rel">{is}</span> celestial body
> </pre>

Let us start from the question without unknown (which corresponds to `Is the sun instance of star?`) and which has `true` answer by comparison of structure of the knowledge base and the question:

> <pre>
> The Sun <span class="rel">{is instance of}</span> star
> </pre>

Simple question with unknown (corresponds to `What is star?`) can be answered by finding all specific `is` relations which matches undefined `is` relation of the question and produces `The Sun, Sirius, celestial body` answer.

> <pre>
> What<span class="rel">{_} {is}</span> star
> </pre>

And the question with specific `is instance of` relation produces `The Sun, Sirus` answer:

> <pre>
> What<span class="rel">{_} {is instance of}</span> star
> </pre>



Who
---

`Who` question differs from regular structural question only by "person" target:

> <pre>
> humans<span class="rel">{@person} {does}</span> live <span class="rel">{has property #1 #2}</span> on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1 @space}</span> for <span class="rel">{#2/}</span>thousand years<span class="rel">{/#2 @time period}</span>
> </pre>

`Who lives on Earth?` question compares structures of both complexes and finds relation of "person" kind and produces `humans` result:

> <pre>
> who<span class="rel">{_ @person} {does}</span> live <span class="rel">{has property #1}</span> on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1}</span>
> </pre>

What does
---------

`What does` question is marked as "action" kind and looks for relations linked with "does" or "is done". Applied to `Humans live on Earth for thousand years` it produces `live` answer.

> <pre>
> what do<span class="rel">{_ @action} {has property #1 done by #2} {#2/}</span>humans<span class="rel">{/#2}</span> do on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1}</span>
> </pre>

Where
-----

`Where` question is marked up with "space" modifier and looks for the corresponding element in given data:

> <pre>
> humans<span class="rel">{@person} {does}</span> live <span class="rel">{has property #1 #2}</span> on <span class="rel">{/}</span>Earth<span class="rel">{/#1 @space}</span> for <span class="rel">{/}</span>thousand years<span class="rel">{/#2 @time period}</span>
> </pre>

The question produces `Earth` answer:

> <pre>
> where<span class="rel">{_ @space}</span> humans <span class="rel">{does}</span> live
> </pre>

When
----

`When` question depends on "time" modifier in data:

> <pre>
> Uranus <span class="rel">{is done}</span> discovered <span class="rel">{has property #2}</span> in <span class="rel">{/}</span>1781<span class="rel">{/#2 @time}</span>
> </pre>

And produces `1781` answer:

> <pre>
> when<span class="rel">{_ @time}</span> Uranus <span class="rel">{is done}</span> discovered
> </pre>

How long
--------

`How long` is kind of "time period" which should be present in given data:

> <pre>
> humans<span class="rel">{@person} {does}</span> live <span class="rel">{has property #1 #2}</span> on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1 @space}</span> for <span class="rel">{#2/}</span>thousand years<span class="rel">{/#2 @time period}</span>
> </pre>

Of course, when "time period" is marked up explicitly there is no big problem to compare complexes of data and question to produce `thousand years` answer. In future, such markup can be done automatically.

> <pre>
> how long<span class="rel">{_ @time period}</span> humans <span class="rel">{does}</span> live <span class="rel">{has property #1}</span> on <span class="rel">{#1/}</span>Earth<span class="rel">{/#1}</span>
> </pre>

How
---

`How` is cause-effect question in this sample (`how` question may also relate to "manner" kind of questions). Imagine OS_like_OS installation is described with 4 items, which indicate "cause" of OS_like_OS install.

> <pre>
> install <span class="rel">{does what}</span> OS_like_OS <span class="rel">{caused by}</span> Download the bootable image from our site
> install <span class="rel">{does what}</span> OS_like_OS <span class="rel">{caused by}</span> Write it to a USB drive or an optical disk
> install <span class="rel">{does what}</span> OS_like_OS <span class="rel">{caused by}</span> Boot your computer with it
> install <span class="rel">{does what}</span> OS_like_OS <span class="rel">{caused by}</span> Follow instructions on the screen
> </pre>

Therefore `how` question (`How to install OS_like_OS?`) can check if there are already defined causes of that and produce all 4 items defined above.

> <pre>
> How<span class="rel">{_ @cause}</span> to <span class="rel">{#1}</span>install<span class="rel">{/#1 does what}</span> OS_like_OS
> </pre>

Why
---

`Why` question applying to cause-effect produces `OS_like_OS install` answer because it is indicated as the cause of `Download the bootable image from our site`.

> <pre>
> Why<span class="rel">{_ @effect}</span> Download the bootable image from our site
> </pre>

Can
---

Imagine we have a list of OS_like_OS requirements:

> <pre>
> OS_like_OS <span class="rel">{is done}</span> run <span class="rel">{has property}</span> on <span class="rel">{/}</span>computer <span class="rel">{/#c has #1}</span> with
> 	<span class="indent"><span class="rel">{/}</span>1 <span class="rel">{#2} {@math greater than} {@math units of}</span> GHz<span class="rel">{#3}</span> or faster <span class="rel">{/}</span></span>
> 	<span class="indent">processor<span class="rel">{/#1} {has property frequency} {has condition #2}</span></span>
> OS_like_OS <span class="rel">{is done}</span> run <span class="rel">{has property}</span> on <span class="rel">{/}</span>computer <span class="rel">{/#c has #1}</span> with
> 	<span class="indent"><span class="rel">{/}</span>4 <span class="rel">{#2} {@math greater than} {@math units of}</span> GB <span class="rel">{#1/}</span></span>
> 	<span class="indent">RAM <span class="rel">{/#1} {has property volume} {has condition #2}</span></span>
> OS_like_OS <span class="rel">{is done}</span> run <span class="rel">{has property}</span> on <span class="rel">{/}</span>computer <span class="rel">{/#c has #1}</span> with
> 	<span class="indent"><span class="rel">{/}</span>200 <span class="rel">{#2} {@math greater than} {@math units of}</span> MB <span class="rel">{/}</span></span>
> 	<span class="indent">hard disk<span class="rel">{/#1} {has property}</span> space <span class="rel">{has condition #2}</span></span>
> </pre>

And a specification for your computer:

> <pre>
> my computer <span class="rel">{is}</span> computer
> my computer <span class="rel">{has #1}</span> 2 <span class="rel">{#2} {@math units of}</span> GHz <span class="rel">{/}</span>processor<span class="rel">{/#1} {has property frequency} {has value#2}</span>
> my computer <span class="rel">{has #1}</span> 8 <span class="rel">{#2} {@math units of}</span> GB <span class="rel">{/}</span>RAM<span class="rel">{/#1} {has property volume} {has value#2}</span>
> my computer <span class="rel">{has #1}</span> 500 <span class="rel">{#2} {@math units of}</span> GB <span class="rel">{/}</span>hard disk<span class="rel">{/#1} {has property space} {has value#2}</span>
> </pre>

Querying of `can` answer (marked with "able" modifier) is testing of `OS_like_OS run` conditions against a specification of some computer. Please note, `my computer is computer` above is important too for understanding if we can comprae `computer` and `my computer`.

> <pre>
> Can<span class="rel">{_ @able}</span> I <span class="rel">{/}</span>run<span class="rel">{/#1 does what #2 has property #3} {/}</span>OS_like_OS<span class="rel">{/#2}</span> on <span class="rel">{/}</span>my computer<span class="rel">{/#3}</span>
> </pre>