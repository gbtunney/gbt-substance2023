//load input files
import { js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import path from 'path'

export {}

//LOAD FILE JSON and SBS BY KEY.
import { ReplaceFile } from './data'
import type _replacespec from './fileReplaceSpec.json'
import { deepmerge } from 'deepmerge-ts'

//const _replacespecNWQ  :ReplaceFile= _replacespec

const loadFile = async (
    _inputFilePath: string,
    _dataFilePath: string,
    _outputPath: string,
    overwrite: boolean = true,
    outputJSPath: undefined | string = undefined
) => {
    const inputFilePath = path.resolve(_inputFilePath)
    const dataFilePath = path.resolve(_dataFilePath)

    if (fs.existsSync(inputFilePath) && fs.existsSync(dataFilePath)) {
        const replaceDataJS = fs.readFileSync(dataFilePath, 'utf8')

        const inputXML = fs.readFileSync(inputFilePath, 'utf8')
        const inputJS = xml2js(inputXML, { compact: true })
        const outputJS = inputJS
        const outputXML: string = js2xml(inputJS, {
            compact: true,
            attributeValueFn: function (value) {
                return value
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(' & ', ' &amp; ')
                    .replace(/&&/g, '&amp;&amp;')
            },
        })
        /* * OUTPUT XML  * */

        if ((!fs.existsSync(_outputPath) && !overwrite) || overwrite) {
            const outputPath = path.resolve(_outputPath)
            fs.writeFileSync(outputPath, outputXML)
            console.log('FILE WRITTEN TO ', outputPath)
            /* * OUTPUT JS OBJECT * */
            if (outputJSPath !== undefined) {
                fs.writeFileSync(
                    path.resolve(outputJSPath),
                    JSON.stringify(inputJS)
                )
                console.log(
                    'outputJSPath FILE WRITTEN TO ',
                    path.resolve(outputJSPath)
                )
            }
        } else {
            console.log(
                'FILE NOT WRITTEN TO ',
                _outputPath,
                'BECAUSE overwrite is set to false'
            )
        }
    } else {
        console.error(
            'inputFilePath',
            fs.existsSync(inputFilePath),
            'dataFilePath ',
            fs.existsSync(dataFilePath)
        )
    }
}

loadFile(
    '/Users/gilliantunney/gh_repos/SNAILICIDE/gbt-substance2023/packages/value-processor-utilities/src/GBT_Value_Processor_Utilities.sbs',
    './examples/fileReplaceSpec.json',
    './examples/testSBS.sbs',
    true,
    './dist/dump.json'
)
