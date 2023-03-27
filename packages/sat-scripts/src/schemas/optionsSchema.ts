import { zod } from '@snailicide/g-library'
import { z } from 'zod'

export const sbs_updater_options = zod
    .object({
        rootDir: zod
            .optionalDefault(zod.filePathExists, '.')
            .describe('<dir> Set Root Directory'),
        inputSBS: zod
            .optionalDefault(zod.string(), './examples/*.sbs')
            .describe(
                '<glob> Directory containing sbs (Relative to rootDir) \nNOTE: If using glob USE QUOTES OR WILL ONLY GET 1 file'
            ),
        inputData: zod
            .string()
            .optional()
            .describe('<glob> Data file Directory (Relative)( todo: glob?)'),
        outDir: zod
            .optionalDefault(zod.string(), './dist')
            .describe('<dir> Output directory'),
        overwrite: zod
            .optionalDefault(zod.boolean(), false)
            .describe('Overwrite output files if they already excist'),
        merge: zod
            .optionalDefault(zod.boolean(), false)
            .describe('Merge multiple sbs files into single.'),
        debug: zod
            .optionalDefault(zod.boolean(), false)
            .describe('Write json of transformed sbs'),
        raw: zod
            .optionalDefault(zod.boolean(), false)
            .describe('Dump raw xmltoJS data '),
        //logFilePath: zod.filePath.optional(),
        //descFilePath: zod.filePath.optional(),
    })
    .describe('An example CLI for SBS BUILDING')

export const resolved_sbs_updater_options = zod.object({
    rootDir: zod.filePathExists,
    inputSBS: zod.array(zod.filePathExists).nonempty(),
    inputData: zod.array(zod.filePath).optional(),
    outDir: zod.filePathExists,

    merge: zod.optionalDefault(zod.boolean(), false),
    raw: zod.boolean(),
    overwrite: zod.boolean(),
    debug: zod.boolean(),
})

export type SBS_UpdaterOptions = z.infer<typeof sbs_updater_options>
export type ResolvedSBS_UpdaterOptions = z.infer<
    typeof resolved_sbs_updater_options
>
