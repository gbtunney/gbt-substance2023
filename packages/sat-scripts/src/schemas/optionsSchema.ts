import { zod } from '@snailicide/g-library'
import { z } from 'zod'

export const sbs_updater_options = zod.object({
    rootDir: zod.optionalDefault(zod.filePathExists, '.'),
    inputSBS: zod.optionalDefault(zod.filePath, './src'),
    inputData: zod.optionalDefault(zod.filePath, './src'),
    outDir: zod.optionalDefault(zod.filePath, './dist'),
    overwrite: zod.optionalDefault(zod.boolean(), false),
    debugSBS: zod.optionalDefault(zod.boolean(), false),

    logFilePath: zod.filePath.optional(),
    descFilePath: zod.filePath.optional(),
})

export const resolved_sbs_updater_options = zod.object({
    rootDir: zod.filePathExists,
    inputSBS: zod.filePath,
    inputData: zod.filePath,
    outDir: zod.filePath,

    overwrite: zod.boolean(),
    debugSBS: zod.boolean(),

    logFilePath: zod.filePath.optional(),
    descFilePath: zod.filePath.optional(),
})

export type SBS_UpdaterOptions = z.infer<typeof sbs_updater_options>
export type ResolvedSBS_UpdaterOptions = z.infer<
    typeof resolved_sbs_updater_options
>
