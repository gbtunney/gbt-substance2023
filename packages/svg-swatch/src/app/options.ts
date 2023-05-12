import { zod, node } from '@snailicide/g-library'
import { z } from 'zod'
import { fileURLToPath } from 'url'
import path from 'path'
export const getWorkingDirectory = (url: string) => {
    return path.dirname(fileURLToPath(url))
}
export const svg_legend_options = zod
    .object({
        rootDir: zod.filePathExists
            .default('.')
            .describe('<dir> Set Root Directory'),
        inputImages: zod
            .string()
            .default('./sample_image/*')
            .describe(
                '<glob> Directory containing sbs (Relative to rootDir) \nNOTE: If using glob USE QUOTES OR WILL ONLY GET 1 file'
            ),
        inputTemplates: zod
            .string()
            .default(`${getWorkingDirectory(import.meta.url)}/../templates/*`)
            .describe(
                '<glob> Directory containing handlebars templates (Relative to rootDir)'
            ),
        outDir: zod
            .string()
            .default('./dist')
            .describe('<dir> Output directory'),
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
    .describe('An example CLI for making svgs')
    .transform((value) => {
        const inputImages = zod.filePath.parse(
            node.getFullPath(value.inputImages, value.rootDir)
        )
        const outDir = zod.filePath.parse(
            node.getFullPath(value.outDir, value.rootDir)
        )
        return { ...value, inputImages, outDir }
        /*const resourceDir =
            value.resourceDir !== undefined
                ? zod.filePath.parse(
                    getFullPath(value.resourceDir, value.rootDir)
                )
                : undefined
        return { ...value, resourceDir }*/
    })
export type SVG_Legend_Options = z.infer<typeof svg_legend_options>
export const resolveOptions = (
    options: any //SBS_UpdaterOptions
) => {
    if (svg_legend_options.safeParse(options).success) {
        console.log('RESOLVED!@!!', svg_legend_options.parse(options))
        return svg_legend_options.parse(options)
    }
    return undefined
}
