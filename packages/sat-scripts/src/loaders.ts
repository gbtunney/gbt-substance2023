//load input files
import { Element, ElementCompact, js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import { zod } from '@snailicide/g-library'
import { getFilename } from './helpers.js'
import type { ResolvedSBS_UpdaterOptions } from './schemas/optionsSchema.js'
import { replaceFileSchema } from './schemas/replaceFileSchema.js'
import { SBS_Schema, sbs_schema } from './schemas/sbsSchema.js'
import {
    parseGraphByIdDictionary,
    parseGraphDictionaryToElement,
} from './parsers/graph.js'

export const loadAllFiles = (options: ResolvedSBS_UpdaterOptions) => {
    ///LOAD PACKAGE>
    options.inputSBS.forEach((_inputSBS) => {
        loadFile(
            _inputSBS,
            options.inputData.length > 0 ? options.inputData[0] : undefined,
            options.outDir
        )
    })
}
export const loadPackageJSON = () => {}

export const writeXMLFile = (
    outputFilePath: string,
    _element: ElementCompact | Element
) => {
    const resolvedOutputFilepath = zod.filePath.parse(outputFilePath)
    const outputXMLString: string = js2xml(_element, {
        compact: true,
        attributeValueFn: function (value) {
            return value
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(' & ', ' &amp; ')
                .replace(/&&/g, '&amp;&amp;')
        },
    })
    fs.writeFileSync(resolvedOutputFilepath, outputXMLString)
}
export const loadFile = async (
    inputSBS: string,
    inputData: string | undefined,
    outDir: string,
    overwrite: boolean = true,
    debug: boolean = true
) => {
    if (
        inputData !== undefined &&
        zod.filePathExists.safeParse(inputSBS).success &&
        zod.filePathExists.safeParse(inputData).success
    ) {
        //RESOLVED PATHS
        const resolvedInputSBSPath = zod.filePathExists.parse(inputSBS)
        const resolvedInputDataPath = zod.filePathExists.parse(inputData)
        const _tempDataJS = JSON.parse(
            fs.readFileSync(resolvedInputDataPath, 'utf8')
        )
        //TODO: EVENTUALLY SWITCH TO IMPORT
        //VALIDARE DATA FILE
        /*  const {default: getSchema} = await import(
            path.resolve(`${module_path}/${_importableFilePath}`)
            )*/
        const inputXML = fs.readFileSync(resolvedInputSBSPath, 'utf8')
        const inputJS = xml2js(inputXML, { compact: true })

        replaceFileSchema.parse(_tempDataJS)
        //VALIDATE SBS
        if (
            sbs_schema.safeParse(inputJS).success &&
            replaceFileSchema.safeParse(_tempDataJS).success
        ) {
            //PARSED VALUES
            const replaceDataJS = replaceFileSchema.parse(_tempDataJS)
            const inputSBS: SBS_Schema = sbs_schema.parse(inputJS)

            const inputPackage = inputSBS.package
            /// ResolvedGraphDictSchema ::::::index these by graph ID and {meta,attributes.
            if (
                (!zod.filePathExists.safeParse(outDir).success && !overwrite) ||
                overwrite
            ) {
                let initialGraphDict: any = inputPackage.content.graph
                if (inputPackage.content.graph) {
                    const parsedDict = parseGraphByIdDictionary(
                        inputPackage.content.graph
                    )
                    const initialGraphDict =
                        parseGraphDictionaryToElement(parsedDict)
                    //todo: FIX THIS..
                }
                const WRITE_ELEMENT = initialGraphDict
                const outputPathDir = zod.filePath.parse(outDir)
                //*** get filename
                /* * OUTPUT XML  * */
                const outputSBSFilename = getFilename(resolvedInputSBSPath)
                const outputFilePath = zod.filePath.parse(
                    `${outputPathDir}/${outputSBSFilename}.sbs`
                )
                writeXMLFile(outputFilePath, WRITE_ELEMENT)

                const outputJSONFilePath = zod.filePath.parse(
                    `${outputPathDir}/${outputSBSFilename}.json`
                )
                console.log('FILE WRITTEN TO::: ', outputFilePath)

                /* * OUTPUT JS OBJECT * */
                if (debug === true) {
                    fs.writeFileSync(
                        outputJSONFilePath,
                        JSON.stringify(WRITE_ELEMENT, undefined, 4)
                    )
                    console.log(
                        'DEBUG:::::: outputJSPath FILE WRITTEN TO ',
                        outputJSONFilePath
                    )
                }
            } else {
                console.log('INVALID FILE SBS SCHEMA', resolvedInputSBSPath)
                console.log(sbs_schema.parse(inputJS))
            }
            /*
              if (
                  (!zod.filePathExists.safeParse(outDir).success && !overwrite) ||
                  overwrite
              ) {  } else {
                  console.log(
                      'FILE NOT WRITTEN TO ',
                      outDir,
                      '\ninputSBS:::',
                      zod.filePath.parse(inputSBS),
                      '\ninputData :::',
                      zod.filePath.parse(inputData),
                      'BECAUSE overwrite is set to false'
                  )
              }*/
        } else {
            console.error(
                'inputSBS:::',
                zod.filePath.parse(inputSBS),
                'inputData ',
                zod.filePath.parse(inputData)
            )
        }
    }
}
export default loadAllFiles
