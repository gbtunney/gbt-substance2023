import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { program } from 'commander'
import yargs from 'yargs'
import { z } from 'zod'
import {
    svg_legend_options,
    resolveOptions,
    SVG_Legend_Options,
} from './options.js'
import { compileTemplates, loadAllImageFiles } from './loaders.js'

const hex = '#15034f'
clear()
/* * PRINT TITLE * */
console.log(
    chalk
        .bgHex('15034F')
        .magenta(figlet.textSync('svg-legend', { horizontalLayout: 'full' }))
)

program
    .version('0.0.0')
    .description(
        svg_legend_options.description
            ? svg_legend_options.description
            : 'error: no title'
    )

const getTypedSchema = <T extends z.ZodTypeAny>(schema: T): T => schema

const option_schema =
    getTypedSchema<typeof svg_legend_options>(svg_legend_options)

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
        console.log('the options are ', resolvedArgs)
        compileTemplates(resolvedArgs)
    }
}
if (!process.argv.slice(2).length) {
    // program.outputHelp()
}
