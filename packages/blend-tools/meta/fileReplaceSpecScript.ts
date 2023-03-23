import pkg from './../package.json' assert { type: 'json' }
const { name, version } = pkg
const description = pkg.description

export const getFile = () => {
    const markdown_desc = ` # THIS IS GBT PALLATE
  
 - this is a **bold** text
 - list 3`
    return {
        pkg: {
            desc: markdown_desc,
            metadata: {
                pkg_version: version,
                pkg_name: name,
                pkg_desc: description,
            },
        },
        gph: {
            '*': {
                attributes: {
                    author: 'Gillian Tunney',
                    authorURL: 'http://pyromancy.org',
                    category: 'Color',
                },
                metadata: {
                    pkg_version: version,
                    pkg_name: name,
                },
            },
            'GBT_Palatte': {
                attributes: {
                    description:
                        '# GBT_Palatte <br/> A centralized **color palatte** that can sample color off a reference image.',
                },
            },
            'GBT_Palatte_Color_Swatch': {
                attributes: {
                    description:
                        'A **color swatch** that can sample color off a reference image.',
                },
            },
            'GBT_Palatte_Switcher': {
                attributes: {
                    description: 'Switch between different colors in palatte!!',
                },
            },
        },
    }
}
export default getFile()
