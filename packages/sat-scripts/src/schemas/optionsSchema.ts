import { zod, stringTransform } from '@snailicide/g-library'
import { z } from 'zod'
import RA from 'ramda-adjunct'

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
    outFile: z.string().optional(),
    merge: zod.optionalDefault(zod.boolean(), false),
    raw: zod.boolean(),
    overwrite: zod.boolean(),
    debug: zod.boolean(),
})

export type SBS_UpdaterOptions = z.infer<typeof sbs_updater_options>
export type ResolvedSBS_UpdaterOptions = z.infer<
    typeof resolved_sbs_updater_options
>
