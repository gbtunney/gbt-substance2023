///resolve ARGS!! like in vite plugins/
import { node, zod } from '@snailicide/g-library'
import { z } from 'zod'
import isGlob from 'is-glob'
import shell from 'shelljs'
import {
    sbs_updater_options,
    resolved_sbs_updater_options,
    ResolvedSBS_UpdaterOptions,
} from './schemas/optionsSchema.js'
import { getFullPath } from './helpers.js'
export const resolveOptions = (
    options: any //SBS_UpdaterOptions
): ResolvedSBS_UpdaterOptions | undefined => {
    if (sbs_updater_options.safeParse(options).success) {
        const parsedData: z.infer<typeof sbs_updater_options> =
            sbs_updater_options.parse(options)
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
                ? isGlob(parsedData.inputData)
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
                    : {
                          inputData: [
                              getFullPath(
                                  parsedData.inputData,
                                  parsedData.rootDir
                              ),
                          ],
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

        /* * write outdir if it doesnt excist * */
        if (!zod.filePathExists.safeParse(mergedData.outDir).success) {
            shell.mkdir('-p', zod.filePath.parse(mergedData.outDir))
        }
        /* * copy resaource path if valid.  * */
        if (
            mergedData.resourceDir !== undefined &&
            zod.filePathExists.safeParse(mergedData.resourceDir).success
        ) {
            const outDir = zod.filePath.parse(mergedData.outDir)
            console.error(
                'RESOURCES COPIED FROM :: \n',
                mergedData.resourceDir,
                'to',
                outDir
            )
            shell.cp('-R', mergedData.resourceDir, zod.filePath.parse(outDir))
        }
        resolved_sbs_updater_options.parse(mergedData)
        if (
            resolved_sbs_updater_options.safeParse(mergedData).success === false
        ) {
        }
        return resolved_sbs_updater_options.safeParse(mergedData).success
            ? resolved_sbs_updater_options.parse(mergedData)
            : undefined
    } else {
        sbs_updater_options.parse(options)
    }
    return undefined
}

export default resolveOptions
