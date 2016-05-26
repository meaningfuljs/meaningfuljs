Why namely [this theory](meaning.md)?
=====================================

Simple answer is because we have a dozen years of backwater. Search engines propose almost the same as they did back then plus cosmetic changes here and there (except of image search/recognition where progress is evident). You can have good search results only in the case of simple query. Check popular queries and trends: mainly, they are names of someone or something. If you ask more complex question, then you need to filter results yourself. Search engine teams constantly boast you can have more and even more "enhanced" queries and use "sophisticated" features. Is it really so? What features are considered as "advanced"?

* When you search for some popular band, then search engine recognizes it as an entity and gives data in side bar (albums, songs, profiles, videos, etc). But, it does not work for slightly complex or ambiguous queries. Try "tiger area" (results found but not as an entity) or "euro" (no entities, though it could give several ones).
* Advertisement boasts search engines recognizes superlatives, time relations, etc. Yes, it is true, for samples from this advertisement but when you try to have own search, it fails. Try "what is the longest song of ..." (but do not choose popular band, because in this case there are articles with such title) or "who was british pm when ... was formed". Unfortunately, in both cases results are similar as with a regular query. Moreover, the latter question for "The Beatles" gives 4.1 million results. But the answer is 1 name: "Harold Macmillan".
* Some companies promise AI approach will be here soon. Maybe in 5 years. But what's if not? We wait for AI miracles already for 50 years or so. Should we wait another 5 years? Would it be the silver bullet which would satisfy any query or some slightly enhanced queries? Would it work ideally at once or we would need another 10 years to have a new approach more mature? Would it handle all information or only the most frequently used? Would it be free for you?

The biggest problem for now: there is no good theory of meaning. There are a lot of theories and technologies (in part, semantic networks, ontologies, etc) but they do not work well enough. The proof is absence of meaning processing in mainstream programming languages and frameworks. But if we don't know exactly what is meaning how we could search for it?

Why modern approaches mislead?
------------------------------

Simply put, modern search mainly relies on natural language relevance. More complex answer is they:

* Use text as base unit. Though meaning could be expressed with natural language but it should not rely on it because its ambiguity. Words are rather references to real or abstract object-actions and we need to operate with namely object-actions but not with words themselves.
* Rely rather on relevance between words but they should consider similarity of meaning. Text relevance would work ideally in imaginary world where all words are unique (then relevance won't be ambiguous). Instead we need either to identify what real object-actions (which are unique) are behind these words or to compare words and a referred original as close as possible (in the case, when words refer to abstract object-actions, we can identify meaning only sufficiently precise).
* Use similarity, which is expressed with synonyms and related words. But it can be expressed also with classification, aggregation, composition, etc (for example, "the biggest burning astronomical body near Earth" which should give 1 result not 4 million references to asteroids and meteoroid).
* Try to do everything ourselves but it is hardly possible in general. Sometimes even humans cannot understand each other and ask for more explanations. Could any software get what an author of content meant when wrote this or that page? But why an author of content can't deal with meaning when this content created?
* Index pages as flat text. But what's if we regard each document or a group of documents as an information storage similarly to a database? This means documents may be queried and responsibility of authors will be to debug them to see if all expected answers satisfied.
* Consider only static pages. But we can deal with generated data if we will know what meaning can be expected.

What is the alternative approach?
---------------------------------

That is, the proposed approach differs from natural language ones as it:

* Operates with object-actions (of real world or abstract one) or reference chains from abstract object-action to real world object-action.
* Uses identification-similarity-abstraction-specification-classification as integral parts of meaning recognition process or rather comparison of similar object-actions (real or abstract).
* Proposes to use simple enough semantic markup to be applied to plain text (or any other data).
* Considers any piece of information as a storage, which may be queried (in part, with natural language questions).
* May deal with generated data by knowing outline of expected information.
* Regard meaning as a set of identifiers, linked with relations (identity, similarity, abstraction, specification, classification, space-time relations, cause-effect, condition, purpose, math, logic, etc), and which refers to object-actions (real or abstract).
* Aims to describe some situation rather than to have grammatically correct constructs (for example, some description which includes one noun and several levels of "has part" relations aren't to be broken into grammatically correct sentences).
