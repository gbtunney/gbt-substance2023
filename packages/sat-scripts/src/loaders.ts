//load input files
import { Element, ElementCompact, js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import { zod } from '@snailicide/g-library'
import { getFilename } from './helpers.js'
import type { ResolvedSBS_UpdaterOptions } from './schemas/optionsSchema.js'
import {
    graphDictByIDSchema,
    replaceFileSchema,
} from './schemas/replaceFileSchema.js'
import { SBS_Schema, sbs_schema } from './schemas/sbsSchema.js'
import {
    mergeGraphDictToElement,
    parseGraphByIdDictionary,
} from './mappers/graph.js'
import { getPackageDict, getPackageFinalEntry } from './mappers/package.js'
import { deepmerge } from 'deepmerge-ts'
import { _flattenDataQueue } from './mappers/mergeAll.js'

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
            // const overwriteDataFile =    replaceFileSchema.parse(_tempDataJS)
            const replaceDataJS = replaceFileSchema.parse(_tempDataJS)
            const inputSBS: SBS_Schema = sbs_schema.parse(inputJS)

            const inputPackage = inputSBS.package
            ///get package metadict.
            /// ResolvedGraphDictSchema ::::::index these by graph ID and {meta,attributes.
            if (
                (!zod.filePathExists.safeParse(outDir).success && !overwrite) ||
                overwrite
            ) {
                let FINALPACKAGE: SBS_Schema['package'] = inputSBS.package
                /* * the package key * */
                const packageKey = getFilename(resolvedInputSBSPath)

                //inprogress
                const _packageEntry = {
                    [packageKey]: getPackageDict(inputPackage),
                }
                let pendingPackageMergeArr: Record<string, any>[] = [
                    _packageEntry,
                ]

                /* * replace package dict with file contents. * */
                pendingPackageMergeArr = [
                    ...pendingPackageMergeArr,
                    replaceDataJS.pkg
                        ? { [packageKey]: replaceDataJS.pkg }
                        : {},
                ]

                /* * package dictionary REAL * */
                const packageDictionary = _flattenDataQueue(
                    pendingPackageMergeArr
                )

                /* * pending graph array * */
                let graphArr: Record<string, any>[] = []

                if (inputPackage.content.graph) {
                    /* * Parse graphs into dictionary * */
                    const parsedDict = parseGraphByIdDictionary(
                        inputPackage.content.graph
                    )
                    /* * add to pending graph array * */
                    graphArr = [parsedDict]

                    /* * GRAPH KEYS * */
                    const graphKeys = Object.keys(parsedDict)

                    /* * See if the file has Graph defaults.  * */
                    if (replaceDataJS.gph_defaults) {
                        /* * push to end of pending graph array * */
                        graphArr = [
                            ...graphArr,
                            graphKeys.reduce((acc, _graphKey) => {
                                return {
                                    ...acc,
                                    [_graphKey]: replaceDataJS.gph_defaults,
                                }
                            }, {}),
                        ]
                    }

                    if (replaceDataJS.gph) {
                        const overrideGraphAttrs = Object.entries(
                            replaceDataJS.gph
                        ).reduce((acc, item) => {
                            const [key, _value] = item
                            /* * filter out non relevant keys * */
                            const filtered = graphKeys.filter((target_key) => {
                                if (target_key === key) return true
                                return false
                            })
                            if (filtered.length > 0)
                                return { ...acc, [key]: _value }
                            else return acc
                        }, {})

                        /* * push to end of  pending graph array * */
                        graphArr = [...graphArr, overrideGraphAttrs]
                    }
                }
                if (packageDictionary[packageKey]) {
                    /* * WIPE graph arr and metadata * */
                    const _tempPackageCleaned = {
                        ...inputPackage,
                        metadata: { treestr: [] },
                        content: { graph: [] },
                    }

                    /* * merge with new package attributes * */
                    FINALPACKAGE = {
                        ...deepmerge(
                            _tempPackageCleaned,
                            getPackageFinalEntry(packageDictionary[packageKey])
                        ),
                        content: { graph: [] },
                    }

                    /* * FLATTEN GRAPH ARRAY to DICT OBJECT * */
                    const flattenedGraphDict = _flattenDataQueue(graphArr)

                    /* * parse flattened graph dictionary * */
                    if (
                        graphDictByIDSchema.safeParse(flattenedGraphDict)
                            .success
                    ) {
                        /* * merge graph dict with origonal graph objects * */
                        const mergedGraphElements = mergeGraphDictToElement(
                            graphDictByIDSchema.parse(flattenedGraphDict),
                            inputPackage.content.graph
                        )

                        /* * finalize new package output * */
                        FINALPACKAGE = {
                            ...FINALPACKAGE,
                            content: { graph: mergedGraphElements },
                        }
                    }
                }
                /* * finalize new SBS output * */
                const WRITE_ELEMENT = { ...inputSBS, package: FINALPACKAGE }
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

const getPackageFile = () => {}
export default loadAllFiles
