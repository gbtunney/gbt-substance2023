import { node, zod } from '@snailicide/g-library'
import { z } from 'zod'
import { fileURLToPath } from 'url'
import path from 'path'
import { schema } from '@snailicide/cli-app'

export const getWorkingDirectory = (url: string) => {
    return path.dirname(fileURLToPath(url))
}

export const svg_legend_options = zod
    .object({
        inputImages: zod
            .string()
            // .default('./tests/sample_image/*.{jpg,jpeg,png,gif,svg}')
            .describe(
                '<glob> Directory containing sbs (Relative to rootDir) \nNOTE: If using glob USE QUOTES OR WILL ONLY GET 1 file'
            ),
        outFile: zod
            .string()
            .default('svg-swatch')
            .describe('Output file name with no extension'),
        columns: zod.number().int().default(4).describe('Swatch grid columns'),
        patternTiling: z
            .number()
            .int()
            .min(1)
            .default(1)
            .describe('<int>Swatch pattern scale (controls swatch tiling)'),
        svgWidth: zod
            .number()
            .int()
            .default(1024)
            .describe('Viewbox width in pixels (integer)'),
        gutter: zod
            .number()
            .int()
            .default(30)
            .describe('gutter size in pixels (integer)'),
        delimiter: z
            .string()
            .default('_')
            .describe('<string> Filename delimiter'),
    })
    .describe('An example CLI for making svgs')
export type SVG_Legend_Options = z.infer<typeof svg_legend_options>

export const svg_legend_schema = schema.base_schema
    .merge(svg_legend_options)
    .transform((value) => {
        const inputImages =
            value.inputImages !== undefined
                ? zod.fsPathArray(value.rootDir).parse(value.inputImages)
                : value.inputImages
        const outDir =
            value.outDir !== undefined
                ? zod.filePath.parse(
                      node.getFullPath(value.outDir, value.rootDir)
                  )
                : value.inputImages

        return { ...value, inputImages, outDir }
    })

export type ResolvedOptions = z.output<typeof svg_legend_schema>
export type unResolvedOptions = z.input<typeof svg_legend_schema>
