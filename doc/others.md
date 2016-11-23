<link rel="stylesheet" href="meaningful.css"/>Other approaches
================

Natural language
----------------

* It is the most used form of relations, which tries to have some correspondence with object-actions but also has anthropocentric and languagecentric constructs:
   * Nouns and pronouns roughly correspond to space itself and objects inside it. Nouns can also refer to relations and actions (like `movement`).
   * Adjectives roughly correspond to properties of objects.
   * Verbs correspond to changes of spatial, temporal, and other characteristics of objects, and to abstract relations (but the same may be expressed with nouns, gerunds, etc). For example, `send` applying to `mail` is only "verb" grammatically but actually involves relations between "sender", "recipient", "envelope", "mail service", "transportation", and even "traffic jam on the way of postal truck".
   * Modal verbs correspond to someone's relation to an action (probability, ability, obligation, advice, permission, habits, prohibition, necessity, offer, request, possibility, suggestion, etc).
   * Adverbs and adverbial clauses/phrases correspond to properties of object-actions and relations (place, time, frequency, manner, purpose, degree, certainty, viewpoint, condition, reason, concession, comparison, result).
* There are no strict boundaries between spatial, temporal, and abstract relations in natural language because:
   * Space and time (and objects with actions) are unseparable but relations flatten it even more (mainly because information about both objects and actions is stored in the same storage and in the same form). For example, "Planet moves", "Planet moving", "Planet movement" refers to more or less the same meaning (with some hues).
   * Subject-predicate-object is anthropomorphic convention of language. That is, it is fully justified when you say, `I see the Sun` (in this case you are talking from yourself). But `Venus` in `Venus orbits Sun` is a purely grammatical subject, `The Sun is orbited by Venus` has similar meaning with different accentuation.
* The main question then: "Can we use natural language as meaning model?"
   * Yes, we should as it is the most convenient form.
   * No, because natural language forces meaning to obey own conventions, thus, slightly distort it.
   * No, because parts of speech and structure of sentence can be ambiguous.
   * No, because natural language does not include all required elements of meaning.
   * The middle way: we need to use meaning always remembering which constructs have natural language specifics and which have not.

Other existing approaches
-------------------------

Some of semantic approaches based on natural language up to imitating language structure. But a natural language is only one of multiple models of reality. Thus, to represent meaning adequately we need to base it on reality itself not on model, which imitates it. That is, good meaning model should be subordinated with structure of reality and coordinated with other models (with natural language, in particular). This implies even if we use structures similar to natural language we should understand what is behind them. For example, notorious "subject-predicate-object" (or "subject-verb-object" or SVO) is used in our approach to be compatible with natural language as usually information itself and questions are conformed with natural language structure. But SVO order may be transformed in non-verb structures as well as it may be deduced from non-verb structures (like in "Venus has orbit around the Sun").

Sometimes "semantics" implies very narrow model of it. For example, "semantic" tags of HTML ("form", "table", "footer", "main", "nav", etc) are meaningful for HTML itself but not wider. Though these tags hint about structure of content but they do not explain what content is. The power of HTML is based not the conception of hyperlink (without it HTML is just yet another text formatting language) which is not "semantic" enough. Hypertext link is just an undefined link between resources (usually low level raw data). But how exactly data are linked? Usually, it is specified by some content: "Mars" word in a link is specified by a web page about Mars (which gives more details about Mars). But sometimes links are used for quotations (that is, just for copying text/meaning from another resource). The situation is even more intriguing when we use JavaScrpt in such link. In this case, it may mean navigating, content changing, etc.

Taxonomies and real world
-------------------------

Hierarchies and taxonomies flourished in the age of Enlightenment. The most famous example is Linnaean taxonomy for classification of plants, animals, and minerals. Why it was required and boosted science back then? Any classification/hierarchy is an abstract "tree" of types with the widest scope on top and and the most specific scope at leafs. This allows things/organisms to be matched more efficiently (because we can move along one branch and do less comparisons). Another reason is finally such classifications became a standard for grouping similar things/organisms which allows to correlate definitions more easily.

With the start of computer era, hierarchies and taxonomies were considered as obligatory element of visual and semantic UI too. Specifically for visual UI, they have one more reason for usage: a tree view allows hiding of unrelated information when there is no enough space for showing everything and it is hard to look for information when its volume is big enough. And if for visual UI the same reasoning is actual up to now but for semantic UI this is not so since emergence of search engines.

At first let us look for variants of categorizing `Venus` planet:

> <pre>
> Kids and Teens: School Time: Science: Astronomy and Space: Solar System: Venus
> Science: Astronomy: Solar System: Planets: Venus
> Science: Astronomy and Space: Solar System: Venus
> Science: Technology: Space: Missions: Unmanned: Venus
> Universe: Galaxy: Solar System: Venus
> Universe: Observable universe: Laniakea Supercluster: Virgo Supercluster: Local Group: Milky Way subgroup:
> 	Milky Way: Orion Arm: Gould Belt: Local Bubble: Local Interstellar Cloud:
> 	Solar System: Terrestial planets: Venus
> </pre>

All variants seems logical but some variants are too lengthy, some overlaps with others, some just have slightly different meaning. The main problem here is you need to know exact path and follow it with several clicks. Of course, search in directory partially alleviated this but search engines made this completely obsolete. But can/should we drop hierarchies/taxonomies/classification alltogether? Try to train your classification aptitudes on this example:

> <pre>
> history of Venus chemistry research in 20th century
> history of Venus chemistry in 20th century
> </pre>

* For the first sentence, classification could be `Science: History of science: History of astronomy: History of Venus research: History of Venus chemistry research: History of Venus chemistry research in 20th century`.
* For the second, classification could be `Solar System: Venus: Chemistry: Changes in 20th century`.

But maybe both sentences could be classified starting with `Solar System: Venus: History of Venus` but not with `Science: History of science`? Yes, could be and this is exactly the point where real classification should start: by applying not only to the entire statement but also to separate identifiers and their combinations (`history of Venus`, `Venus chemistry`, `Venus chemistry research`, `history of Venus chemistry`, `history of Venus chemistry research`, `history of Venus in 20th century`, etc), which also implies a hierarchy with multiple entry points, overlapping branches and cross-references.

Hypertext and real world
------------------------

Why hypertext flourished some time ago? Mainly because it links resources (not only text) in Internet, internal networks, and local computers. But it has inherent problem: undefined relation type. How exactly a link in a web page and its target relate to each other? Do you think it is not important? Well, then recall early days of Internet when sometimes the most of words in text could be marked as links. But it is only one example of misuse. To understand other shortcomings of hyperlink, we need to consider the most frequently used variants of hyperlinks.

### Structure

Partially it is the legacy of previously existed printed editions, which
   1. are consequent
   2. restricted with length
   3. has static structure
   
Though hypertext changed the situation with all of these items but they are still actual because
   1. any information can be consumed by humans only consequently
   2. finally, files are restricted with length too
   3. though in some cases we can skip from one part of a document to another but there are a lot of cases when, say, text parts should be studied in certain order

But the question after all is "Do we need a hyperlink for expressing structure of a document?" No, because it is more important how information but not its medium is structured. For example, not the fact "Solar System.html" refer to "Venus.html" but the fact "Solar System" includes "Venus". The same concerns division by pages or chapters: from the point of view of meaning it is just physical boundaries, which sometimes could matter but in the most of cases it is not important if a book is printed with black or dark grey inks, if it has hardcover or not. Finally, logical structure by chapters can hint what an author thought to be an appropriate order of information but sometimes it does not matter for a reader, which would structure the same information differently.

### Definition

Hyperlinks were used often as a reference to definitions in early days of Internet. Now this usage is less frequent but still occurs. Though this usage will be always required because we cannot be sure what knowledge level for given topic readers have. Some of them will want just a short definition, some more lengthy. But in any case it is more important correctly identify a word/phrase than to give a link to specific resource with a definition. Of course, bigger problem is to get correct definition from trusted source but it is beyond of consideration here.

### Behavior

Behavior-oriented hyperlinks are implemented either with JavaScript in browser-side or with any programming language in server-side because
   1. when information is processed some way, then it and its representation might be not the same while we use it
   2. information could not be created beforehand in all cases (therefore it is generated and produced on request)

From the point of view of meaning it would be good if:
   1. information is represented with meaningful markup in both client-side and server-side
   2. its representation is reflection of its meaning (any UI element represents restrictions for information, which are criteria of identification/similarity/abstraction/classification)
   3. part of information may be hidden from end-users and be processed only in server-side (similarly as an application logic may be hidden in binary form)
   4. if it is not possible to represent all information at once, then at least its abstraction should be availble

### Quotation

Finally we come to hyperlink usage, which corresponds better to its purpose. When we quote information in another resource or share a link, we refer to specific resource. The most frequent problem here is the quoted/shared resource may be unavailble later. Unfortunately, there is no solution except of copying information in some form.

Thus, we can see hyperlink should have the only legitimate usage: to be specific link to specific resource. Otherwise it should be replaced with meaningful markup.