// Data calculations
var gdpinput = 1727111096363;
	gdpcurrentinput = 1727111096363;
	gfcfinput = 509231828098;
	eiinput = 27474276642;
	costinput = 3.4;
	cost = costinput;
	gdp = gdpinput;
	gfcf =  gfcfinput / gdp;
	energyinv = eiinput / gfcfinput;
	fgfcf = .35;
	fenergyinv = .075;
	fgdpg = 0.08;
	fcost = 1;
	years = 10;
	startyear = 0;
	cgdpg = 0.088064;
	gdpgforecast = new Array();
	gdpforecast = new Array();
	gfcfforecast = new Array();
	eiforecast = new Array();
	solarspending = new Array();
	costforecast = new Array();
	gdpforecast[0] = gdp;
	gdpcurrent = new Array();
	gdpcurrent[0] = gdpcurrentinput;
	pvinstalls = new Array();
	pvtotals = new Array();
	pvtotals[0] = 189;
	date = new Array();
	sforecast = new Array();
	sinv = 0.008538896;
	fsinv = 0.05;
	

function calc(){
	for (i=0;i<=years;i++)
	{
	date[i] = i+2010;
	gdpgforecast[i] = cgdpg - ((cgdpg - fgdpg)/years * i);
	};
	
	// GDP Value Calculations
	for (i=1;i<=(years);i++)
	{
	gdpforecast[i] = gdpforecast[i-1] * (1 + gdpgforecast[i]);
	gdpcurrent[i] = gdpcurrent[i-1]  * (1 + gdpgforecast[i]);
	};
	
	
	for (i=0;i<=years;i++)
	{
	gfcfforecast[i] = gfcf - ((gfcf - fgfcf)/years * i);
	eiforecast[i] = energyinv - ((energyinv - fenergyinv)/years * i);
	sforecast[i] = sinv - ((sinv - fsinv)/years * i);
	solarspending[i] = gdpforecast[i] * gfcfforecast[i] * eiforecast[i] * sforecast[i];
	costforecast[i] = cost - ((cost - fcost)/years * i);
	pvinstalls[i] = solarspending[i]/costforecast[i]/1000000;
	};
	
	for (i=1;i<=years;i++)
	{
	pvinstalls[i-1] = solarspending[i]/costforecast[i]/1000000;
	pvtotals[i] = Math.round(pvinstalls[i]+pvtotals[i-1]);
	};
		
	data = pvtotals;
	finalgdp = (Math.round(gdpcurrent[years] / 10000000000) / 100).toFixed(2);
	finalgfcf = (Math.round((gdpcurrent[years] * gfcfforecast[years]) / 10000000000) / 100).toFixed(2);
	finaleinv = (Math.round((gdpcurrent[years] * gfcfforecast[years] * eiforecast[years]) / 10000000) / 100).toFixed(2);
	finalsinv = (Math.round((gdpcurrent[years] * gfcfforecast[years] * eiforecast[years] * sforecast[years]) / 10000000) / 100).toFixed(2);
	startgdp = (Math.round(gdpcurrent[startyear] / 10000000000) / 100).toFixed(2);
	startgfcf = (Math.round((gdpcurrent[startyear] * gfcfforecast[startyear]) / 10000000000) / 100).toFixed(2);
	starteinv = (Math.round((gdpcurrent[startyear] * gfcfforecast[startyear] * eiforecast[startyear]) / 10000000) / 100).toFixed(2);
	startsinv = (Math.round((gdpcurrent[startyear] * gfcfforecast[startyear] * eiforecast[startyear] * sforecast[startyear]) / 10000000) / 100).toFixed(2);
	}

calc();

	var w = .62 * window.innerWidth,
		h = 400,
		maxheight = 30000,
		p = 50;
		
	var chart = d3.select("#chart")
		.append("svg")
		.attr("class", "chart")
		.attr("width", w)
		.attr("height", h)
		.style("padding", p)
		.append("g");

function draw() {	
	var x = d3.scale.linear()
		.domain([0, maxheight])
		.range([0, h]);
	
	var y = d3.scale.ordinal()
		.domain(data)
		.rangeBands([0, w]);

	// Background
	chart.append("rect")
		.attr("y", -10)
		.attr("width", w)
		.attr("height", h + 30)
		.style("fill", "#fff");

	// Add horizontal lines.
	chart.selectAll(".rule")
		.data(x.ticks(10))
		.enter().append("line")
		.attr("x1", 0)
		.attr("x2", w)
		.attr("y1", function(d) {
		return x(maxheight) - x(d) - 10;
		})
		.attr("y2", function(d) {
		return x(maxheight) - x(d) - 10;
		})
		.style("stroke", "#ccc");

	// Add Legend.
	chart.append("rect")
		.attr("x", 20)
		.attr("y", 8)
		.attr("width", 250)
		.attr("height", 135)
		.style("stroke", "#000")
		.style("fill", "#fff");
	
	// Add label to Legend.
	chart.append("text")
		.attr("class", "title")
		.attr("x", 70)
		.attr("y", 40)
		.text("2020 Estimate:");

	// Add output to Legend.
	chart.append("text")
		.attr("class", "title")
		.style("font-size", 90)
		.style("font-weight", 400)
		.attr("x", 30)
		.attr("y", 125)
		.text((Math.round(data[10]/100)/10).toFixed(1));
	chart.append("text")
		.attr("class", "title")
		.style("font-size", 30)
		.style("font-weight", 400)
		.attr("x", 210)
		.attr("y", 125)
		.text("GW");

	// Create bars.
	chart.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", y)
		.attr("width", y.rangeBand())
		.attr("y", function(d) {
			return x(maxheight) - x(d) - 10;
			})
		.attr("height", x);

	// Add y-axis year labels.			
	chart.selectAll(".rule")
		.data(x.ticks(10))
		.enter().append("text")
		.attr("class", "rule")
		.attr("x", -7)
		.attr("y", function(d) {
		return x(maxheight) - x(d);
		})
		.attr("dy", -7)
		.attr("text-anchor", "end")
		.text(function(d) { return Math.round(d*10)/10000 + " GW"; });

	// Add x-axis year labels.
	chart.selectAll(".bar")
		.data(date)
		.enter().append("text")
		.attr("y", h + 5)
		.attr("x", function(d) { return y(d) + y.rangeBand() / 2 + 6; })
		.attr("dx", -3) // padding-right
		.attr("dy", ".35em") // vertical-align: middle
		.attr("text-anchor", "middle") // text-align: right
		.text(String);

	// Add individual bar data labels.
	bars = chart.selectAll(".bar")
		.data(data)
		.enter().append("text")
		.attr("y", function(d) {
			return x(maxheight) - x(d) - 20;
			})
		.attr("x", function(d) { return y(d) + y.rangeBand() / 2 + 6; })
		.attr("dx", -5) // padding-right
		.attr("dy", ".35em") // vertical-align: middle
		.attr("text-anchor", "middle") // text-align: middle
		.text(function(d) { return (Math.round(d/100)/10).toFixed(1); });

	// Add lines for x & y axes.
	chart.append("line")
		.attr("y1", -10)
		.attr("y2", h - 10)
		.style("stroke", "#000");	
	chart.append("line")
		.attr("x1", 0)
		.attr("x2", w)
		.attr("y1", h - 10)
		.attr("y2", h - 10)
		.style("stroke", "#000");
	};	
	
function redraw() {
	chart.selectAll(".rule").remove();
	chart.selectAll("line").remove();
	chart.selectAll(".bar").remove();
	chart.selectAll("text").remove();
	chart.selectAll("rect").remove();
	calc();
	draw();
	}

function redraw1(newValue) {
	fcost = newValue/100;
	redraw();
	document.getElementById("range1").innerHTML = (newValue/100).toFixed(2);
	updateNumbers();
	}

function redraw2(newValue) {
	fgdpg = newValue/10000;
	redraw();
	document.getElementById("range2").innerHTML = (newValue/100).toFixed(1);
	updateNumbers();
	}

function redraw3(newValue) {
	fgfcf = newValue/10000;
	redraw();
	document.getElementById("range3").innerHTML = (newValue/100).toFixed(1);
	updateNumbers();
	}

function redraw4(newValue) {
	fenergyinv = newValue/10000;
	redraw();
	document.getElementById("range4").innerHTML = (newValue/100).toFixed(1);
	updateNumbers();
	}

function redraw5(newValue) {
	fsinv = newValue/10000;
	redraw();
	document.getElementById("range5").innerHTML = (newValue/100).toFixed(1);
	updateNumbers();
	}

function redrawAll() {
	fcost = 1;
	fgdpg = 0.08;
	fgfcf = .35;
	fenergyinv = .075;
	fsinv = .05;
	document.getElementById("range1").innerHTML = (fcost).toFixed(2);
	document.getElementById("input1").value = 100;
	document.getElementById("range2").innerHTML = (fgdpg * 100).toFixed(1);
	document.getElementById("input2").value = fgdpg * 10000;
	document.getElementById("range3").innerHTML = (fgfcf * 100).toFixed(1);
	document.getElementById("input3").value = fgfcf * 10000;
	document.getElementById("range4").innerHTML = (fenergyinv * 100).toFixed(1);
	document.getElementById("input4").value = fenergyinv * 10000;
	document.getElementById("range5").innerHTML = (fsinv * 100).toFixed(1);
	document.getElementById("input5").value = fsinv * 10000;
	updateNumbers();
	redraw();
	}

function updateNumbers() {
	document.getElementById("range20").innerHTML = finalgdp;
	document.getElementById("range30").innerHTML = finalgfcf;
	document.getElementById("range40").innerHTML = finaleinv;
	document.getElementById("range50").innerHTML = finalsinv;
	document.getElementById("range21").innerHTML = startgdp;
	document.getElementById("range31").innerHTML = startgfcf;
	document.getElementById("range41").innerHTML = starteinv;
	document.getElementById("range51").innerHTML = startsinv;	
}	
	
redrawAll();