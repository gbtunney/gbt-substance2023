import { z } from 'zod'
import fs from 'fs'
import sizeOf from 'image-size'
import { node, stringUtils } from '@snailicide/g-library'
import { ResolvedOptions } from './options.js'
import { removeAnsi } from './helpers.js'
export type FilePathData = Exclude<
    ReturnType<typeof node.getFilePathObj>,
    undefined
>

export const imageSchema = z.object({
    width: z.number().int(),
    height: z.number().int(),
    data: z.string(),
})
export type ImageData = z.infer<typeof imageSchema> & {
    file: FilePathData
}
export const writeReadme = (help: string, options: ResolvedOptions) => {
    //const imageData: ImageData[] = loadAllImageFiles(options)
    const divider = '__________________________________________'
    const help_str = help
        .slice(help.indexOf(divider), help.length)
        .replace(divider, '')
    fs.writeFileSync(
        node.getFullPath(`REAMETEST.md`, options.rootDir),
        removeAnsi(`\`\`\`sh ${help_str}\n\`\`\``) // stringUtils.unescapeHtml(help)
    )
}
export const writeTemplate = (file: string, options: ResolvedOptions) => {
    console.log(
        'SUCCESS WRITING FILE TO ',
        node.getFullPath(`${<string>options.outFile}.svg`, options.outDir),
        '\n INPUT IMAGES ',
        options.inputImages.length,
        '\n',
        options.debug
            ? options.inputImages.map((item) => {
                  return item.absolute
              })
            : ''
    )
    fs.writeFileSync(
        node.getFullPath(`${<string>options.outFile}.svg`, options.outDir),
        stringUtils.unescapeHtml(file)
    )
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
export const loadAllImageFiles = (options: ResolvedOptions): ImageData[] => {
    const tg_ImgArray = (
        arr: (ImageData | undefined)[]
    ): arr is ImageData[] => {
        return !arr.some((_entry) => _entry === undefined)
    }
    const imgArr = options.inputImages
    const result = imgArr
        .map((_img_file_data) => {
            if (_img_file_data.excists === true) {
                const data = node.getImageBase64(
                    _img_file_data.absolute,
                    getImageExtensionLiteral(_img_file_data.extname)
                )
                const { width, height } = sizeOf(_img_file_data.absolute)
                console.log('WIDTH ', width, 'height', height)
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
