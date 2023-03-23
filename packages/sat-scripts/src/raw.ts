import { ElementCompact, xml2js } from 'xml-js'
import fs from 'fs'
import { ResolvedSBS_UpdaterOptions } from './schemas/optionsSchema.js'
import { getFilename } from './helpers.js'
import { zod } from '@snailicide/g-library'
import { writeFile, writeXMLFile } from './loaders.js'

export const writeAllRawFile = (options: ResolvedSBS_UpdaterOptions) => {
    options.inputSBS.forEach((_inputSBS) => {
        writeRawFile(_inputSBS, options.outDir)
    })
}
export const writeRawFile = async (inputSBS: string, _outDir: string) => {
    const tempInputSBS = getRawSBSData(inputSBS)

    if (tempInputSBS !== undefined) {
        const fileObj = JSON.parse(JSON.stringify(tempInputSBS))
        debugger
        const outFileName = `raw_${getFilename(inputSBS)}`
        const outDir = zod.filePath.parse(_outDir)
        writeFile(fileObj, outFileName, outDir, true)
        writeXMLFile(fileObj, outFileName, outDir, true)
    }
}

export const getRawSBSData = (
    inputSBS: string
): Element | ElementCompact | undefined => {
    if (zod.filePathExists.safeParse(inputSBS).success) {
        const resolvedInputSBSPath = zod.filePathExists.parse(inputSBS)
        const inputXML = fs.readFileSync(resolvedInputSBSPath, 'utf8')
        const inputJS = xml2js(inputXML, { compact: true })
        return inputJS
    }
    return undefined
}
