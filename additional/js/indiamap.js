var map;
var india = new google.maps.LatLng(22.65, 82.4);

function changemap(value) {
	gdpvalue(value)
	genvalue(value)
}

function gdpvalue(value) {
	gdplayer.setOptions({
		styles: [{
			polygonOptions: {
				fillOpacity: .41 - (value / 100)
			}
		}]
	})
}

function genvalue(value) {
	genlayer.setOptions({
		styles: [{
			polygonOptions: {
				fillOpacity: value / 100
			}
		}]
	})
}

function wealth() {
	gdplayer.setMap(map)
	genlayer.setMap()
	}

function reset() {
	map.setCenter(india)
	map.setZoom(5)
	wealth()
	}
	
function energy() {
	gdplayer.setMap()
	genlayer.setMap(map)
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

	map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
	
	gdplayer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Shapes',
			from: '2431261'
			}
/*			,
			styles: [{
				polygonOptions: {
					fillOpacity: .3
				}
			}]
*/		});
	
	gdplayer.setMap(map);
	
	genlayer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Shapes',
			from: '2431251'   				
			}
/*			,
			styles: [{
				polygonOptions: {
					fillOpacity: .3
				}
			}]
*/		});
}

google.maps.event.addDomListener(window, 'load', initialize);