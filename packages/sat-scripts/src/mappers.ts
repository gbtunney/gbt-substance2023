import { z } from 'zod'
import {
    attributeSchema,
    metaTreeSchema,
    singleAttributeSchema,
    SingleAttributeSchema,
    SingleMetaSchema,
} from './schemas/sbsSchema.js'
import { GraphAttributesSchema } from './schemas/replaceFileSchema.js'

import RA from 'ramda-adjunct'

export const getMetaDict = (
    _tree: z.infer<typeof metaTreeSchema>
): Record<string, string> => {
    return _tree.reduce((acc, _item) => {
        const key: string = _item.name._attributes.v
        const value: string = _item.value._attributes.v
        return { ...acc, [key]: value }
    }, {})
}
///this is a ELEMENT > att lookup wstring  . (
export const getAttributeElement = (
    inAttributeDict: GraphAttributesSchema // z.infer<typeof attributeSchema>
) => {
    const postTransformAttributesElements: GraphAttributesSchema =
        Object.entries(inAttributeDict).reduce((accumulator, [key, value]) => {
            ///is TARGET!! attributeSchema
            // .
            if (RA.isString(value)) {
                const attributeElement = getAttributeEntry(key, value) //singleAttributeSchema.parse(value)
                if (value === 'icon') {
                    //todo:ddddd
                    return accumulator
                }

                return {
                    ...accumulator,
                    ...attributeElement,
                }
            }
            return accumulator
        }, {})
    if (attributeSchema.safeParse(postTransformAttributesElements).success) {
        const parsedAttributesElement = attributeSchema.parse(
            postTransformAttributesElements
        )
        return parsedAttributesElement
    }
    return {}
}

///this is a ELEMENT > att lookup wstring  . (
export const getAttributeDict = (
    inAttributes: z.infer<typeof attributeSchema>
) => {
    const preprocessesAttr = inAttributes !== undefined ? inAttributes : {}
    const postTransform: GraphAttributesSchema = Object.entries(
        preprocessesAttr
    ).reduce((accumulator, [key, value]) => {
        if (singleAttributeSchema.safeParse(value).success) {
            const attributeElement = singleAttributeSchema.parse(value)
            return {
                ...accumulator,
                [key]: attributeElement._attributes.v,
            }
        }
        return accumulator
    }, {})

    return postTransform
}

///single attribute inElementFormat
export const getAttributeEntry = (
    key: string,
    value: string
): Record<string, SingleAttributeSchema> => {
    return {
        [key]: {
            _attributes: { v: value },
        },
    }
}
export const getMetaEntry = (key: string, value: string): SingleMetaSchema => {
    return {
        name: { _attributes: { v: key } },
        value: { _attributes: { v: value } },
    }
}
