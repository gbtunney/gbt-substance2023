import RA from 'ramda-adjunct'
import { z } from 'zod'
import micromatch from 'micromatch'
import {
    _dataGraphSchema,
    graphDictByIDSchema,
    GraphDictByIDSchema,
    ReplaceFileSchema,
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
import { _flattenDataQueue } from './mergeAll.js'

export const getGraphMatcherDict = (
    graphKeys: string[],
    _graphReplace: ReplaceFileSchema['gph']
) => {
    if (_graphReplace === undefined) return {}
    const search = _graphReplace
    const myschema = z.record(_dataGraphSchema)
    const resultArr: z.infer<typeof myschema>[] = Object.entries(search).reduce(
        (acc: z.infer<typeof myschema>[], [key_selector, value]) => {
            const resolvedSelectors = micromatch(graphKeys, [key_selector])
            const _singleSelectors: ReplaceFileSchema['gph'] =
                resolvedSelectors.reduce((_innerAcc, _graphKey) => {
                    return {
                        ..._innerAcc,
                        [_graphKey]: value,
                    }
                }, {})
            if (myschema.safeParse(_singleSelectors).success) {
                return [...acc, myschema.parse(_singleSelectors)]
            } else {
                return acc
            }
        },
        []
    )
    return _flattenDataQueue(resultArr)
}

export const getGraphDictionary = (
    _graphs: GraphElementArraySchema
): GraphDictByIDSchema => {
    const parsedDict: GraphDictByIDSchema | undefined =
        parseGraphByIdDictionary(_graphs)
    return parsedDict !== undefined ? parsedDict : {}
}
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
): GraphDictByIDSchema | undefined => {
    const _graphDict = _graphArr.reduce(
        (acc: Record<string, ResolvedGraphDictSchema>, __graph) => {
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
        },
        {}
    )
    if (graphDictByIDSchema.safeParse(_graphDict).success) {
        return graphDictByIDSchema.parse(_graphDict)
    } else {
        console.log(
            '!!!!!!!!!!parseGraphByIdDictionary ::: !graph parse failed ',
            graphDictByIDSchema.parse(_graphDict),
            '\ninitial array'
        )
    }
    return undefined
}
export {}
