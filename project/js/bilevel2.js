function bilevel2(){

	var width = 750;
	var height = 600;
	var radius = Math.min(width,height)/2;

	//Skapa en linjär skala
	var x = d3.scale.linear()
		.range([0, 2*Math.PI]);

	var y = d3.scale.linear()
		.range([0, radius]);

	var color = d3.scale.category20c();

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/2 + "," + (height/2) + ")");

	var categories = ["Livsmedelsnamn", "Fett(g)", "Summa mättade fettsyror(g)", "Summa enkelomättade fettsyror(g)"];

	var partition = d3.layout.partition()
		.value(function(d, i){ 
			d.forEach(function(c){
				console.log(c[categories[1]]); 
				//console.log(d[i][categories[0]]); 
				return c[categories[1]]; 
			})
		});

	var arc = d3.svg.arc()
		.innerRadius(function(d){ return Math.max(0, y(d.y)); })
		.outerRadius(function(d){ return Math.max(0, y(d.y + d.dy)); })
		.startAngle(function(d){ return Math.max(0, Math.min(2*Math.PI, x(d.x))); })
		.endAngle(function(d){ return Math.max(0, Math.min(2*Math.PI, x(d.x + d.dx))); });

	d3.csv("data/livsmedelKomma.csv", function(data, root){
		this.data = data;
		
		var indexColor = 0;

		var path = svg.selectAll("path")
			.data(partition.nodes(root))
			.enter().append("path")
			.attr("d", arc)
			.style("fill", function(d){ 
				var sendColor = color(indexColor);
				indexColor++;
				return color(sendColor); 
			})
			.on("click", click);

		function click(d){
			path.transition()
				.duration(750)
				.attrTween("d", arcTween(d));
		}
	});

	function arcTween(d){
		var xd = d3.interpolate(x.domain(), [d.x, d.x+d.dx]),
				yd = d3.interpolate(y.domain(), [d.y, 1]),
				yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
		return function(d, i){
			return i ? 
				function(t) {return arc(d);} :
				function(t) {
					x.domain(xd(t));
					y.domain(yd(t)).range(yr(t));
					return arc(d);
				};
		};
	}
}