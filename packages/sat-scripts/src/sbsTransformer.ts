//types for SBS_DataSpec.json

//    "name": { "_attributes": { "v": "version" } },
/*
"desc": {
    "_attributes": {
        "v": "%pkgdescription% This is the package readme!!!!!"
    }
},
 */
type PackageSBS = Record<
    string,
    {
        _attributes: {
            v: string
        }
    }
>
//treestr node
type TreeStr = {
    name: { _attributes: { v: string } } //name of metaDict
    value: { _attributes: { v: string } }
}

/* {
                    "name": { "_attributes": { "v": "version" } },
                    "value": { "_attributes": { "v": "%pkgversion%" } }
                }
                */

export {}
