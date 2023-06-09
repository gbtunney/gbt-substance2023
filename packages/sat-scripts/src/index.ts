import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { program } from 'commander'
import yargs from 'yargs'
import { sbs_updater_options } from './schemas/optionsSchema.js'
import { resolveOptions } from './options.js'
import { loadAllFiles, loadAllInventory } from './loaders.js'
import { writeAllRawFile } from './raw.js'
import { z } from 'zod'

//todo: bug SO ANNOYING !!!!!!!  i had to symlink :(will not let me load a json it is so annoying.
import pkg from './package.json' assert { type: 'json' }

const hex = '#15034f'
clear()
/* * PRINT TITLE * */
console.log(
    chalk
        .bgHex('15034F')
        .magenta(figlet.textSync('sd-build-cli', { horizontalLayout: 'full' }))
)

program
    .version(pkg.version)
    .description(
        sbs_updater_options.description
            ? sbs_updater_options.description
            : 'error: no title'
    )

const getTypedSchema = <T extends z.ZodTypeAny>(schema: T): T => schema

const option_schema =
    getTypedSchema<typeof sbs_updater_options>(sbs_updater_options)

Object.entries(option_schema._def.schema._def.shape()).forEach(
    ([key, _schema]) => {
        program.option(
            `--${key}`,
            _schema.description ? _schema.description : 'sdffdfdf'
        )
    }
)

program.parse(process.argv)
const options = program.opts()

if (options['help']) {
    program.outputHelp()
} else {
    const getArgsObject = (value = process.argv) => yargs(value).argv
    const resolvedArgs = resolveOptions(getArgsObject()) //sbs_updater_options.safeParse(testme)

    if (resolvedArgs !== undefined) {
        if (resolvedArgs.raw) {
            writeAllRawFile(resolvedArgs)
        } else if (resolvedArgs.inventory) loadAllInventory(resolvedArgs)
        else loadAllFiles(resolvedArgs)
    }
}
if (!process.argv.slice(2).length) {
    // program.outputHelp()
}
