<link rel="stylesheet" href="meaningful.css"/>Simplified natural language questions
=====================================

Some [questions](questions.md) (without too complex subordinate phrases, etc) is possible to simplify with natural language.

> <pre>
> What<span class="rel">{_} {is}</span> star
> </pre>

Can be simplified just because `what` is a question word about unknown and `is` can be wrapped with markup.

> <pre>
> What is star
> </pre>

But not all questions can be simplified this way:

> <pre>
> who<span class="rel">[_ @person] [does]</span> live <span class="rel">[has property #1]</span> on <span class="rel">[#1/]</span>Earth<span class="rel">[/#1]</span>
> what do<span class="rel">[_ @action] [has property #1 done by #2] [#2/]</span>humans<span class="rel">[/#2]</span> do on <span class="rel">[#1/]</span>Earth<span class="rel">[/#1]</span>
> where<span class="rel">[_ @space]</span> humans <span class="rel">[does]</span> live
> when<span class="rel">[_ @time]</span> Uranus <span class="rel">[is done]</span> discovered
> how long<span class="rel">[_ @time period]</span> humans <span class="rel">[does]</span> live <span class="rel">[has property #1]</span> on <span class="rel">[#1/]</span>Earth<span class="rel">[/#1]</span>
> </pre>

In these cases additional markup required for nouns, verbs, passive verbs, subjects, etc:

> <pre>
> who live<span class="rel">[v]</span> on Earth<span class="rel">[s]</span>
> what do humans<span class="rel">[n]</span> do on Earth<span class="rel">[s]</span>
> where humans<span class="rel">[n]</span> live<span class="rel">[v]</span>
> when Uranus<span class="rel">[n]</span> discovered<span class="rel">[vp]</span>
> how long humans<span class="rel">[n]</span> live<span class="rel">[v]</span> on Earth<span class="rel">[s]</span>
> </pre>

Of course, this markup can be done by automatic natural language processing but we do not consider it for a while as we consider mostly human guided processing.