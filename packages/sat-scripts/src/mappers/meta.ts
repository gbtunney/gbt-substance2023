import { z } from 'zod'
import {
    metaTreeSchema,
    singleMetaSchema,
    SingleMetaSchema,
} from '../schemas/sbsSchema.js'

export const getMetaDict = (
    _tree: z.infer<typeof metaTreeSchema>
): Record<string, string> => {
    return _tree.reduce((acc, _item) => {
        const key: string = _item.name._attributes.v
        const value: string = _item.value._attributes.v
        return { ...acc, [key]: value }
    }, {})
}

export const getMetaEntry = (key: string, value: string): SingleMetaSchema => {
    return {
        name: { _attributes: { v: key } },
        value: { _attributes: { v: value } },
    }
}

export const getMetaDictToElement = (
    dict: Record<string, string>
): z.infer<typeof metaTreeSchema> => {
    return Object.entries(dict).reduce((acc: SingleMetaSchema[], item) => {
        const [_key, _value]: [string, string] = item
        const single = getMetaEntry(_key, _value)
        if (singleMetaSchema.safeParse(single).success)
            return [...acc, singleMetaSchema.parse(single)]
        else return acc
    }, [])
}
