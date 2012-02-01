// Data calculations
var gdpinput = 963404740694;
	gfcfinput = 294242862795;
	eiinput = 40144162229;
	siinput = 225818182;
	currentmw = 189;
	costinput = 3;
	cost = costinput;
	gdp = gdpinput;
	gfcf =  gfcfinput / gdp;
	energyinv = eiinput / gfcfinput;
	solarinv = siinput / eiinput;
	fgfcf = .35;
	fenergyinv = .2;
	fsolarinv = .25;
	fgdpg = 0.06;
	fcost = 1;
	years = 10;
	cgdpg = 0.088064;
	gdpgforecast = new Array();
	gdpforecast = new Array();
	gfcfforecast = new Array();
	eiforecast = new Array();
	siforecast = new Array();
	solarspending = new Array();
	costforecast = new Array();
	gdpforecast[0] = gdp;
	siforecast[0] = solarinv;
	pvinstalls = new Array();
	pvtotals = new Array();
	pvtotals[0] = 120;
	date = new Array();

function calc(){
	for (i=0;i<=years;i++)
	{
	date[i] = i+2010;
	gdpgforecast[i] = cgdpg - ((cgdpg - fgdpg)/years * i);
	};
	
	for (i=1;i<=years;i++)
	{
	gdpforecast[i] = gdpforecast[i-1] * (1 + gdpgforecast[i]);
	};
	
	for (i=0;i<=years;i++)
	{
	gfcfforecast[i] = gfcf - ((gfcf - fgfcf)/years * i);
	eiforecast[i] = energyinv - ((energyinv - fenergyinv)/years * i);
	siforecast[i+1] = siforecast[i] * (1 + fsolarinv);
	solarspending[i] = gdpforecast[i] * gfcfforecast[i] * eiforecast[i] * siforecast[i];
	costforecast[i] = cost - ((cost - fcost)/years * i);
	pvinstalls[i] = solarspending[i]/costforecast[i]/1000000;
	};
	
	for (i=1;i<=years;i++)
	{
	pvinstalls[i-1] = solarspending[i]/costforecast[i]/1000000;
	pvtotals[i] = Math.round(pvinstalls[i]+pvtotals[i-1]);
	};
		
	data = pvtotals
	}

calc()
    
	var w = 600,
		h = 400,
		p = 50;
	
	var chart = d3.select("#chart").append("svg")
		.attr("class", "chart")
		.attr("width", w)
		.attr("height", h)
		.style("padding", p)
		.append("g")
		.attr("transform", "translate(10,15)");

function draw() {	
	var x = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, h]);
	
	var y = d3.scale.ordinal()
		.domain(data)
		.rangeBands([0, w]);
	
	chart.selectAll(".rule")
		.data(x.ticks(10))
		.enter().append("line")
		.attr("x1", 0)
		.attr("x2", w)
		.attr("y1", function(d) {
		return x(d3.max(data)) - x(d) - 10;
		})
		.attr("y2", function(d) {
		return x(d3.max(data)) - x(d) - 10;
		})
		.style("stroke", "#ccc");
		
	chart.selectAll(".rule")
		.data(x.ticks(10))
		.enter().append("text")
		.attr("class", "rule")
		.attr("x", -7)
		.attr("y", function(d) {
		return x(d3.max(data)) - x(d);
		})
		.attr("dy", -7)
		.attr("text-anchor", "end")
		.text(function(d) { return Math.round(d*10)/10000 + " GW"; });
	
	chart.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", y)
		.attr("width", y.rangeBand())
/*		.attr("y", function(d) {
			return x(d3.max(data)) - 10;
			})
		.attr("height", 0)
		.transition()
		.duration(750)
*/		.attr("y", function(d) {
			return x(d3.max(data)) - x(d) - 10;
			})
		.attr("height", x);
	
	bars = chart.selectAll(".bar")
		.data(data)
		.enter().append("text")
		.attr("y", function(d) {
			return x(d3.max(data)) - x(d) - 20;
			})
		.attr("x", function(d) { return y(d) + y.rangeBand() / 2 + 6; })
		.attr("dx", -5) // padding-right
		.attr("dy", ".35em") // vertical-align: middle
		.attr("text-anchor", "middle") // text-align: middle
		.text(function(d) { return Math.round(d/100)/10 + " GW"; })
/*		.attr("opacity", 0)	
		.transition()
		.delay(500)
		.duration(750)
		.attr("opacity", 1)
*/		;
	
	chart.selectAll(".bar")
		.data(date)
		.enter().append("text")
		.attr("y", h)
		.attr("x", function(d) { return y(d) + y.rangeBand() / 2 + 6; })
		.attr("dx", -3) // padding-right
		.attr("dy", ".35em") // vertical-align: middle
		.attr("text-anchor", "middle") // text-align: right
		.text(String);
	
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

	chart.append("text")
		.attr("class", "title")
		.attr("x", 0)
		.attr("y", -30)
		.text("Total Solar Generation Capacity");
	};	

draw();	

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
	document.getElementById("range1").innerHTML=newValue/100;
	}

function redraw2(newValue) {
	fgdpg = newValue/10000;
	redraw();
	document.getElementById("range2").innerHTML=newValue/100;
	}

function redraw3(newValue) {
	fgfcf = newValue/10000;
	redraw();
	document.getElementById("range3").innerHTML=newValue/100;
	}

function redraw4(newValue) {
	fenergyinv = newValue/10000;
	redraw();
	document.getElementById("range4").innerHTML=newValue/100;
	}

function redraw5(newValue) {
	fsolarinv = newValue/10000;
	redraw();
	document.getElementById("range5").innerHTML=newValue/100;
	}

function redrawAll() {
	fcost = 1;
	fgdpg = 0.06;
	fgfcf = .35;
	fenergyinv = .2;
	fsolarinv = .25;
	document.getElementById("range1").innerHTML=1;
	document.getElementById("input1").value=100;
	document.getElementById("range2").innerHTML=6;
	document.getElementById("input2").value=600;
	document.getElementById("range3").innerHTML=35;
	document.getElementById("input3").value=3500;
	document.getElementById("range4").innerHTML=20;
	document.getElementById("input4").value=2000;
	document.getElementById("range5").innerHTML=25;
	document.getElementById("input5").value=2500;
	redraw();
	}