import json
import urllib2

json_countries = json.load(open('wbcountries.json'))

json_countries = json_countries[1]

lookup = {}

for country in json_countries:
	lookup[country['name']] = country['iso2Code']

json_geodata = json.load(open('africa.geojson'))

fake_gdp = 10

for feature in json_geodata['features']:
	try: 
		isocode = lookup[feature['country']['name']]
		gdpdata = json.load(urllib2.urlopen('http://api.worldbank.org/countries/' + isocode + '/indicators/NY.GDP.PCAP.CD?mrv=1&format=json'))
		feature['country']['gdp'] = gdpdata[1][0]['value']
		mobiledata = json.load(urllib2.urlopen('http://api.worldbank.org/countries/' + isocode + '/indicators/IT.CEL.SETS.P2?mrv=1&format=json'))
		feature['country']['mobiles'] = mobiledata[1][0]['value']
	except KeyError:
		pass
	except TypeError:
		pass

newdata = json.dumps(json_geodata, sort_keys=True, indent=4)

# Create a file object:
# in "write" mode
updatefile = open("update.geojson","w")

# Write all the lines at once:
updatefile.writelines(newdata)
    
updatefile.close()