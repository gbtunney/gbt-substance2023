///TYPES FOR REPLACE FILES
type GraphAttributes = {
    category?: string
    label?: string
    author?: string
    authorURL?: string
    desc?: string
    tags?: string[]
    icon?: string
}

type ReplaceFile = {
    pkg: {
        desc: string
        metadata: Record<string, string> //see example
    }
    gph_defaults: {
        attributes: GraphAttributes
        metadata: Record<string, string>
    }
    ///specific graph attributes by id
    gph: Record<string /*id*/, GraphAttributes>
}

/* example meta
"meta": {
    "version":  "0.0.1",
        "id": "232323232",
        "packageName": "%nameofpackage.json%",
        "fileName": "%nameofsourceSBSfile%"
}
*/
export {}
