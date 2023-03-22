///resolve ARGS!! like in vite plugins/
import {
    sbs_updater_options,
    resolved_sbs_updater_options,
} from './schemas/optionsSchema.js'
import type {
    SBS_UpdaterOptions,
    ResolvedSBS_UpdaterOptions,
} from './schemas/optionsSchema'
import { node } from '@snailicide/g-library'

export const resolveOptions = (
    options: any //SBS_UpdaterOptions
): ResolvedSBS_UpdaterOptions | undefined => {
    if (sbs_updater_options.safeParse(options).success) {
        const parsedData = sbs_updater_options.parse(options)
        const concatFilePaths = {
            inputSBS:
                parsedData.inputSBS !== undefined
                    ? node
                          .getFilePathArr(
                              getFullPath(
                                  parsedData.inputSBS,
                                  parsedData.rootDir
                              )
                          )
                          .map((_file) => _file.absolute)
                    : [],

            ...(parsedData.inputData && parsedData.inputData !== undefined
                ? {
                      inputData: node
                          .getFilePathArr(
                              getFullPath(
                                  parsedData.inputData,
                                  parsedData.rootDir
                              )
                          )
                          .map((_file) => _file.absolute),
                  }
                : {}),
            ...(parsedData.outDir
                ? {
                      outDir: getFullPath(
                          parsedData.outDir,
                          parsedData.rootDir
                      ),
                  }
                : {}),
        }
        const mergedData = { ...parsedData, ...concatFilePaths }
        if (
            resolved_sbs_updater_options.safeParse(mergedData).success === false
        ) {
            console.error('OPTION PARSING ERROR:: \n', mergedData)
        }
        return resolved_sbs_updater_options.safeParse(mergedData).success
            ? resolved_sbs_updater_options.parse(mergedData)
            : undefined
    } else {
        sbs_updater_options.parse(options)
    }
    return undefined
}
const getFullPath = (_value: string, _root: string | undefined) => {
    return _root !== undefined ? `${_root}/${_value}` : _value
}
export default resolveOptions
