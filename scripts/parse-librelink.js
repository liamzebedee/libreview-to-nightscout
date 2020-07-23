// Parse LibreLink CSV.
// Usage: 
//   TZ=Australia/Brisbane DATA_CSV=../data/LiamZ_glucose_7-23-2020.csv node scripts/parse-librelink.js > data/libreview-parsed.json
// 

const fs = require('fs')
const path = require('path')

const csv = fs.readFileSync(path.join(__dirname, '/', process.env.DATA_CSV), { encoding: 'utf-8'})
const lines = csv.split('\n')
const title = lines[0]
const headings = lines[1].split(',')
const data = lines.slice(2)

const FIELDS = {
    Device: headings.indexOf('Device'),
    SerialNumber: headings.indexOf('Serial Number'),
    RecordType: headings.indexOf('Record Type'),
    HistoricGlucose: headings.indexOf('Historic Glucose mmol/L'),
    ScanGlucose: headings.indexOf('Scan Glucose mmol/L'),
    DeviceTimestamp: headings.indexOf('Device Timestamp'),
}

const RECORD_TYPE_ENUM = {
    HistoricGlucose: '0',
    ScanGlucose: '1'
}


const luxon = require('luxon')
const DateTime = luxon.DateTime

if(!process.env.TZ) throw new Error("TZ must be defined to parse the dates using the correct timezone.")
DateTime.defaultZoneName = process.env.TZ
const DATE_FORMAT = "MM-dd-yyyy t"

function convertMMolToMgDl(sgv) {
    return parseInt(sgv * 18.)
}

const res = data
.map(line => line.split(','))
.filter(fields => {
    return fields[FIELDS.RecordType] == RECORD_TYPE_ENUM.HistoricGlucose 
        || fields[FIELDS.RecordType] == RECORD_TYPE_ENUM.ScanGlucose
})
.map(fields => {
    let sgv

    const recordType = fields[FIELDS.RecordType]
    switch(recordType) {
        case RECORD_TYPE_ENUM.HistoricGlucose:
            sgv = fields[FIELDS.HistoricGlucose]
            break
        case RECORD_TYPE_ENUM.ScanGlucose:
            sgv = fields[FIELDS.ScanGlucose]
            break
        default:
            throw new Error(`Unexpected record type, ${recordType}`)
    }

    sgv = convertMMolToMgDl(parseFloat(sgv))
    
    const deviceTimestamp = fields[FIELDS.DeviceTimestamp]
    const datetime = DateTime.fromFormat(deviceTimestamp, DATE_FORMAT)

    const record = {
        sgv,
        date: datetime.toMillis(),
        device: `${fields[FIELDS.Device]} | ${fields[FIELDS.SerialNumber]}`
    }

    return record
})


console.log(JSON.stringify(res))