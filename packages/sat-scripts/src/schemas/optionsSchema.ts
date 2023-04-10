import { zod } from '@snailicide/g-library'
import { z } from 'zod'
import RA from 'ramda-adjunct'
import { getFullPath } from './../helpers.js'

export const sbs_updater_options = zod
    .object({
        rootDir: zod.filePathExists
            .default('.')
            .describe('<dir> Set Root Directory'),
        inputSBS: zod
            .string()
            .default('./examples/*.sbs')
            .describe(
                '<glob> Directory containing sbs (Relative to rootDir) \nNOTE: If using glob USE QUOTES OR WILL ONLY GET 1 file'
            ),
        resourceDir: zod
            .string()
            .optional() //.default( './examples/resources')
            .describe(
                '<glob> Directory containing resource folder to be copied (Relative to rootDir)'
            ),
        inputData: zod
            .string()
            .optional()
            .describe('<glob> Data file Directory (Relative)( todo: glob?)'),
        outDir: zod
            .string()
            .default('./dist')
            .describe('<dir> Output directory'),
        outFile: z
            .string()
            .optional()
            .refine(
                (val) => {
                    return RA.isString(val) ? !/\\|\//.test(val) : true
                },
                {
                    message:
                        "outFile can't contain filepath characters like file extension, / ,\\",
                }
            )
            .transform((val) => {
                /* this will identify a file/([a-zA-Z\d]|\d){3,}\.{1}([a-zA-Z0-9]{2,})$/ that can be split  */
                if (
                    val !== undefined &&
                    /\./.test(val) &&
                    /([a-zA-Z\d]|\d){3,}\.{1}([a-zA-Z0-9]{2,})$/.test(val)
                ) {
                    return val.split('.') !== undefined &&
                        val.split('.').length > 0
                        ? val.split('.')[0]
                        : val
                } else return val
            })
            .refine(
                (val) => {
                    return val === undefined || !/\./.test(val) ? true : false
                },
                {
                    message: "outFile can't contain '.' characters",
                }
            )
            .describe(
                '<string>The name of file to export.\nThis option will only be used with the --merge flag OR disregarded if more than 1 file in --inputSBS'
            ),
        overwrite: zod
            .boolean()
            .default(false)
            .describe('Overwrite output files if they already excist'),
        merge: zod
            .boolean()
            .default(false)
            .describe('Merge multiple sbs files into single.'),
        debug: zod
            .boolean()
            .default(false)
            .describe('Write json of transformed sbs'),
        raw: zod.boolean().default(false).describe('Dump raw xmltoJS data '),
        inventory: zod
            .boolean()
            .default(false)
            .describe('Dump raw file > (dictionary format) '),
        //logFilePath: zod.filePath.optional(),
        //descFilePath: zod.filePath.optional(),
    })
    .describe('An example CLI for SBS BUILDING')
    .transform((value) => {
        const resourceDir =
            value.resourceDir !== undefined
                ? zod.filePath.parse(
                      getFullPath(value.resourceDir, value.rootDir)
                  )
                : undefined
        return { ...value, resourceDir }
    })

export const resolved_sbs_updater_options = zod.object({
    rootDir: zod.filePathExists,
    inputSBS: zod.array(zod.filePathExists).nonempty(),
    inputData: zod.array(zod.filePath).optional(),
    outDir: zod.filePathExists,
    outFile: z.string().optional(),
    resourceDir: zod.filePath.optional(),
    merge: zod.optionalDefault(zod.boolean(), false),
    raw: zod.boolean(),
    overwrite: zod.boolean(),
    debug: zod.boolean(),
    inventory: zod.boolean(),
})

export type SBS_UpdaterOptions = z.infer<typeof sbs_updater_options>
export type ResolvedSBS_UpdaterOptions = z.infer<
    typeof resolved_sbs_updater_options
>
