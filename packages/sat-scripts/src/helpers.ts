import path from 'path'
import { deepmergeCustom } from 'deepmerge-ts'

const customDeepmerge = deepmergeCustom({
    mergeArrays: false,
})
export const getFilename = (_fullPath: string) =>
    path.basename(_fullPath, path.extname(_fullPath))
