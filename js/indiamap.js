var map;
var india = new google.maps.LatLng(22.65, 82.4);

function HomeControl(controlDiv, map) {

// Set CSS styles for the DIV containing the control
// Setting padding to 5 px will offset the control
// from the edge of the map
controlDiv.style.padding = '5px';

// Set CSS for the control border
var GDPcontrolUI = document.createElement('DIV');
	GDPcontrolUI.style.backgroundColor = 'white';
	GDPcontrolUI.style.borderStyle = 'solid';
	GDPcontrolUI.style.borderWidth = '2px';
	GDPcontrolUI.style.cursor = 'pointer';
	GDPcontrolUI.style.textAlign = 'center';
	GDPcontrolUI.title = 'Click to toggle layers';
	controlDiv.appendChild(GDPcontrolUI);

// Set CSS for the control interior
var GDPcontrolText = document.createElement('DIV');
	GDPcontrolText.style.fontSize = '20px';
	GDPcontrolText.style.paddingLeft = '10px';
	GDPcontrolText.style.paddingRight = '10px';
	GDPcontrolText.style.paddingBottom = '4px';
	GDPcontrolText.style.paddingTop = '4px';
	GDPcontrolText.innerHTML = '<b>GDP per Capita</b>';
	GDPcontrolUI.appendChild(GDPcontrolText);

// Set CSS for the control border
var GENcontrolUI = document.createElement('DIV');
	GENcontrolUI.style.backgroundColor = 'white';
	GENcontrolUI.style.borderStyle = 'solid';
	GENcontrolUI.style.borderWidth = '2px';
	GENcontrolUI.style.cursor = 'pointer';
	GENcontrolUI.style.textAlign = 'center';
	GENcontrolUI.title = 'Click to toggle layers';
	controlDiv.appendChild(GENcontrolUI);

// Set CSS for Generation
var GENcontrolText = document.createElement('DIV');
	GENcontrolText.style.fontSize = '20px';
	GENcontrolText.style.paddingLeft = '10px';
	GENcontrolText.style.paddingRight = '10px';
	GENcontrolText.style.paddingBottom = '4px';
	GENcontrolText.style.paddingTop = '4px';
	GENcontrolText.innerHTML = 'KWh per Capita';
	GENcontrolUI.appendChild(GENcontrolText);

// Set CSS for the control border
var HOMEcontrolUI = document.createElement('DIV');
	HOMEcontrolUI.style.backgroundColor = 'black';
	HOMEcontrolUI.style.borderStyle = 'solid';
	HOMEcontrolUI.style.borderWidth = '2px';
	HOMEcontrolUI.style.cursor = 'pointer';
	HOMEcontrolUI.style.textAlign = 'center';
	HOMEcontrolUI.title = 'Click to reset the map';
	controlDiv.appendChild(HOMEcontrolUI);

// Set CSS for Generation
var HOMEcontrolText = document.createElement('DIV');
	HOMEcontrolText.style.fontSize = '20px';
	HOMEcontrolText.style.color = 'white';
	HOMEcontrolText.style.paddingLeft = '10px';
	HOMEcontrolText.style.paddingRight = '10px';
	HOMEcontrolText.style.paddingBottom = '4px';
	HOMEcontrolText.style.paddingTop = '4px';
	HOMEcontrolText.innerHTML = 'Restore Original Map';
	HOMEcontrolUI.appendChild(HOMEcontrolText);

// Setup the click event listeners: simply set the map to India
google.maps.event.addDomListener(HOMEcontrolUI, 'click', function() {
	map.setCenter(india)
	map.setZoom(5)
	gdplayer.setMap(map);
	genlayer.setMap();
	GDPcontrolText.innerHTML = '<b>GDP per Capita</b>';
	GENcontrolText.innerHTML = 'KWh per Capita';
	});

// Setup the click event listeners: simply set the map to India
google.maps.event.addDomListener(GDPcontrolUI, 'click', function() {
	gdplayer.setMap(map);
	genlayer.setMap();
	GDPcontrolText.innerHTML = '<b>GDP per Capita</b>';
	GENcontrolText.innerHTML = 'KWh per Capita';
	});

google.maps.event.addDomListener(GENcontrolUI, 'click', function() {
	gdplayer.setMap();
	genlayer.setMap(map);
	GDPcontrolText.innerHTML = 'GDP per Capita';
	GENcontrolText.innerHTML = '<b>KWh per Capita</b>';
	});
	}

function initialize() {
	var myOptions = {
		zoom: 5,
		center: india,
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		useStaticMap:false,
		scrollwheel:false,
		mapTypeControl:false,
		panControl:false,
		zoomControl:true,
		scaleControl:false,
		streetViewControl:false
		};

map = new google.maps.Map(document.getElementById('map_canvas'),
myOptions);

var homeControlDiv = document.createElement('DIV');
var homeControl = new HomeControl(homeControlDiv, map);

homeControlDiv.index = 1;
map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

gdplayer = new google.maps.FusionTablesLayer({
query: {
	select: 'Shapes',
	from: '2431261'
	}
	});

gdplayer.setMap(map);

genlayer = new google.maps.FusionTablesLayer({
query: {
	select: 'Shapes',
	from: '2431251'   				}
});

}    
google.maps.event.addDomListener(window, 'load', initialize);