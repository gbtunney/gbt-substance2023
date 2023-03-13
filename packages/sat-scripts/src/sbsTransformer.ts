//types for SBS_DataSpec.json

export type GenericEntry = Record<
    string,
    {
        _attributes: {
            v: string
        }
    }
>
export type MetaDictItem = {
    name: { _attributes: { v: string } } //name of metaDict
    value: { _attributes: { v: string } }
}

export type MetaData = { treestr: MetaDictItem }

export type FullSBSDef = {
    _declaration: GenericEntry
    package: {
        identifier: GenericEntry
        formatVersion: GenericEntry
        updaterVersion: GenericEntry
        versionUID: GenericEntry
        fileUID: GenericEntry
        desc: GenericEntry
        metadata: MetaData

        //todo
        dependencies: {}

        content: {
            graph: {
                attributes: GraphAttributes
                metadata: MetaData
                identifier: GenericEntry
                uid: GenericEntry
                graphtype: GenericEntry

                //todo:
                graphOutputs: {}
                compNodes: {}
                baseParameters: {}
                options: {}
                root: {}
            }
        }
    }
}

type GraphAttributes = {
    //todo : map from spec
    category: GenericEntry
    description: GenericEntry
    icon: {
        datalength: GenericEntry // { "_attributes": { "v": "5000" } },
        format: GenericEntry // { "_attributes": { "v": "png" } },
        strdata: GenericEntry
    }
}

export {}
