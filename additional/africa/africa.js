var proj = d3.geo.equirectangular().scale(1).translate([0,0]),
	path = d3.geo.path().projection(proj),
	margin = 25,
	cswitch = 1,
	width = window.innerWidth - margin,
	height = window.innerHeight - margin,
	svg = d3.select("body")
		.append("svg:svg")
		.attr("height", height)
		.attr("width", width),
	canvas = svg.append("svg:g")
		.attr("height", height - 5*margin)
		.attr("transform", "translate("+margin+","+3*margin+")"),
	clist = canvas.append("svg:g")
		.attr("width", "30%"),
	map = canvas.append("svg:g")
		.attr("width", "70%")
		.attr("transform", 
				"translate(" + (0.05 * window.innerWidth - margin) + "," +
					margin + ")");
// Text Notes
	svg.append("svg:text")
		.classed("title", true)
		.attr("text-anchor", "start")
		.attr("x", 1.5*margin)
		.attr("y", 1.5*margin)
		.text("Wealth and Energy Inequality in Africa");
	svg.append("svg:text")
		.attr("text-anchor", "start")
		.attr("y", height-5)
		.text("Source: World Bank");
	svg.append("svg:text")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height-5)
		.text("Invested Development 2012");

// Map drawing.
	d3.json("africa.geojson", function(shapes) {
		var bounds0 = d3.geo.bounds(shapes),
			bounds = bounds0.map(proj),
			xscale = 0.6 * width/Math.abs(bounds[1][0] - bounds[0][0]),
			yscale = (height - 5 * margin) /
				Math.abs(bounds[1][1] - bounds[0][1]),
			scale = Math.min(xscale, yscale);

		proj.scale(scale);
		proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));

		var countries = shapes.features.sort(function(a, b) {
				return a.country.gdp - b.country.gdp;
			}),
			gdpmax = countries[countries.length-1].country.gdp,
			cscale = d3.scale.pow().exponent(.3).domain([0, gdpmax])
				.range(["#C6DBEF", "#08306B"]);
				
		var cmobiles = shapes.features.sort(function(a, b) {
				return a.country.mobiles - b.country.mobiles;
			}),
			mobilemax = cmobiles[cmobiles.length-1].country.mobiles,
			mscale = d3.scale.pow().exponent(.3).domain([0, mobilemax])
				.range(["#C6DBEF", "#08306B"]);

		map.append("svg:g")
			.selectAll("path")
			.data(countries)
			.enter()
			.append("svg:path")
			.attr("d", path)
			.attr("fill", function(d) { return cscale(d.country.gdp); });
			
/*		
		function gdpcolor() {
			map.selectAll("path")
				.transition()
				.duration(2000)
				.attr("fill", function(d) { return cscale(d.country.gdp); });
				
			cswitch = 1;
		}		*/
		
		function mobilecolor() {
			map.select("svg:g")
				.selectAll("path")
				.data(cmobiles)
				.enter()
				.attr("fill", function(d) { return mscale(d.country.mobiles); });
		}
	/*
		function cswitch() {
			if (cswitch = 1) {
				mobilecolor();
			else {
				gdpcolor();
				}
			}
		}
*/	
		map.append("svg:g")
			.selectAll("path.overlay")
			.data(countries)
			.enter()
			.append("svg:path")
			.classed("overlay", true)
			.attr("fill-opacity", 0)
			.attr("d", path)
			.append("original-title")
			.text(function(d) {
				var c = proj(d.geometry.coordinates[0][0]);
				if(c[0] > width/2) {
					if(c[1] > height/2) {
						$(this).parent().tipsy({gravity:'se'});
					} else {
						$(this).parent().tipsy({gravity:'ne'});
					}
				} else {
					if(c[1] > height/2) {
						$(this).parent().tipsy({gravity:'sw'});
					} else {
						$(this).parent().tipsy({gravity:'nw'});
					}
				}
				return d.country.name + ": GDP: " + 
					(d.country.gdp > 0 ? Math.round(d.country.gdp * 100) / 100 : "n/a") + ": Mobiles: " + 
						(d.country.mobiles > 0 ? Math.round(d.country.mobiles * 10) / 10 : "n/a");
			});
	});
//End JSON