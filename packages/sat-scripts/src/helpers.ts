import path from 'path'
import { deepmergeCustom } from 'deepmerge-ts'
import { zod, Json } from '@snailicide/g-library'
import fs from 'fs'
const customDeepmerge = deepmergeCustom({
    mergeArrays: false,
})
export const getFilename = (_fullPath: string) =>
    path.basename(_fullPath, path.extname(_fullPath))
export const getExt = (_fullPath: string) =>
    path.extname(_fullPath).replace('.', '')

const convertImage = (imgPath: string) => {
    if (zod.filePathExists.safeParse(imgPath).success) {
        const resolvedPath = zod.filePathExists.parse(imgPath)

        // read image file
        fs.readFile(resolvedPath, (err, data) => {
            // error handle
            if (err) {
                throw err
            }
            // get image file extension name
            const extensionName = path.extname(resolvedPath)
            ////  const _bugg =      Buffer.from( )
            // convert image file to base64-encoded string//  const base64Image = new Buffer.from(data, 'binary').toString('base64');
            // combine all strings
            //private static toString(encoded: string): string {
            //return new Buffer(encoded, "base64").toString();
            //  }
            //    const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        })
    }
}
