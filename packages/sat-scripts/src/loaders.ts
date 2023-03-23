//load input files
import { ElementCompact, js2xml, xml2js } from 'xml-js'
import fs from 'fs'
import { Json, zod } from '@snailicide/g-library'
import { getExt, getFilename } from './helpers.js'
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
import { deepmerge } from 'deepmerge-ts'
import { _flattenDataQueue } from './mappers/mergeAll.js'

export const loadAllFiles = (options: ResolvedSBS_UpdaterOptions) => {
    ///LOAD PACKAGE>
    options.inputSBS.forEach((_inputSBS) => {
        loadFile(
            _inputSBS,
            //todo: THIS ONLY ALLOWS 1 DATAFILE AT THE MOMENT
            options.inputData && options.inputData.length > 0
                ? options.inputData[0]
                : undefined,
            options.outDir,
            options.overwrite,
            options.debug
        )
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

        const thearr = sbs_schema.parse(inputJS)
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
    return {}
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

export const loadFile = async (
    inputSBS: string,
    inputData: string | undefined,
    _outDir: string,
    overwrite: boolean = true,
    debug: boolean = true
) => {
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
        clearFile.package.content.graph = []
        // const tempClearFILE = deepmerge( rawSBSData,{ package: { content :{ graph :[] }} })
        const tempFILE = deepmerge(clearFile, { package: FINALPACKAGE })
        debugger
        if (sbs_schema.safeParse(tempFILE).success) {
            const fileObj = JSON.parse(
                JSON.stringify(sbs_schema.parse(tempFILE))
            )
            const outDir = zod.filePath.parse(_outDir)
            writeFile(fileObj, packageKey, outDir, debug)
            writeXMLFile(fileObj, packageKey, outDir, overwrite)
        }
    }
}

/* * WRITE XML OUTPUT * */
export const writeXMLFile = (
    data: Json.Object,
    filename: string,
    _outDir: string,
    overwrite: boolean
) => {
    const outputFilePath = zod.filePath.parse(`${_outDir}/${filename}.sbs`)
    if (
        (!zod.filePathExists.safeParse(outputFilePath).success && !overwrite) ||
        overwrite
    ) {
        // writeXMLFile(outputFilePath, data)
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
        fs.writeFileSync(outputFilePath, outputXMLString)
        console.log('FILE WRITTEN TO::: ', outputFilePath)
    } else {
        console.log(
            'FILE NOT WRITTEN TO inputSBS:::',
            outputFilePath,
            'BECAUSE overwrite is set to false'
        )
    }
}
/* * WRITE DEBUG JSON OUTPUT * */
export const writeFile = (
    data: Json.Object,
    filename: string,
    _outDir: string,
    debug: boolean = true
) => {
    const outputJSONFilePath = zod.filePath.parse(`${_outDir}/${filename}.json`)
    if (debug === true) {
        fs.writeFileSync(outputJSONFilePath, JSON.stringify(data, undefined, 4))
        console.log(
            'DEBUG:::::: outputJSPath FILE WRITTEN TO ',
            outputJSONFilePath
        )
    }
}
export default loadAllFiles
