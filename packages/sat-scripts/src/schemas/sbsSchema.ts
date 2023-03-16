import { z } from 'zod'
import { zod } from '@snailicide/g-library'
export const singleAttributeSchema = z.object({
    _attributes: z.object({ v: z.string() }),
})
export type SingleAttributeSchema = z.infer<typeof singleAttributeSchema>

export const singleMetaSchema = z.object({
    name: z.object({
        _attributes: z.object({ v: z.string() }),
    }),
    value: z.object({
        _attributes: z.object({ v: z.string() }),
    }),
})

export const metaTreeSchema = z.array(singleMetaSchema)
export type SingleMetaSchema = z.infer<typeof singleMetaSchema>
export type MetadataSchema = z.infer<typeof metadataSchema>
export const metadataSchema = zod.optionalDefault(
    z.object({
        treestr: zod.optionalDefault(
            z
                .union([z.array(singleMetaSchema), singleMetaSchema])
                .transform((val) => {
                    if (singleMetaSchema.safeParse(val).success) {
                        return z.array(singleMetaSchema).parse([val])
                    }
                    return val
                }),
            []
        ),
    }),
    { treestr: [] }
)

export const newmetadataSchema = z.object({
    treestr: zod.optionalDefault(
        z
            .union([z.array(singleMetaSchema), singleMetaSchema])
            .transform((val) => {
                if (singleMetaSchema.safeParse(val).success) {
                    return z.array(singleMetaSchema).parse(val)
                }
                return val
            }),
        []
    ),
})

export const attributeSchema = z
    .object({
        category: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        label: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        author: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        authorURL: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        tags: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        description: z
            .object({
                _attributes: z.object({ v: z.string() }),
            })
            .optional(),
        icon: z
            .object({
                datalength: z.object({
                    _attributes: z.object({ v: z.string() }),
                }),
                format: z.object({
                    _attributes: z.object({ v: z.string() }),
                }),
                strdata: z.object({
                    _attributes: z.object({ v: z.string() }),
                }),
            })
            .optional(),
    })
    .optional()
export const dependencySchema = z.object({
    filename: z.object({ _attributes: z.object({ v: z.string() }) }),
    uid: z.object({ _attributes: z.object({ v: z.string() }) }),
    type: z.object({ _attributes: z.object({ v: z.string() }) }),
    fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
    versionUID: z.object({ _attributes: z.object({ v: z.string() }) }),
})
export type GraphSchema = z.infer<typeof graphSchema>
export const graphSchema = z
    .object({
        identifier: z.object({
            _attributes: z.object({ v: z.string() }),
        }),
        attributes: z
            .object({
                category: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                label: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                author: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                authorURL: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                tags: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                description: z
                    .object({
                        _attributes: z.object({ v: z.string() }),
                    })
                    .optional(),
                icon: z
                    .object({
                        datalength: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        format: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        strdata: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                    })
                    .optional(),
            })
            .optional(),
        metadata: metadataSchema,
    })
    .nonstrict()

/* * this is an array of the RAW XML-TO-JS elements * */
export type GraphElementArraySchema = z.infer<typeof graphElementArraySchema>
export const graphElementArraySchema = z.array(graphSchema.passthrough())

export type SBS_Schema = z.infer<typeof sbs_schema>
export const sbs_schema = z
    .object({
        _declaration: z.object({
            _attributes: z.object({
                version: z.string(),
                encoding: z.string(),
            }),
        }),
        package: z
            .object({
                //identifier: z.object({ _attributes: z.object({ v: z.string() }) }),
                desc: z
                    .object({ _attributes: z.object({ v: z.string() }) })
                    .optional(),
                metadata: metadataSchema,
                /*  formatVersion: z
            .object({ _attributes: z.object({ v: z.string() }) })
            .optional(),*/
                /*    updaterVersion: z
            .object({ _attributes: z.object({ v: z.string() }) })
            .optional(),
        fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
        versionUID: z.object({ _attributes: z.object({ v: z.string() }) }),
*/
                /*  dependencies: z.object({
            dependency: z.union([dependencySchema, z.array(dependencySchema)]),
        }),*/
                content: z.object({
                    graph: graphElementArraySchema,
                }),
            })
            .passthrough(),
    })
    .passthrough()
