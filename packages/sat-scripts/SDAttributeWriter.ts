import { xml2js, js2xml, json2xml, xml2json } from 'xml-js'
import fs from 'fs'
import path from 'path'
import _data from './examples/SBS_DataSpec.json'
import _replacespec from './examples/fileReplaceSpec.json'
import { deepmerge, deepmergeCustom } from 'deepmerge-ts'

const inputURL =
    '/Users/gilliantunney/gh_repos/SNAILICIDE/gbt-substance2023/packages/value-processor-utilities/src/GBT_Value_Processor_Utilities.sbs'
const dataFile = './examples/fileReplaceSpec.json'
const outputURL = './examples/testSBS.sbs'

type SpecData = typeof _data
type ReplaceData = typeof _replacespec
type PackageData = SpecData['package']
type GraphAttributes = {
    category?: string
    label?: string
    author?: string
    authorURL?: string
    desc?: string
    tags?: string[]
    icon?: string
}

const main = async () => {
    const data = await import('./examples/SBS_DataSpec.json', {
        assert: { type: 'json' },
    })
    const packageData: PackageData = data.default.package

    let sbsSource = fs.readFileSync(
        path.resolve(path.resolve(inputURL)),
        'utf8'
    )
    const sourceObj = xml2js(sbsSource, { compact: true })

    const replaceData = await import(dataFile, { assert: { type: 'json' } })

    const returned = populateData(sourceObj as SpecData, replaceData.default)

    let result: string = js2xml(sourceObj, {
        compact: true,
        attributeValueFn: function (value) {
            return value
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(' & ', ' &amp; ')
                .replace(/&&/g, '&amp;&amp;')
        },
    })
    //debug::: fs.writeFileSync('./dist/datadump.json', JSON.stringify(returned))
    fs.writeFileSync(outputURL, result)
}

const populateData = (sbsData: SpecData, replaceData: ReplaceData) => {
    let mysbsData = { ...sbsData }

    //graph values
    const newGraphArray = sbsData.package.content.graph.map((_value) => {
        //populate default graph values
        const replacedGraphObj = getNewGraphDefaultObj(replaceData)

        //populate specific values
        const _id = _value.identifier._attributes.v
        let foundArray: any[] = []
        //TODO: fix
        const dummynewVAL = Object.entries(replaceData.gph).reduce(
            (accumulator, [key, value]) => {
                if (_id === key) {
                    const newDataObj = getNewSpecificsDefaultObj(value)
                    foundArray = [...foundArray, newDataObj]
                }
                return { ...accumulator }
            },
            {}
        )
        return deepmerge(
            _value,
            replacedGraphObj,
            foundArray.length === 1 ? foundArray[0] : {}
        )
    })
    const newPackageData = getNewPackageDataObj(replaceData)
    if (mysbsData.package.metadata) {
        mysbsData.package.metadata.treestr = []
    }
    mysbsData.package.content.graph = newGraphArray
    // @ts-expect-error ffddfd
    mysbsData.package.metadata = newPackageData.metadata
    // @ts-expect-error ffddfd
    mysbsData.package['desc'] = newPackageData.desc
    return { ...mysbsData }
}

const getNewPackageDataObj = (inData: ReplaceData) => {
    ///mimic object
    const obj: Partial<PackageData> = {
        desc: {
            _attributes: {
                v: inData.pkg.desc,
            },
        },
        metadata: {
            treestr: [
                {
                    name: {
                        _attributes: {
                            v: 'version',
                        },
                    },
                    value: {
                        _attributes: {
                            v: inData.pkg.version,
                        },
                    },
                },
                {
                    name: {
                        _attributes: {
                            v: 'uid',
                        },
                    },
                    value: {
                        _attributes: {
                            v: inData.pkg.id,
                        },
                    },
                },
            ],
        },
    }
    return obj
}
const getNewGraphDefaultObj = (inData: ReplaceData) => {
    return getNewSpecificsDefaultObj(inData.gph_defaults)
}
const getNewSpecificsDefaultObj = (inData: GraphAttributes) => {
    ///mimic object

    let constructObj = {}

    if (inData.desc) {
        constructObj = {
            ...constructObj,
            description: {
                _attributes: {
                    v: inData.desc,
                },
            },
        }
    }
    if (inData.category) {
        constructObj = {
            ...constructObj,
            category: {
                _attributes: {
                    v: inData.category,
                },
            },
        }
    }
    if (inData.tags) {
        constructObj = {
            ...constructObj,
            tags: {
                _attributes: {
                    v: inData.tags,
                },
            },
        }
    }
    if (inData.label) {
        constructObj = {
            ...constructObj,
            label: {
                _attributes: {
                    v: inData.label,
                },
            },
        }
    }
    if (inData.author) {
        constructObj = {
            ...constructObj,
            author: {
                _attributes: {
                    v: inData.author,
                },
            },
        }
    }
    if (inData.authorURL) {
        constructObj = {
            ...constructObj,
            authorURL: {
                _attributes: {
                    v: inData.authorURL,
                },
            },
        }
    }
    if (inData.icon) {
        constructObj = {
            ...constructObj,
            icon: {
                datalength: {
                    _attributes: {
                        v: '5000',
                    },
                },
                format: {
                    _attributes: {
                        v: 'png',
                    },
                },
                strdata: {
                    _attributes: {
                        v: inData.icon,
                    },
                },
            },
        }
    }

    return {
        attributes: constructObj,
    }
}

main()
