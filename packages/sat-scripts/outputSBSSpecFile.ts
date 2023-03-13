import { xml2js, js2xml, json2xml, xml2json } from 'xml-js'
import fs from 'fs'
import path from 'path'
const sbsContent = fs.readFileSync(
    path.resolve(path.resolve('./examples/Example Attributes.sbs')),
    'utf8'
)

const json = xml2js(sbsContent, { compact: true })
//write spec
fs.writeFileSync('./examples/SBS_DataSpec.json', JSON.stringify(json))
