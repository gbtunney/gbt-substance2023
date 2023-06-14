import { sbs_updater_options } from './schemas/optionsSchema.js'
import { loadAllFiles, loadAllInventory } from './loaders.js'
import { writeAllRawFile } from './raw.js'
import { z } from 'zod'
import { node, zod, tg } from '@snailicide/g-library'
import {
    AppAliasOption,
    initApp,
    unResolvedAppOptions,
    schema,
} from '@snailicide/cli-app'

const app_schema = schema.base_schema
    .merge(sbs_updater_options)
    .transform((value) => {
        if (value.resourceDir !== undefined) return { ...value, undefined }

        const resourceDir = schema.resolveSchema(
            zod.fsPathTypeExists('directory', value.rootDir),
            value.resourceDir
        )
        const inputSBS = zod.fsPathArray(value.rootDir).parse(value.inputSBS)
        const inputData = zod.fsPathArray(value.rootDir).parse(value.inputData)
        const outDir = schema.resolveSchema(
            zod.fsPathTypeExists('directory', value.rootDir),
            value.outDir
        )

        //  const outDir =     zod.fsPathTypeExists('directory', value.rootDir).parse(value.outDir)
        return { ...value, resourceDir, inputSBS, inputData, outDir }
    })

//todo: bug SO ANNOYING !!!!!!!  i had to symlink :(will not let me load a json it is so annoying.
import pkg from './package.json' assert { type: 'json' }
const alias: AppAliasOption<typeof app_schema> = {
    help: 'h',
    version: 'v',
    rootDir: 'r',
    outDir: 'o',
}
const OPTIONS: unResolvedAppOptions = {
    name: 'sd-build-cli',
    description: 'An example CLI for SBS BUILDING',
    version: pkg.version,
    // alias,
}
const initialize = () => {
    initApp(app_schema, initFunc, OPTIONS)
}
const initFunc = (args: z.output<typeof app_schema>) => {
    if (args !== undefined) {
        console.log('THE ARGS ARE!!', args)
        // renderAllSBSAR(args)
        /*  if (resolvedArgs !== undefined) {
        if (resolvedArgs.raw) {
            writeAllRawFile(resolvedArgs)
        } else if (resolvedArgs.inventory) loadAllInventory(resolvedArgs)
        else loadAllFiles(resolvedArgs)
    }*/
        // loadAllFiles(args)
    }
}
initialize()
export default initialize
