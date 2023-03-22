import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import program from 'commander'
import yargs from 'yargs'
import {
    SBS_UpdaterOptions,
    sbs_updater_options,
} from './schemas/optionsSchema.js'
import { resolveOptions } from './options.js'
import { loadAllFiles } from './loaders.js'
clear()
console.log(
    chalk.red(figlet.textSync('sd-build-cli', { horizontalLayout: 'full' }))
)

program
    .version('0.0.3')
    .description('An example CLI for SBS BUILDING')
    .option('--rootDir <dir>', 'Root Directory')
    .option(
        '--inputSBS <glob>',
        'Directory containing sbs (Relative to rootDir) If using glob USE QUOTES OR WILL ONLY GET 1 file'
    )
    .option(
        '--inputData <glob>',
        'Data file Directory (Relative)( todo: glob?)'
    )
    .option('--outDir <type>', 'Output directory')
    .option('--overwrite', 'Overwrite output files if they already exccist')
    .option('--debug', 'Write json of transformed sbs')
    .option('-h', '--help', 'HELP')
    .parse(process.argv)

const options = program.opts()
if (options['help']) {
    program.outputHelp()
} else {
    const getArgsObject = (value = process.argv) => yargs(value).argv
    const resolvedArgs = resolveOptions(getArgsObject()) //sbs_updater_options.safeParse(testme)
    if (resolvedArgs !== undefined) loadAllFiles(resolvedArgs)
}
if (!process.argv.slice(2).length) {
    // program.outputHelp()
}
