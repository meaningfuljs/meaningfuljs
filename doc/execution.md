<link rel="stylesheet" href="meaningful.css"/>Execution
=========

Execution is required to answer , for example, [questions](questions.md) of math problems. The matter is each math problem condition is not just data but a set of data for different moments of time:

* When Mary had initial quantity of apples and pears
* Then when Tom changed this situation
* And when Mary ate as many apples as she could

> <pre>
> <span class="rel">{/}</span>
> 	Mary<span class="rel">{#m} {has #1a #1b}</span>
> 	5<span class="rel">{#1a} {@math units of #2a}</span> apples<span class="rel">{#2a}</span> and
> 	<span class="rel">{/}</span>4<span class="rel">{/#1b} {@math units of #2b}</span> pears<span class="rel">{#2b}</span>
> <span class="rel">{/#ev1 @time then #ev2}</span>
> 
> <span class="rel">{/}</span>and
> 	<span class="rel">{/}</span>Tom<span class="rel">{/#3} {does}</span> gave <span class="rel">{has property #4 #5} {is the same @math add}</span> 
> 	her<span class="rel">{#4 is the same #m}</span>
> 	7<span class="rel">{#5} {@math units of #6}</span> pears<span class="rel">{#6}</span>
> <span class="rel">{/#ev2 @time then #ev3}</span>
> 
> <span class="rel">{/}</span>then
> 	<span class="rel">{/}</span>Mary<span class="rel">{/#m} {does}</span> ate <span class="rel">{has property #7} {is the same @math sub}</span>
> 	3 <span class="rel">{#7 @math units of}</span> apples
> <span class="rel">{/#ev3}</span>
> </pre>

Typical question of math problem is not against data of math problem but against result of its execution:

* {#ev1}: Mary had 5 apples and 4 pears
* {#ev2}: Tom gave her 7 pears -> Mary had 5 apples and 11 pears
* {#ev3}: Mary ate 3 apples -> Mary has 2 apples and 11 pears

In the result this question should produce "2" answer:

> <pre>
> How many<span class="rel">{_ @math quantity} {@math units of}</span> apples<span class="rel">{#1}</span> does <span class="rel">{/}</span>Mary<span class="rel">{/#2 has _}</span> have now
> </pre>

And this should do "11" one:

> <pre>
> How many<span class="rel">{_ @math quantity} {@math units of}</span> pears<span class="rel">{#1}</span> does <span class="rel">{/}</span>Mary<span class="rel">{/#2 has _}</span> have now
> </pre>
		
Please also check [unit tests for executing](../spec/meaning-executing-spec.js).