import { node, zod, numeric } from '@snailicide/g-library'
import { z } from 'zod'
import handlebars from 'handlebars'
import fs from 'fs'
import sizeOf from 'image-size'
import { SVG_Legend_Options } from './options.js'
type FilePathData = Exclude<ReturnType<typeof node.getFilePathObj>, undefined>

export const imageSchema = z.object({
    width: z.number().int(),
    height: z.number().int(),
    data: z.string(),
})
type ImageData = z.infer<typeof imageSchema> & {
    file: FilePathData
}

type TemplateData = {
    data: string
    file: FilePathData
}
/**
 * This TypeScript function compiles templates using Handlebars and loads all
 * template files.
 *
 * @param {SVG_Legend_Options} options - The `options` parameter is an object of
 *   type `SVG_Legend_Options` which contains various configuration options for
 *   compiling SVG templates and generating legend images.
 * @returns The `compileTemplates` function and the `loadAllTemplates` function
 *   are being exported.
 */
export const compileTemplates = (options: SVG_Legend_Options) => {
    handlebars.registerHelper(
        'math',
        function (lvalue: number, dimension: number) {
            return lvalue === 0 ? 0 : lvalue * dimension
        }
    )
    handlebars.registerHelper(
        'split_name',
        function (str: string, unit: number | string = 2) {
            const test = numeric.parseToNumeric(unit)
            const stringarr = str.split('_')
            let _unit = 2
            if (test !== undefined) _unit = test
            const slided = stringarr.slice(
                stringarr.length - _unit,
                stringarr.length
            )
            return slided.join('_')
        }
    )

    const templateContents: TemplateData[] = loadAllTemplates(options)
    const imageData: ImageData[] = loadAllImageFiles(options)
    templateContents.forEach((_template) => {
        const result = handlebars.compile(_template.data)({ imageData })
        fs.writeFileSync(
            node.getFullPath(_template.file.basename, options.outDir),
            result
        )
    })
}
export const loadAllTemplates = (
    options: SVG_Legend_Options
): TemplateData[] => {
    const templateGlob = zod.filePath.parse(options.inputTemplates)
    const fileArr = node.getFilePathArr(templateGlob)
    const result: TemplateData[] = fileArr.map((_file) => {
        const templateFileContents = fs.readFileSync(_file.absolute, 'utf8')
        return {
            data: templateFileContents,
            file: _file,
        }
    })
    return result
}

export const getImageExtensionLiteral = (
    value: string
): 'jpeg' | 'png' | 'gif' | 'svg' | 'bmp' => {
    if (value === 'jpeg') return 'jpeg'
    else if (value === 'gif') return 'gif'
    else if (value === 'svg') return 'svg'
    else if (value === 'bmp') return 'bmp'
    else return 'png'
}
export const loadAllImageFiles = (options: SVG_Legend_Options): ImageData[] => {
    const tg_ImgArray = (
        arr: (ImageData | undefined)[]
    ): arr is ImageData[] => {
        return !arr.some((_entry) => _entry === undefined)
    }

    const imgArr = node.getFilePathArr(options.inputImages)
    const result = imgArr
        .map((_img_file_data) => {
            if (_img_file_data.excists === true) {
                const data = node.getImageBase64(
                    _img_file_data.absolute,
                    getImageExtensionLiteral(_img_file_data.extname)
                )
                const { width, height } = sizeOf(_img_file_data.absolute)
                const imgResult = {
                    data,
                    width,
                    height,
                }

                if (imageSchema.safeParse(imgResult).success) {
                    const _imgResult: ImageData = {
                        ...imageSchema.parse(imgResult),
                        file: _img_file_data,
                    }
                    return _imgResult
                }
            }
            return undefined
        })
        .filter((item) => item !== undefined)
    if (tg_ImgArray(result)) return result
    else return []
}
