import { SingleAttributeSchema, SingleMetaSchema } from './schemas/sbsSchema.js'

export const getAttributeEntry = (
    key: string,
    value: string
): Record<string, SingleAttributeSchema> => {
    return {
        [key]: {
            _attributes: {
                v: value,
            },
        },
    }
}
export const getMetaEntry = (key: string, value: string): SingleMetaSchema => {
    return {
        name: { _attributes: { v: key } },
        value: { _attributes: { v: value } },
    }
}
export const findMetaEntry = (
    key: string,
    value: SingleMetaSchema[]
): SingleMetaSchema | undefined => {
    const filteredMeta = value.filter((_meta, index) => {
        return _meta.name._attributes.v === key
    })
    return filteredMeta.length == 1 ? filteredMeta[0] : undefined
}
export const filterMetaEntries = (
    key: string,
    value: SingleMetaSchema[]
): SingleMetaSchema[] | undefined => {
    const filteredMeta = value.filter((_meta, index) => {
        return _meta.name._attributes.v === key
    })
    return filteredMeta.length > 0 ? filteredMeta : undefined
}

// /*
// export const findMetaIndex =( key:string, value:Number|undefined=> {
//     const filteredMetaIndex = value.findIndex( ( _meta)=>{
//         return  _meta
//     })
//     return ( filteredMetaIndex !==  0 )? filteredMetaIndex: undefined
// }
// */
