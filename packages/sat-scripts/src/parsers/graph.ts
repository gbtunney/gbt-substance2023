import { z } from 'zod'
import RA from 'ramda-adjunct'
import {
    graphDictByIDSchema,
    GraphDictByIDSchema,
    ResolvedGraphDictSchema,
    resolvedGraphDictSchema,
} from '../schemas/replaceFileSchema.js'
import {
    getAttributeDict,
    getAttributeElement,
    getAttributeEntry,
    getMetaDict,
} from '../mappers.js'
import {
    graphElementArraySchema,
    GraphElementArraySchema,
    GraphSchema,
    graphSchema,
} from '../schemas/sbsSchema.js'
export const parseGraphDictionaryToElement = (
    _graphDict: GraphDictByIDSchema
): GraphElementArraySchema => {
    const _graphArr = Object.entries(_graphDict).reduce(
        (acc: GraphElementArraySchema, [key, value]) => {
            const newElement = {
                ...getAttributeEntry('identifier', key),
                attributes: getAttributeElement(value.attributes),
            }
            if (graphSchema.safeParse(newElement).success) {
                const graphElement: z.infer<typeof graphSchema> =
                    graphSchema.parse(newElement)
                return [...acc, graphElement]
            }
            return acc
        },
        []
    )
    if (graphElementArraySchema.safeParse(_graphArr).success) {
        const graphArr = graphElementArraySchema.parse(_graphArr)
        return graphArr
    } else {
        console.log(
            'parseGraphDictionaryToElement',
            graphElementArraySchema.parse(_graphArr)
        )
    }
    return []
}

export const parseGraphByIdDictionary = (
    _graphArr: GraphElementArraySchema,
    clean_keys: boolean = true
): GraphDictByIDSchema => {
    const _graphDict = _graphArr.reduce((acc: GraphDictByIDSchema, __graph) => {
        if (graphSchema.safeParse(__graph).success) {
            const graph_id = __graph.identifier._attributes.v
            const preTransform: GraphSchema = graphSchema.parse(__graph)
            const tree_arr =
                preTransform.metadata && preTransform.metadata.treestr
                    ? RA.ensureArray(preTransform.metadata.treestr)
                    : []
            const attributes = preTransform.attributes

            /* * change xml json elements to dictionary objects * */
            const graphPropsDict: ResolvedGraphDictSchema = {
                metadata: getMetaDict(tree_arr),
                attributes: getAttributeDict(attributes),
            }
            //if ( clean_keys ) {
            //   return {...acc, [graph_id] :  graphPropsDict }//}else{
            return { ...acc, [graph_id]: { ...__graph, ...graphPropsDict } }
        }
        return acc
    }, {})
    if (graphDictByIDSchema.safeParse(_graphDict).success) {
        // const dictSchema = ( clean_keys === true) ?z.record(graphDictByIDSchema.element.strict()) : graphDictByIDSchema
        return graphDictByIDSchema.parse(_graphDict)
    } else {
        console.log(
            '!!!!!!!!!!parseGraphByIdDictionary ::: !graph parse failed ',
            graphDictByIDSchema.parse(_graphDict),
            '\ninitial array'
        )
    }
    return {}
}

export {}
