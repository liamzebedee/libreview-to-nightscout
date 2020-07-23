// Posts LibreLink data to Nightscout site.
// Requires NIGHTSCOUT_ENDPOINT_URL and NIGHTSCOUT_API_SECRET to be defined.
// Usage: 
//   NIGHTSCOUT_ENDPOINT_URL="" NIGHTSCOUT_API_TOKEN="" node ./scripts/upload-to-nightscout.js
// 

const [from,to] = [1595426400000, 1595340000000*2 ]
const data = require('../data/libreview-parsed.json')
const filteredData = data.filter(record => {
    return record.date >= from //&& record.date <= to
})

// Inspiration taken from Xdrip iOS-
// https://sourcegraph.com/github.com/JohanDegraeve/xdripswift/-/blob/xdrip/Managers/NightScout/BgReading+NightScout.swift#L12:14
function toNightscoutFormat(record) {
    return {
      "type": "sgv",
      "dateString": (new Date(record.date)).toString(),
      "date": record.date,
      sysTime: record.date,
      "sgv": record.sgv,
      noise: 1
    //   "direction": "string",
    //   "noise": 0,
    //   "filtered": 0,
    //   "unfiltered": 0,
    //   "rssi": 0
    }
}

const fetch = require('node-fetch');

(async () => {
    // Post to Nightscout
    const body = filteredData.map(toNightscoutFormat)
    
    const tokenAuth = `token=${process.env.NIGHTSCOUT_API_TOKEN}`
    const url = `${process.env.NIGHTSCOUT_ENDPOINT_URL}/api/v1/entries.json?${tokenAuth}`
    
    const response = await fetch(url, {
		method: 'post',
		body: JSON.stringify(body),
		headers: {
            'Content-Type': 'application/json'
        }
	})
	const json = await response.json()

	console.log(json)
})()