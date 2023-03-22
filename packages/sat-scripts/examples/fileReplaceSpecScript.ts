import pkg from './../package.json' assert { type: 'json' }
const name = pkg.name
const version = pkg.name
const description = pkg.description

export const getFile = () => {
    const markdown_desc = ` # THIS IS SAT-SCRIPTS

[Command Line Tools | Substance 3D Automation ToolKit](https://substance3d.adobe.com/documentation/sat/command-line-tools)
  
 - this is a **bold** text
 - list 3`
    return {
        pkg: {
            desc: markdown_desc,
            metadata: {
                version: '0.0.44',
                id: '232323232',
                filename: '%nameofsourceSBSfile%',
                pkg_version: version,
                pkg_name: name,
                pkg_desc: description,
            },
        },

        gph: {
            '*': {
                attributes: {
                    category: 'ExampleCategory',
                    author: 'Latest B Tunney',
                    authorURL: 'http://ALTERS.org',
                    description:
                        ' # i graph am gillian!!!   \n this is a **bold** text',
                    tags: 'tag1, tag2',
                },
                metadata: {
                    uid: 'default overridesn',
                    distid: '6666232323232',
                    filename: '%nameofsourceSBSfile%',
                    pkg_version: version,
                    pkg_name: name,
                },
            },
            'Example_Graph': {
                attributes: {
                    label: 'SPECIFIC Example',
                    description: '<b>this is a specific graph...</b>',
                    tags: 'tag44',
                },
                metadata: {
                    distid: '%OVERRIDDEN BY SPECIDFIC%',
                },
            },
            'Integer_Value_Graph': {
                attributes: {
                    label: 'SPECIFIC Integer_Value_Graph',
                    author: 'JAN VANDAMME',
                },
            },
        },
    }
}

export default getFile()
