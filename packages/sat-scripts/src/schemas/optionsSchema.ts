import { zod } from '@snailicide/g-library'
import { z } from 'zod'

export const sbs_updater_options = zod.object({
    rootDir: zod.optionalDefault(zod.filePathExists, '.'),
    inputSBS: zod.optionalDefault(zod.string(), './examples22/*.sbs'),
    inputData: zod.string().optional(), //zod.optionalDefault(zod.string(), './examples/*.json'),
    outDir: zod.optionalDefault(zod.string(), './dist'),
    overwrite: zod.optionalDefault(zod.boolean(), false),
    debug: zod.optionalDefault(zod.boolean(), false),
    raw: zod.optionalDefault(zod.boolean(), false),

    logFilePath: zod.filePath.optional(),
    descFilePath: zod.filePath.optional(),
})

export const resolved_sbs_updater_options = zod.object({
    rootDir: zod.filePathExists,
    inputSBS: zod.array(zod.filePathExists).nonempty(),
    inputData: zod.array(zod.filePath).optional(),
    outDir: zod.filePathExists,

    raw: zod.boolean(),
    overwrite: zod.boolean(),
    debug: zod.boolean(),

    logFilePath: zod.filePath.optional(),
    descFilePath: zod.filePath.optional(),
})

export type SBS_UpdaterOptions = z.infer<typeof sbs_updater_options>
export type ResolvedSBS_UpdaterOptions = z.infer<
    typeof resolved_sbs_updater_options
>
