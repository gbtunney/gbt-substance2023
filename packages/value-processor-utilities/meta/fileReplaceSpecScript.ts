import pkg from './../package.json' assert { type: 'json' }
const { name, version, author, homepage } = pkg
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
                    author: author.name,
                    authorURL: homepage,
                    category: 'value processor',
                    icon: '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',
                },
                metadata: {
                    pkg_version: version,
                    pkg_name: name,
                },
            },
            'Float_Value_Graph': {
                attributes: {
                    label: 'Float Graph & Input Viewer',
                    description:
                        '<p>A passthru node that lets you view a value and switch value types.</p>\n<p>It is useful for debugging purposes,  and</p>\n<p>tips:\noutput windows</p>\n',
                    tags: 'value processor,value processor graph, parameter value, value,input value, float2, float1, float4, float3',
                },
                metadata: {},
            },
            'Integer_Value_Graph': {
                attributes: {
                    label: 'Integer Graph & Input Viewer',
                    description:
                        '<p>Convert to Float included!!</p>\n<p>A passthru node that lets you view a value and switch value types.</p>\n<p>It is useful for debugging purposes,  and</p>\n<p>tips:\noutput windows</p>\n',
                    tags: 'value processor,value processor graph, convert to float, parameter value, value,input value, float2, float1, float4, float3',
                },
                metadata: {},
            },
            'Float_Value_Switch': {
                attributes: {
                    label: 'Float Switch Graph',
                    tags: 'value processor, values',
                },
                metadata: {},
            },
            'Float_Value_Split': {
                attributes: {
                    label: 'Float Split / Swizzle Graph',
                    author: 'Gillian Tunney',
                    description:
                        '<p>Splits / Swizzle a Float4 into:</p>\n<ul>\n<li>4 Float1 outputs OR 2 Float2 outputs</li>\n</ul>\n<p>OR</p>\n<p>Splits / Swizzle a Float2 into:</p>\n<ul>\n<li>2 Float1 outputs OR 1 Float2 outputs</li>\n</ul>\n',
                    tags: 'value processor, values, value split, split, swizzle, float2, float1, float4',
                },
                metadata: {},
            },
            'Float_Value_Merge': {
                attributes: {
                    label: 'Float Merge Graph',
                    tags: 'value processor, values',
                },
                metadata: {},
            },
            'Sampler_Image_To_Float': {
                attributes: {
                    label: 'Sampler: Image to Float',
                    author: 'Gillian Tunney',
                    tags: 'value processor, values, image to float, float1, float4',
                },
            },
        },
    }
}
export default getFile()
