<link rel="stylesheet" href="meaningful.css"/>Restrictions
============

Evidently the main restriction and the main feature is meaningful.js does not use natural language processing (NLP). Human markup allows avoiding full NLP but it does not deny it. At least simple NLP could be used for (simplified natural language questions)[nl-questsions.md] as well as for finding synonyms and antomyms (or simply put "similar" and not "similar" identifiers). On the other hand, [markup](doc/syntax.md) can be cumbersome but possibly better visualization may alleviate this problem in future.

Detailed list of restrictions:

* Only some relations and some question words supported for now.
   * "Purpose" is not considered for now (but also some other notions like "want", "wish", "concession", etc). It is just a final effect of action/cause-effect sequence. Compare `Build a spaceship`, `Build a spaceship to reach stars`, and `Reach stars!`. Difference is the first one is an action with implied purpose and the last one is pure purpose without specific actions.
   * Multilanguage relations are not used but should

* Syntax is experimental, the goal was to have short enough one and which may be applicable to plain text.
   * At this moment identifier comparison is case-sensitive. That is, `Earth` does not equal to neither `The Earth` nor `the Earth` nor `earth`.
   * Ambiguous parsing is possible, for example for `desktop` and `color` in `desktop [has] color` and `/etc/ui.cfg [has] [/] desktop [is] section [/#1] [has] color`. But please note this problem is actual specifically for the current algorithm.
   * Some areas are to be resolved by natural language processing. For example, `orbit` and `orbits` are different identifiers, they have similar meaning, which differs only by a "subject" but if it is explicitly indicated then their meaning is the same.
   * Verb time tense is not implemented. It may require additionally `[did]`, `[will do]`, and other relations or possibly `[does]`/`[is done]` may be work in conjunction with time relations and define verb time automatically, especially because "future" may become "the past" one day.
   * Possibly `@` modifier is not required but it simplifies parsing of unary relations in the current algorithm.
   * `@math` may be not required if `less`, `more`, `add`, `units of` relations will be specific only for math. On the other hand, `@math` could be required if math symbols (`<`, `+`, etc) will be used and which are to be interpreted by math extensions".
   * It is not clear how better to represent `Mary has 5 apples`. Now, very short variant is used: `Mary [has] 5 apples`. But, in fact, in real markup we need to markup `has` from text with `[has]` relation and keep both. Something like this: `[/]Mary[/#1 has #2] has [/] 5 apples[/#2]`. See, what happens? We need at once to markup boundaries of identifiers and text becomes cumbersome. Possibly the solution will be `Mary [] has [] 5 apples`, where `[]` marks up identifier boundaries and if identifiers is equals to base relation then it is considered as such.
   * No support for instances which has the same name as a type like `a star`. Possibly solution could be `a [/] star [/#1 is instance of @this]`.
   * Possibly `[has id]` to be replaced with `[has property] ... [@id]`

* Algorithm is quite simple, straightforward and will work only for specific use-cases. It is written rather to show possibilities. It has to be optimized and optimized...
   * Maybe choice of the language to implement is not ideal. But JavaScript allows to demonstrate it in different browsers (which runtime environment available on almost all platforms) or in node.js environment (which is available for many platforms too).
   * Math and logics are not implemented fully as they are the most frequently used area for almost any computer language.

As you see there are a lot of restrictions and "possibly" or "maybe". The purpose of proposed syntax was to minimize markup, therefore when some constructions become too complex it is time to stop and think maybe they are can be expressed in more elegant way.