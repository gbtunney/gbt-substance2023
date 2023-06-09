import { z } from 'zod'
import shell from 'shelljs'
import { node, zod } from '@snailicide/g-library'
import {
    AppAliasOption,
    initApp,
    unResolvedAppOptions,
    schema,
} from '@snailicide/cli-app'
const alias: AppAliasOption<typeof sbsrender_options> = {
    help: 'h',
    version: 'v',
    rootDir: 'r',
    outDir: 'o',
    inputs: 'i',
}
const OPTIONS: unResolvedAppOptions = {
    name: 'sbs-render',
    description:
        'A simple wrapper for SBSRender ...otherwise --inputs will not use a glob :(',
    version: '0.0.1',
    alias,
}
const initialize = () => {
    initApp(sbsrender_options, initFunc, OPTIONS)
}
export const sbsrender_options = schema.base_schema
    .merge(
        zod.object({
            sbsRender: zod.filePathExists.default(
                '/Users/gilliantunney/snailicide_helix/substance/Contents/MacOS/sbsrender'
            ),
            inputs: zod
                .string()
                .default('tests/_output/*.sbsar')
                .describe(
                    '<glob> Glob with sbsar (Relative to rootDir) \nNOTE: If using glob USE QUOTES OR WILL ONLY GET 1 file'
                ),
        })
    )
    .describe(
        'A simple wrapper for SBSRender ...otherwise --inputs will not use a glob :('
    )
    .transform((value) => {
        const inputs =
            value.inputs !== undefined
                ? zod.fsPathArray(value.rootDir).parse(value.inputs)
                : value.inputs
        const outDir = zod.filePath.parse(
            node.getFullPath(value.outDir, value.rootDir)
        )
        return { ...value, inputs, outDir }
    })
export type SBSRender_Options = z.infer<typeof sbsrender_options>

export const renderAllSBSAR = (options: SBSRender_Options) => {
    const result = options.inputs.forEach((_file) => {
        shell.exec(
            `${options.sbsRender} render --inputs ${_file.absolute} --output-path ${options.outDir}`
        )
    })
    return result
}
const initFunc = (args: z.output<typeof sbsrender_options>) => {
    if (args !== undefined) {
        renderAllSBSAR(args)
    }
}
initialize()
export default initialize
