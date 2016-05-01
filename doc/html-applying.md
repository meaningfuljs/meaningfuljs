Applying to HTML
================

Meaning can be applied to some HTML partially, fully, or implicitly.

In the example below, for table meaning applied through:
   * Table headers. Each column is property of a planet and one column identifies a planet.
   * Table body. Each row is an instance of planet.

```
<table meaning="planet">
	<thead meaning="planet [has property]">
		<tr>
			<th meaning="planet [has id]">Name</th>
			<th>Diameter</th>
			...
		</tr>
	</thead>
	<tbody meaning="[is instance of] planet">
		<tr>
			<td>Mercury</td>
			<td>4,878 km</td>
			...
		</tr>
		...
	</tbody>
</table>
```

Similarly, meaning may be applied to other HTML elements. For example:
   * HTML body defines a general topic of a page: `OS_like_OS`.
   * Div narrows meaning to `OS_like_OS run on computer which has...`
   * Each li defines one condition of requirements.

```
<body meaning="OS_like_OS">
	...
	<div meaning="[is done] run [has property] computer [has #1]">
		<h4>Requirements</h4>
		<span>To run OS_like_OS on your computer you need:</span>
		<ul>
			<li meaning>
				<span meaning="[#2] [@math greater than] [@math units of]">
					2
				</span>
				<span meaning="[#3]">
					GHz
				</span> or faster 
				<span meaning="[#1] [has property 'frequency'] [has condition #2]">
					processor
				</span>
			</li>
			<li meaning>
				<span meaning="[#2] [@math greater than] [@math units of]">
					1
				</span>
				<span meaning="[#3]">
					GB
				</span>
				<span meaning="[#1] [has property 'volume'] [has condition #2]">
					RAM
				</span>
			</li>
			<li meaning>
				<span meaning="[#2] [@math greater than] [@math units of]">
					200
				</span>
				<span meaning="[#3]">
					MB
				</span> available
				<span meaning="[#1] [has property]">
					hard disk
				</span>
				<span meaning="[has condition #2]">
					space
				</span>
			</li>
		</ul>
	</div>
	...
</body>
```