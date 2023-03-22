///this is a ELEMENT > att lookup wstring  . (
import { z } from 'zod'
import RA from 'ramda-adjunct'
import { GraphAttributesSchema } from '../schemas/replaceFileSchema.js'
import {
    attributeSchema,
    iconSchema,
    SingleAttributeSchema,
    singleAttributeSchema,
} from '../schemas/sbsSchema.js'

/* * This takes an Attribute Dictionary  array of
and  raw elements - in a typed INDEX.
transforms it BACK TO ELEMENT ( raw file format ) to parsedAttributesElement
  this is UNTYPED so not specific to graphs.
  * */
export const getAttributeElement = (
    inAttributeDict: GraphAttributesSchema // z.infer<typeof attributeSchema>
) => {
    ///this is for serializing.
    const postTransformAttributesElements: GraphAttributesSchema =
        Object.entries(inAttributeDict).reduce((accumulator, [key, value]) => {
            ///is TARGET!! attributeSchema
            if (RA.isString(value)) {
                //todo:::
                if (key === 'icon') {
                    return {
                        ...accumulator,
                        icon: getRawElementArributeIcon(value),
                    }

                    //todo: THIS BREAKS EVERYTHING.
                    // return accumulator
                }
                return {
                    ...accumulator,
                    [key]: getRawElementArribute(value),
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

export const getAttributeDict = (
    inAttributes: z.infer<typeof attributeSchema>
) => {
    const preprocessesAttr = inAttributes !== undefined ? inAttributes : {}
    const postTransform: GraphAttributesSchema = Object.entries(
        preprocessesAttr
    ).reduce((accumulator, [key, value]) => {
        let _value = value
        if (key === 'icon' && value) {
            if (iconSchema.safeParse(value).success) {
                const parsedIcon = iconSchema.parse(value)
                _value = parsedIcon.strdata
            }
        }
        if (singleAttributeSchema.safeParse(_value).success) {
            const attributeElement = singleAttributeSchema.parse(_value)
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

/* * RAW ELEMENT arrtribute with just a value.(NO KEY)  * */
export const getRawElementArribute = (value: string): SingleAttributeSchema => {
    return {
        _attributes: { v: value },
    }
}

export const getRawElementArributeIcon = (
    value: string
): z.infer<typeof iconSchema> => {
    return {
        datalength: { _attributes: { v: '5000' } },
        format: { _attributes: { v: 'png' } },
        strdata: { _attributes: { v: value } },
    }
}
