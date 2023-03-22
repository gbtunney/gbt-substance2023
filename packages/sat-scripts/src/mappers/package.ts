import RA from 'ramda-adjunct'
import { SBS_Schema } from '../schemas/sbsSchema.js'
import { getMetaDict, getMetaDictToElement } from './meta.js'
import { getAttributeEntry } from './attributes.js'

type PackageDict = {
    desc?: string
    metadata: Record<string, string>
}
export const getPackageDict = (_package: SBS_Schema['package']) => {
    const tree_arr =
        _package.metadata && _package.metadata.treestr
            ? RA.ensureArray(_package.metadata.treestr)
            : []
    const desc =
        _package.desc !== undefined ? _package.desc._attributes.v : 'NOT SET'
    const newPackageObj: PackageDict = {
        metadata: getMetaDict(tree_arr),
        desc,
    }
    return newPackageObj
}

export const getPackageFinalEntry = (__package: any) => {
    //todo:do not coerce this
    const _package = __package as PackageDict
    const desc = _package.desc ? getAttributeEntry('desc', _package.desc) : {}
    const metadata = {
        metadata: {
            treestr: getMetaDictToElement(_package.metadata),
        },
    }
    return { ...desc, ...metadata }
}
