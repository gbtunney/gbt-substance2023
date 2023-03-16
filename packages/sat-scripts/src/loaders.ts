//load input files
import { js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import path from 'path'
import { zod, node } from '@snailicide/g-library'
import { deepmerge } from 'deepmerge-ts'
import type { ResolvedSBS_UpdaterOptions } from './schemas/optionsSchema.js'
import {
    replaceFileSchema,
    ReplaceFileSchema,
} from './schemas/replaceFileSchema.js'
import {
    SingleMetaSchema,
    SingleAttributeSchema,
    SBS_Schema,
    sbs_schema,
} from './schemas/sbsSchema.js'

import * as console from 'console'
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

        //TODO: EVENTUALLY SWITCH TO IMPORT

        const _tempDataJS = JSON.parse(
            fs.readFileSync(resolvedInputDataPath, 'utf8')
        )
        if (replaceFileSchema.safeParse(_tempDataJS).success) {
            const replaceDataJS: ReplaceFileSchema =
                replaceFileSchema.parse(_tempDataJS)
        } else {
            console.log('INVALID FILE ReplaceFileSchema', resolvedInputDataPath)
            console.log(replaceFileSchema.parse(_tempDataJS))
        }
        //VALIDARE DATA FILE
        /*  const {default: getSchema} = await import(
            path.resolve(`${module_path}/${_importableFilePath}`)
            )*/
        const inputXML = fs.readFileSync(resolvedInputSBSPath, 'utf8')

        const inputJS = xml2js(inputXML, { compact: true })

        //VALIDATE SBS
        if (sbs_schema.safeParse(inputJS).success) {
            const inputSBS: SBS_Schema = sbs_schema.parse(inputJS)
        } else {
            console.log('INVALID FILE SBS SCHEMA', resolvedInputSBSPath)
            console.log(sbs_schema.parse(inputJS))
        }

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

        if (
            (!zod.filePathExists.safeParse(outDir).success && !overwrite) ||
            overwrite
        ) {
            const outputPathDir = zod.filePath.parse(outDir)
            //*** get filename
            const testArr = node.getFilePathArr(resolvedInputSBSPath)
            if (testArr.length >= 1 && testArr[0]) {
                const fileObj = testArr[0]
                const outputFilePath = zod.filePath.parse(
                    `${outputPathDir}/${fileObj.basename}`
                )
                const outputJSONFilePath = zod.filePath.parse(
                    `${outputPathDir}/${fileObj.filename}.json`
                )
                fs.writeFileSync(outputFilePath, outputXML)
                console.log('FILE WRITTEN TO::: ', outputFilePath)

                /* * OUTPUT JS OBJECT * */
                if (debug === true) {
                    fs.writeFileSync(
                        outputJSONFilePath,
                        JSON.stringify(inputJS, undefined, 4)
                    )
                    console.log(
                        'outputJSPath FILE WRITTEN TO ',
                        path.resolve(outputJSONFilePath)
                    )
                }
            }
        } else {
            console.log(
                'FILE NOT WRITTEN TO ',
                outDir,
                '\ninputSBS:::',
                zod.filePath.parse(inputSBS),
                '\ninputData :::',
                zod.filePath.parse(inputData),
                'BECAUSE overwrite is set to false'
            )
        }
    } else {
        console.error(
            'inputSBS:::',
            zod.filePath.parse(inputSBS),
            'inputData ',
            zod.filePath.parse(inputData)
        )
    }
}

export default loadAllFiles
