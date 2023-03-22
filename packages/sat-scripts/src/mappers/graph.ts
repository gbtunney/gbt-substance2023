import RA from 'ramda-adjunct'
import {
    graphDictByIDSchema,
    GraphDictByIDSchema,
    ResolvedGraphDictSchema,
    resolvedGraphDictSchema,
} from '../schemas/replaceFileSchema.js'
import {
    graphElementArraySchema,
    GraphElementArraySchema,
    GraphSchema,
    graphSchema,
} from '../schemas/sbsSchema.js'
import { getMetaDict, getMetaDictToElement } from './meta.js'
import { getAttributeDict, getAttributeElement } from './attributes.js'

export const mergeGraphDictToElement = (
    _graphDict: GraphDictByIDSchema,
    origGraphArr: GraphElementArraySchema
): GraphElementArraySchema => {
    const mapped = origGraphArr.map((_graph) => {
        const ID = _graph.identifier._attributes.v
        if (
            _graphDict[ID] &&
            _graphDict[ID] !== undefined &&
            resolvedGraphDictSchema.safeParse(_graphDict[ID]).success
        ) {
            const targetObj = resolvedGraphDictSchema.parse(_graphDict[ID])
            const newObject = {
                ..._graph,
                attributes: getAttributeElement(targetObj.attributes),
                metadata: {
                    treestr: getMetaDictToElement(targetObj.metadata),
                },
            }
            if (graphSchema.safeParse(newObject).success)
                return graphSchema.parse(newObject)
            else console.error('NOT FOUND')
        }
        return graphSchema.parse(_graph)
    })

    if (graphElementArraySchema.safeParse(mapped).success) {
        return graphElementArraySchema.parse(mapped)
    } else {
        console.log(
            'parseGraphDictionaryToElement',
            graphElementArraySchema.parse(mapped)
        )
    }
    return []
}

export const parseGraphByIdDictionary = (
    _graphArr: GraphElementArraySchema
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
            return { ...acc, [graph_id]: { ...__graph, ...graphPropsDict } }
        }
        return acc
    }, {})
    if (graphDictByIDSchema.safeParse(_graphDict).success) {
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
