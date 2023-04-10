//load input files
import { js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import { z } from 'zod'
import RA from 'ramda-adjunct'
import { deepmerge } from 'deepmerge-ts'
import { Json, zod } from '@snailicide/g-library'
import { deepmergeReplaceArrays, getExt, getFilename } from './helpers.js'
import type { ResolvedSBS_UpdaterOptions } from './schemas/optionsSchema.js'
import {
    graphDictByIDSchema,
    replaceFileSchema,
    ReplaceFileSchema,
} from './schemas/replaceFileSchema.js'
import { SBS_Schema, sbs_schema } from './schemas/sbsSchema.js'
import {
    getGraphDictionary,
    getGraphMatcherDict,
    mergeGraphDictToElement,
} from './mappers/graph.js'
import {
    getPackageDictionaryByID,
    getPackageFinalEntry,
} from './mappers/package.js'
import { _flattenDataQueue } from './mappers/mergeAll.js'

//this file is a MESS.
export const loadAllFiles = async (options: ResolvedSBS_UpdaterOptions) => {
    const outDir = zod.filePath.parse(options.outDir)
    let outFilename: string | undefined = undefined

    if (options.merge === true) {
        outFilename =
            options.outFile !== undefined
                ? options.outFile
                : //use first file name
                  getFilename(options.inputSBS[0])
    } else {
        if (options.inputSBS.length === 1) {
            outFilename =
                options.outFile !== undefined
                    ? options.outFile
                    : getFilename(options.inputSBS[0])
        }
    }
    const dataToMerge = await options.inputSBS.map(async (_inputSBS) => {
        return await getData(
            _inputSBS,
            //todo: THIS ONLY ALLOWS 1 DATAFILE AT THE MOMENT
            options.inputData && options.inputData.length > 0
                ? options.inputData[0]
                : undefined
        )
    })

    Promise.all(dataToMerge)
        .catch(() => {
            console.log('busted', dataToMerge)
        })
        .then((_data) => {
            if (options.merge) {
                if (RA.isArray(_data)) {
                    const _flattened = _data.reduce((acc, value) => {
                        if (value !== undefined) {
                            const mergeResult = deepmerge(acc, value)
                            if (sbs_schema.safeParse(mergeResult).success) {
                                return sbs_schema.parse(mergeResult)
                            }
                        }
                        console.log('warn: data is undefined')
                        return acc
                    }, {})
                    const fileName =
                        outFilename !== undefined
                            ? outFilename
                            : 'merged_something_is_wrong'

                    //todo: replace this with name flag??
                    const outputJSONFilePath = zod.filePath.parse(
                        `${outDir}/${fileName}.json`
                    )
                    const outputFilePath = zod.filePath.parse(
                        `${outDir}/${fileName}.sbs`
                    )
                    writeFile(_flattened, outputJSONFilePath, options.debug)
                    writeXMLFile(_flattened, outputFilePath, options.overwrite)
                }
            } else {
                if (RA.isArray(_data)) {
                    _data.forEach((_dataToWrite, index) => {
                        if (
                            sbs_schema.safeParse(_dataToWrite).success &&
                            options.inputSBS[index] !== undefined
                        ) {
                            const fileName =
                                outFilename !== undefined
                                    ? outFilename
                                    : getFilename(
                                          options.inputSBS[index] as string
                                      )

                            //todo:fix someday
                            const newfilecontent = JSON.parse(
                                JSON.stringify(sbs_schema.parse(_dataToWrite))
                            )

                            const outputJSONFilePath = zod.filePath.parse(
                                `${outDir}/${fileName}.json`
                            )
                            writeFile(
                                newfilecontent,
                                outputJSONFilePath,
                                options.debug
                            )
                            const outputFilePath = zod.filePath.parse(
                                `${outDir}/${fileName}.sbs`
                            )
                            writeXMLFile(
                                newfilecontent,
                                outputFilePath,
                                options.overwrite
                            )
                        }
                    })
                }
            }
        })
}

/* * Get InputData Data * */
export const getReplaceData = async (
    inputDataPath: string
): Promise<ReplaceFileSchema | undefined> => {
    if (zod.filePathExists.safeParse(inputDataPath).success) {
        const loadedData = await loadReplaceData(
            zod.filePathExists.parse(inputDataPath)
        )
        if (replaceFileSchema.safeParse(loadedData).success) {
            return replaceFileSchema.parse(loadedData)
        }
        return undefined
    }
    {
        console.error(
            'ERROR :: inputDataPath FILE NOT FOUND',
            zod.filePath.parse(inputDataPath)
        )
    }
    return undefined
}

/* * Get SBSData * */
export const getSBSData = (inputSBS: string): SBS_Schema | undefined => {
    if (zod.filePathExists.safeParse(inputSBS).success) {
        const resolvedInputSBSPath = zod.filePathExists.parse(inputSBS)
        const inputXML = fs.readFileSync(resolvedInputSBSPath, 'utf8')
        const inputJS = xml2js(inputXML, { compact: true })
        if (sbs_schema.safeParse(inputJS).success) {
            return sbs_schema.parse(inputJS)
        }
        return undefined
    }
    return undefined
}

const loadReplaceData = async (
    resolvedInputDataPath: string
): Promise<Json.Object> => {
    if (getExt(resolvedInputDataPath) === 'json') {
        return JSON.parse(fs.readFileSync(resolvedInputDataPath, 'utf8'))
    } else {
        const { default: tempJS } = await import(resolvedInputDataPath)
        return tempJS !== undefined ? JSON.parse(JSON.stringify(tempJS)) : {}
    }
}

const getDefaultReplaceData = (key: string): ReplaceFileSchema => {
    const defaultData = {
        pkg: {
            metadata: {
                filename: key,
            },
        },
        gph: {
            '*': {
                metadata: {
                    filename: key,
                },
            },
        },
    }
    if (replaceFileSchema.safeParse(defaultData).success) {
        return replaceFileSchema.parse(defaultData)
    } else {
        console.error('Default data is malformed', defaultData)
        return replaceFileSchema.parse({})
    }
}

///todo: this needs to be moved somewhere data related
export const getData = async (
    inputSBS: string,
    inputData: string | undefined
): Promise<z.infer<typeof sbs_schema> | undefined> => {
    const tempInputSBS = getSBSData(inputSBS)

    if (tempInputSBS !== undefined) {
        const _tempReplaceData =
            inputData !== undefined
                ? await getReplaceData(inputData)
                : undefined

        const rawSBSData: SBS_Schema = tempInputSBS
        const packageKey = getFilename(inputSBS)
        const _tempPackageDictionary = getPackageDictionaryByID(
            packageKey,
            rawSBSData
        )

        const replaceData =
            _tempReplaceData !== undefined ? _tempReplaceData : {}
        const defaultData = getDefaultReplaceData(packageKey)

        const pendingPackageMergeArr: Record<string, any>[] = [
            _tempPackageDictionary,
            { [packageKey]: replaceData.pkg ? replaceData.pkg : {} },
            { [packageKey]: defaultData.pkg ? defaultData.pkg : {} },
        ]

        const tempPackageDict = _flattenDataQueue(pendingPackageMergeArr)
        const packageDictionary = tempPackageDict[packageKey]
            ? tempPackageDict[packageKey]
            : {}
        const _tempPackageCleaned = {
            ...rawSBSData.package,
            metadata: { treestr: [] },
            content: { graph: [] },
        }

        /* * merge with new package attributes * */
        let FINALPACKAGE: SBS_Schema['package'] = {
            ...deepmerge(
                _tempPackageCleaned,
                getPackageFinalEntry(packageDictionary)
            ),
            content: { graph: [] },
        }

        const sbsGraphDictionary = getGraphDictionary(
            rawSBSData.package.content.graph
        )
        const graphKeys = Object.keys(sbsGraphDictionary)

        const pendingGraphMergeArr: Record<string, any>[] = [
            sbsGraphDictionary,
            getGraphMatcherDict(graphKeys, replaceData.gph),
            //the defaults for the graphs
            getGraphMatcherDict(graphKeys, defaultData.gph),
        ]
        const graphDictionary = _flattenDataQueue(pendingGraphMergeArr)
        if (graphDictByIDSchema.safeParse(graphDictionary).success) {
            const mergedGraphElements = mergeGraphDictToElement(
                graphDictByIDSchema.parse(graphDictionary),
                rawSBSData.package.content.graph
            )
            FINALPACKAGE = {
                ...FINALPACKAGE,
                content: { graph: mergedGraphElements },
            }
        }
        let clearFile = rawSBSData
        // clearFile.package.content.graph = []
        const tempFILE = deepmergeReplaceArrays(clearFile, {
            package: FINALPACKAGE,
        })
        if (sbs_schema.safeParse(tempFILE).success) {
            return sbs_schema.parse(tempFILE)
        }
    }
    return undefined
}

/* * WRITE XML OUTPUT * */
export const writeXMLFile = (
    data: Json.Object,
    filepath: string,
    overwrite: boolean
) => {
    if (
        (!zod.filePathExists.safeParse(filepath).success && !overwrite) ||
        overwrite
    ) {
        const outputXMLString: string = js2xml(data, {
            compact: true,
            attributeValueFn: function (value) {
                return value
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(' & ', ' &amp; ')
                    .replace(/&&/g, '&amp;&amp;')
            },
        })
        fs.writeFileSync(filepath, outputXMLString)
        console.log('FILE WRITTEN TO::: ', filepath)
    } else {
        console.log(
            'FILE NOT WRITTEN TO inputSBS:::',
            filepath,
            'BECAUSE overwrite is set to false'
        )
    }
}

export const loadAllInventory = (
    options: ResolvedSBS_UpdaterOptions,
    filename = 'inventory'
) => {
    const dataToMerge = options.inputSBS.map((_inputSBS) => {
        return getInventoryData(_inputSBS)
    })
    const outDir = zod.filePath.parse(options.outDir)
    //todo: replace this with name flag??
    const outputJSONFilePath = zod.filePath.parse(`${outDir}/${filename}.json`)
    writeFile(
        JSON.parse(JSON.stringify(dataToMerge, undefined, 4)),
        outputJSONFilePath
    )
}
export const getInventoryData = (_inputSBS: string) => {
    //get resolved raw data
    const inputSBS: SBS_Schema | undefined = getSBSData(_inputSBS)
    if (inputSBS !== undefined) {
        const packageKey = getFilename(_inputSBS) ///the file mame
        const _tempPackageDictionary = getPackageDictionaryByID(
            packageKey,
            inputSBS
        )
        const sbsGraphDictionary = getGraphDictionary(
            inputSBS.package.content.graph
        )
        return { ..._tempPackageDictionary, graphs: sbsGraphDictionary }
    }
    return undefined
}

/* * WRITE DEBUG JSON OUTPUT * */
export const writeFile = (
    data: Json.Object,
    filepath: string,
    debug: boolean = true
) => {
    if (debug === true) {
        fs.writeFileSync(filepath, JSON.stringify(data, undefined, 4))
        console.log('DEBUG:::::: outputJSPath FILE WRITTEN TO ', filepath)
    }
}
export default loadAllFiles
