Does your code speak English?
=============================

Yes, it is not a common feature yet. Natural language processing is not mature yet and is not present in mainstream programming. There is no good way to integrate your code with search engine or virtual assistant (like Siri). Voice commands just imitate GUI paths (click-open-click). Semantic Web tries to introduce meaning in applications but still fails to reach wide audience. Behavior-driven development relies on DSL (domain-specific language), which is close to natural language but is not enough to make your code speak.

But your code can interact with natural language even today though not with the current trend. Modern technologies do not understand natural language and it is not really clear when it would be possible. Therefore, we need an approach, which should:

* be adapted to natural language
* be easily learned by broad audience
* mediate between natural language and computer entities
* environ as many areas of software engineering as possible.

### Adapting

Imagine you try to understand what "xxarrgh" means in some cosmic language basing on facts: (a) "xxarrgh" is an instance of "xyzie", (b) "xxarrgh" has "length" and "bbarrgh" properties, it can be "moved" and "ccarrghed", (c) "xxarrgh" is a noun. You can link these facts in a semantic network, you can build a vocabulary and an ontology, you can find "xxarrgh" with a search query by relevancy, you can even talk about it with a virtual assistant (which will answer you that "xxarrgh is a xyzie, you know"), you can even parse "xxarrgh ccarrghed by ghrraxx" to subject-predicate-object. But none of these approaches allow to understand what is behind these words. Real understanding comes only if words (and meaning behind them) explained in terms, which you are familiar with, that is, you know what they are similar to. "xxarrgh is a blue sprout of half-vegetable half-fruit" is an example of such explanation. And there is no reliable technology, which could work with such definitions.

Relevancy is too vague, which results in statistical guesses. Relevancy between "planet" and "sphere", "star", "dust cloud", "vacuum", "physics" does not help to understand what planet is because these words may relate not only to "planet". Whereas "A planet is an astronomical object orbiting a star" based on similarity between the term and the definition does. 

The flaw of natural language processing is excessive reliance on natural language rules. These rules are needed to be grammatically correct but cannot help for understanding in all cases. "Jupiter orbits", "orbit of Jupiter", "Jupiter orbiting" are quite close by meaning. Distinction of static nature of Jupiter and dynamic nature of orbit is conditional and depends on circumstances or context. What really matters is (a) what is "Jupiter", (b) what is "orbit", (c) what is their combination. But this knowledge usually is not present in a text.

Any approach, which manipulates with vocabularies and ontologies (or with classes/objects/etc), has another shortcoming. It expresses domain relations (including similarity ones) but it has no connection with natural language. Correspondingly, it does not express some characteristics of the outer world and cognition, which natural language does. Even too advanced approach of [the Semantic Web](https://en.wikipedia.org/wiki/Object_%28computer_science%29#The_Semantic_Web) has restrictions here: (a) though it claims class membership may change and classes may be changed at runtime but it is not fully achievable at it is done on the base of vocabulary and ontology defined design-time, (b) URIs are needed for identification, (c) OWL statements are needed for meaning, (d) reasoners are needed for classification and consistency checking.

Therefore, we need an alternative approach, which needs:
* To use a balanced similarity (in the form of ambiguous natural language, which is disambiguated as much as possible)
* To have a component structure of statements as the result of disambiguation (explicit boundaries between identifiers, explicit relations)
* To rely on human-friendly natural language (vs. machine-friendly identifiers like livesIn, countryID, etc)
* To use vocabulary and ontology optionally
* To have unlimited flexibility (ability to apply statements not only to things, which they originally were targeted to, but also to similar ones) as it is in natural language
* To have unlimited extensibility (ability to expand a model to give more detailed or summarized description at any moment of time) as it is in natural language
* To involve humans for classification, consistency checking, reasoning, etc.

**The bottom line**:
Adaptation to natural language assumes not literal usage of natural language but rather balancing between ambiguity of it and preciseness, which is inherent to computer approaches.

### Learning

What can make the approach simple to learn? First, aforementioned usage of natural language identifiers. Second, sufficiently disambiguated natural language. Third, relaxed rules. Fourth, text markup. Why these points help?

Human-readable natural language identifiers for speakers in most cases require no learning. Disambiguated entities (explicit boundaries between identifiers, explicit relations) just saves time for other readers/consumers. Relaxed rules allow collaboration of users with very different knowledge levels. For example, "Jupiter is instance of a planet" can be not so evident for many ones, whereas "Jupiter is a planet" is such for most of them. Text markup is required, as it can be used transparently (being even invisible for users, for example: <a href="meaning:{_}" style="text-decoration:none">What</a> <a href="meaning:{is}" style="text-decoration:none">is</a> <a href="meaning:{has} diameter" style="text-decoration:none">planet</a> <a href="meaning:{of} planet" style="text-decoration:none">diameter</a>?) and it allows to settle meaning once it is identified by a content collaborator. For example, "New York buildings" can be disambiguated as both "New York {has} buildings" and "New {of} buildings {of} York" ("new" here is a characteristic of "buildings").

This significantly differs from what we have in other semantic approaches and programming. Identifiers are machine-readable, natural language is not processed or produces esoteric analysis results, rules are quite strict, no text markup. Take Semantic Web for [example](https://developer.marklogic.com/learn/semantics-exercises/hello-world). URI is machine-readable (though readable by humans to some degree). Triples (subject-object-predicate) try to imitate natural language but finally they are not human-friendly too. Heavyweight standards with a lot of rules. Alternatives are presumably human-readable [Notation3](https://en.wikipedia.org/wiki/Notation3) and [Turtle](https://www.w3.org/TR/turtle/). But here we see again "human-friendly" URI and names like dc:title (which may look human-readable in this example but another time it could be dc_fr12:ttl). [Microformats](https://en.wikipedia.org/wiki/Microformat) exhibit slightly differently approach used within HTML only, but, finally, it is just a sort of domain-specific language. DSL itself though considered as a promising direction but has certain [pros and cons](https://en.wikipedia.org/wiki/Domain-specific_language#Advantages_and_disadvantages), shortcomings of which can be explained by one phrase: necessity of knowing a new language. In all cases above, we see learning is the significant factor, which we cannot neglect.

**The bottom line**:
Bottom-up, gradual, and relaxed approach allows to start from scratch as in most of programming languages. It makes possible to work with natural language identifiers and a basic set of relations, which can be restricted with 2-3 ones. This minimizes usage of complex, costly, and not reliable yet (as for understanding) natural language processing. Differentiation of identifiers and basic relations is much easier task than one of noun-verbs-adjectives-adverbs or triples (subject-predicate-object) or unique definitions of classes/fields/methods. It can be done and it can be consumed without additional analysis by both humans and algorithms.

### Mediating

What does getBallVolume(diameter) function do? Classic approach expresses output through input as "Returns a ball volume by diameter". In terms of natural language, it can be expressed with a question like "What is volume of ball?" or "What is volume of ball with X diameter?" or with the imperative mentioned in the previous sentence. To mediate between function and natural language, we need to link input and output of function with ones of a sentence. How to do this? A question may be divided into meaningful identifiers and relations: "What {is} volume {of} ball?", where (1) function output maps to "what" or an unknown, (2) function input maps to "volume {of} ball" or "ball {has} volume", (3) "{is}" and "{of}"/"{has}" relations link identifiers of input and output. Now, we can write a unit test with [meaningful.js library](https://github.com/meaningfuljs/meaningfuljs):

```javascript
	meaningful.register({
		func: getBallVolume,
		question: 'What {_ @func getBallVolume} {is} volume {of} ball',
		input: [ { name: 'diameter' } ]
	});
	expect(meaningful.query('What {_} {is} volume {of} ball {has} diameter {has value} 2')).toEqual([ 4.1887902047863905 ]);
```

What is done here? (1) getBallVolume function is registered to handle "What is volume of ball?" question with diameter parameter, (2) "What is volume of ball with diameter equals to 2?" question asked (which roughly equivalent to mentioned in code), (3) expected result checked. How this works? Internally questions (linked with function and incoming) compared and if they match each other (that is, their corresponding parts are similar), then result found: (a) "What {_ @func getBallVolume}" ("@func getBallVolume" just indicates an unknown is an output of this function) matches "What {_}", (b) "volume {of} ball" is the same in both questions, (c) in register() function "diameter" is not included into the question but is present as the input parameter, therefore it matches "diameter" in the second question, (d) "diameter {has value} 2" is applied as input and getBallVolume(2) called, (e) function result returned as question outcome.

Slightly more complex example (registering of getBallVolume function here [implied](https://github.com/meaningfuljs/meaningfuljs/blob/master/spec/meaning-querying-functions-spec.js)):

```javascript
function getPlanet(planetName) {
	return data[planetName]; // returns some data from external data source
}

meaningful.register({
	func: getPlanet,
	question: 'What {_ @func planet.getDiameter} {is} diameter {of} planet',
	input: [
		{ name: 'planet', func: function(planetName) { return planetName ? planetName.toLowerCase() : undefined; } } // planet name keys are in lower case
	],
	output: function(result) { return result.diameter; } // only one field of JSON returned
});

meaningful.build([ 'Jupiter {is instance of} planet', 'planet {is} ball' ]); // add similarity rules
expect(meaningful.query('What {_} {is} volume {of} Jupiter')).toEqual([ 1530597322872155.8 ]);
```

How this works? (a) "Jupiter {is instance of} planet", so we can consider "What is volume of Jupiter?" as "What is volume of planet?" question, (b) "planet {is} ball", so we can consider this question as "What is volume of ball?", (c) "diameter {of} Jupiter" can be retrieved from a diameter attribute of a planet object returned from getPlanet("Jupiter") call.

In Java (as well as in other multi-paradigm programming languages) such examples could look even more elegant:

```Java
@Meaning ball
class BallLike {

	@Meaning
	int diameter; // if field name is equals to human-readable identifier we may omit in annotation
	
	@Meaning volume
	double getVolume(); // each field/method by default corresponds to "What {_} {is} field {of} class?" question
	
}
```

Such approach is simpler than any virtual assistant APIs: [Siri](https://developer.apple.com/sirikit/), [Google Assistant](https://developer.android.com/training/articles/assistant.html), or [Cortana](https://developer.microsoft.com/en-us/cortana) one. Only the fact there are several different types of API can discourage more than possible excitement from integration with naturally speaking assistants. The most close match from these APIs is [structured data markup](https://msdn.microsoft.com/en-us/cortana/structured-data-markup) but it is not human-friendly enough.

What proposes Semantic Web is [not short](https://jena.apache.org/tutorials/rdf_api.html) and resembles XML processing. Semantic Web querying in the form of SPARQL is restricted, as is any kind of SQL-like language. Natural language questions are wider than selecting fields/properties and also concern space-time, cause-effect, and some other important aspects of reality and abstraction, which require special treatment.

This approach can be compared with what search engines do. They are able to retrieve [planet diameter](https://www.google.com/webhp?ie=UTF-8#q=jupiter%20diameter) but the result is not reusable. [planet volume](https://www.google.com/webhp?ie=UTF-8#q=jupiter%20volume) just does not work. We cannot retrieve any custom data. Whereas the proposal allows to answer to these and many other queries but also to make the very code searchable.

**The bottom line**:
Unobtrusive nature does not force your data be compliant with some heavyweight standards or with special data structures (like triples) and special data stores (like triplestores). To the contrary, it is adapted to your data, it is just a sort of interface, which may be applied to legacy/nonlegacy data and code. That is, instead of building Giant Global Graph of data, which Semantic Web seemingly aspire to, the proposed approach intends to build "Web of questions and answers", which is partially discrete (as separate identifiers and relations are discrete) and partially continuous (as both identifiers and relations may match similar ones or combinations of them).
 
### Environing

As we see, meaningful markup can be transformed into both natural language (and be handled by search engines or virtual assistants) and API calls (to form a sort of natural language programming interface). Markup turns plain text into a component structure, where each element may be replaced with similar one. Therefore, in most of cases transformation into natural language can be quite straightforward or at least simplified: "What {is} diameter {of} planet?" can directly correspond to "What is diameter of planet?" question or be similar to "What is diameter of astronomical object?". As for NLI, at first an idea to write "What {is} volume {of} Jupiter" instead of jupiter.getVolume() or getBallVolume(jupiter.diameter) looks redundant. But nobody says NLI calls should be applied to all lines of code. This can involve only to parts of it, which are meaningful in terms of high-level design. Moreover, it has certain pluses: (a) specification is compatible with natural language, (b) we do not operate with specific API calls (so learning curve for specific API can be minimized), (c) class/method/function/parameter names are more explicit, etc. Also, NLI could be the easiest way (comparing even with command-line) to have some interface for small applications and appliances (for example, in IoT) or where multiple programming languages used.

Because of dual compatibility with both natural language and code, markup can be used in other areas of software engineering: requirements, tests, configuration, user interface, documentation, etc. For example, a requirement may state "The application should be able to calculate planet's diameter" so we can markup it and check if some function call or a test or a part of user interface correspond to this statement.

Markup may open a new area for research: cause-effect. Modern applications do tentative steps in this direction and usually try to explain the cause of an error or an unexpected behavior but this practice can be expanded in many other areas: for example, to see what options affect some function, etc. To be really efficient, such explanations should be reusable. For example, if some feature is disabled, then an application may provide some UI features or options, which a user may re-configure just in place.

Though [behavior-driven development](https://en.wikipedia.org/wiki/Behavior-driven_development) is moving in similar direction of environing but there are some important distinctions. English-like DSL looks pretty but, finally, it is not reusable by other tools, because it represents plain text, which can be interpreted only by an algorithm, which understands this DSL. On the other hand, why we should restrict ourselves only with tests and design? We interact with natural language on all stages of software engineering and a high-level architecture of a domain influences all of them too.

**The bottom line**:
The approach is applicable not only to code but also to text documents, user interface, functions, configuration, services, and [web pages](https://github.com/meaningfuljs/meaningfuljs/blob/master/doc/html-applying.md). This can open new horizons of engagement. Thus, a web page can be used as a sort of function in conjunction with real functions, and, vice versa, a function can be used as a sort of a web page in a search.

### Conclusion

The greatest challenge for Semantic Web is to explain why the community needs it, RDF, triples, triplestores, and automatic reasoning. Applications have been linking data for many years before Semantic Web. Architects have been defining domains with different tools (including ontologies) long enough before Semantic Web. Its heavyweight standards have traits of XML/UML/SQL and it is not really clear if benefits of their usage overweight migration cost and learning curve outlays. Possibly, that's why there is no Semantic Web in standard libraries of widespread programming languages and no plans to include. Semantic Web is positioned as "Web of Data", which allows intelligent agents to handle heterogeneous information. Humans assumed to get this information from a "black box", which does some reasoning for them. Semantic Web standards are far from human-readability and nobody cares about it. There are no hot topics around semantics applicability and usability. What's for? Intelligent agents will handle everything. Just adjust everything to Semantic Web standards. Is it inspiring?

On the contrary, the approach proposed here is lightweight, which can be [implemented](https://github.com/meaningfuljs/meaningfuljs) with build-in JavaScript features and [underscore.js](http://underscorejs.org)  (not saying about multi-paradigm languages). The resulting proof-of-concept in only ~2K lines of code. Lighweightness leads to simplified parsing, plain data structures, and not very complicated reasoning. Is it oversimplification of what we have with Semantic Web? Possibly, similarly as your local database could be an oversimplification of Big Data, but both variants just have different scope of feasibility.

Can the proposed approach confront [challenges of Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web#Challenges)? We should rememeber they caused by, in first, by potential vastness, vagueness, uncertainty, inconsistency, and fallibility of cognition. Humankind have been living with these challenges during many years but it presents a real problem for rigid, narrowly focused, assertive, single-minded, categorical algorithms. 

Any information is potentially vast, vague, uncertain, inconsistent, and fallible. Take for example, Jupiter diameter. It looks as a simple and definite value only because we restrict ourselves and we settle it as "once and forever" true. But it is not so. It could be too complex, if we have a goal to calculate it very precisely, which could involve millions sub-tasks. It is vague, because it may change in time and it may be defined with different methods and within some boundaries of precision. It could be uncertain, if we recall all assumptions, which are true only to some degree, for example, that Jupiter is an ideally round sphere. A value in metric units could be inconsistent (if no conversion available) with imperial units. All you should know about fallibility is in "Jupiter diameter" search: sources give dozens of different values.

In real world we just understand this. We understand we have no resources to consider each value in the vein of VVUIF. But it could be really dangerous if it concerns a black box, in which we trust. We just cannot afford that. We need a constant feedback and correction (as a variant, by two-way conversation). We need to consider these challenges as rather features or routine than problems.

* Vastness encourages curiosity and planning. A vast task can be separated into sub-tasks and delegated.
* Vagueness leads to flexibility.  We use quite vague natural language, where each word can be precise enough only under certain conditions. The world changes every moment, so any "catch of reality" comes untrue and vague the next moment. Vague characteristics like "young" could characterize a human even better than very accurate age. Qualification is a result of estimation, which already involved some reasoning. A result of qualification saves our time later, so we don't need to re-qualify it (though, there is a risk the result is incorrect).
* Uncertainty bears alternatives and makes us to use risk management. That's absolutely normal situation, when we have multiple outcomes of some process. The choice may be left for a decision maker.
* Inconsistency motivates versatility and feature enrichment. Consistency in most of cases comes from our ordering of the Nature. It can be done in numerous ways and to exclude some of them we should know the full picture. But namely this we could not know in all situations.
* Fallibility curbed by skepticism. Algorithms are not sceptic (yet?). But humans are not totally sceptic too because we just have no time to verify (and re-verify) all facts from different sources.

All these points imply human involvement. Humans may interpret if a provided result is really vast, vague, uncertain, inconsistent, or erroneous. It could be acceptable, it could re-interpreted, it could change a direction of a research, it could be tuned up, it could be reworked manually, it could require additional coding (as a sort of reasoning), etc. We demand precise results from machines, but we constantly operate with vague and uncertain information in natural language. The situation has to be changed, vagueneess and uncertainty should be considered as just an aspect of any data provided that such data will be supported by software engineering community along with numerous libraries and frameworks. This support is possible only if code can speak English. And that's exactly what this approach can bring to life.

*[The first variant of article published on DZone](https://dzone.com/articles/do-your-code-speak-english)*