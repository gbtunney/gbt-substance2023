import { xml2js } from 'xml-js'
import fs from 'fs'
import path from 'path'
import { PythonShell } from 'python-shell'
/*
@doc_source_code_enum
class AttributesEnum:
    """
    Enumeration of the different attributes available on a :class:`.SBSGraph` or a :class:`.SBSFunction`
    """
    Category     ,\
    Label        ,\
    Author       ,\
    AuthorURL    ,\
    Tags         ,\
    Description  ,\
    UserTags     ,\
    Icon         ,\
    HideInLibrary,\
    PhysicalSize ,\
    = range(10)

const sbsContent = fs.readFileSync(
    path.resolve(
        '/Users/gilliantunney/gh_repos/SNAILICIDE/gbt-substance2023/src/Sbs/plastic_leather_pattern/plastic_leather_pattern.sbs'
    ),
    'utf8'
)

const json = JSON.stringify(
    JSON.parse(JSON.stringify(xml2js(sbsContent, { compact: true }))),
    undefined,
    2
)*/
//fs.writeFileSync('./dist/gill.json', json)

//console.log(json);
export {}
//ts-node typescript zod
///Users/gilliantunney/Substance\ 12/Adobe\ Substance\ 3D\ Designer.app/Contents/MacOS/sbscooker
const CLI_TOOLS = [
    'sbscooker', //cook sbsar
    'sbsbaker', //bakes mesh maps
    'sbsrender', //renders channel outputs
    'sbsupdater', //updates files
] as const

import { z } from 'zod'

import { zod, node } from '@snailicide/g-library'
import yargs from 'yargs'
//make a schema for arguments:
const example_schema = zod.object({
    batchToolsPath: zod.optionalDefault(
        z.string(),
        '/Users/gilliantunney/Substance\\ 12/Adobe\\ Substance\\ 3D\\ Designer.app/Contents/MacOS/sbscooker'
    ),

    path: z.string(),
    packageDir: zod.optionalDefault(z.string(), '.'),
    outDir: zod.optionalDefault(z.string(), 'dist'),
    file_name: zod.optionalDefault(z.string(), 'src/Sbs/**/*.sbs'),
    overwrite: zod.optionalDefault(z.boolean(), false),
})
const _argObj = {
    //repository: "hhh",
    path: './../../themes/',
    name: '/shopify-theme-example',
}
type Args = z.infer<typeof example_schema>
const getParsedArguments = (schema: z.ZodSchema) => {
    const data = yargs(process.argv).argv

    if (schema.safeParse(data).success) {
        const result: Args = schema.parse(data)

        ///resolve package path .
        if (
            zod.filePathExists.safeParse(result.packageDir).success === true &&
            result.file_name !== undefined
        ) {
            const resolvedPackagePath = zod.filePathExists.parse(
                result.packageDir
            )
            const fileList = node.getFilePathArr(
                path.resolve(resolvedPackagePath, result.file_name)
            )
            //console.log("THE PACKAGE PATH!",fileList)

            const MODE: 'text' = 'text'

            const options = {
                mode: MODE,
                //   pythonPath: '/usr/bin/python',
                pythonOptions: ['-u', '-v'],
                // make sure you use an absolute path for scriptPath
                scriptPath:
                    '/Users/gilliantunney/gh_repos/SNAILICIDE/gbt-substance2023/packages/sat-scripts/src',
                args: ['Bruce Wayne', JSON.stringify(result)],
            }

            PythonShell.run('build.py', options).then((messages) => {
                // results is an array consisting of messages collected during execution
                console.log('results: %j', messages)
            })
        }
        const output_file_path = `${result.packageDir}/${result.outDir}`

        if (
            zod.filePathDoesNotExist.safeParse(result.packageDir).success ===
                true ||
            (zod.filePathExists.safeParse(result.packageDir).success === true &&
                result.overwrite === true)
        ) {
            console.log('safeto overwrite!!!!')
        }
    }
    /* const parsedData = node.getYArgs(schema, false, process.argv)

   console.log() process.argv


    if (parsedData !== undefined) {
        const data = parsedData
        const file_path = `${data.path}/${data.name}`

        //   console.log("access " ,file_path,zod.filePath(false).parse("http://") )
        if (
            zod.filePathDoesNotExist.safeParse(file_path).success === true ||
            (zod.filePathExists.safeParse(file_path).success === true &&
                data.overwrite === true)
        ) {
            let command = `mkdir ${file_path} ${file_path}/temp && cd ${file_path}/temp`
            command += ` && wget ${data.repository}/archive/${data.commitOrBranch}.zip`
            command += ` && unzip * && rm *.zip && mv **!/!* .. && cd .. && rm -rf temp`
            console.log(command)
        } else {
            console.log(
                'Error: file path already excists',
                zod.filePath.parse(file_path)
            )
        }
    } else {
        //use debug option to get error message
        node.getYArgs(schema, true, process.argv)
    }*/
}
getParsedArguments(example_schema)
export {}
