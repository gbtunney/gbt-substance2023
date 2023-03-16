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
export type SingleMetaSchema = z.infer<typeof singleMetaSchema>

export const dependencySchema = z.object({
    filename: z.object({ _attributes: z.object({ v: z.string() }) }),
    uid: z.object({ _attributes: z.object({ v: z.string() }) }),
    type: z.object({ _attributes: z.object({ v: z.string() }) }),
    fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
    versionUID: z.object({ _attributes: z.object({ v: z.string() }) }),
})

export const graphSchema = z.object({
    identifier: z.object({
        _attributes: z.object({ v: z.string() }),
    }),
    uid: z.object({
        _attributes: z.object({ v: z.string() }),
    }),
    graphtype: z
        .object({
            _attributes: z.object({ v: z.string() }),
        })
        .optional(),
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
    graphOutputs: z.union([
        z.object({}),
        z.object({
            graphoutput: z.union([
                z.object({}),
                z.object({
                    identifier: z.object({
                        _attributes: z.object({ v: z.string() }),
                    }),
                    uid: z.object({
                        _attributes: z.object({ v: z.string() }),
                    }),
                    channels: z.object({
                        _attributes: z.object({ v: z.string() }),
                    }),
                }),
            ]),
        }),
    ]),
    compNodes: z.union([
        z.object({}),
        z.union([
            z.object({}),
            z.object({
                compNode: z.array(
                    z.union([
                        z.object({
                            uid: z.object({
                                _attributes: z.object({
                                    v: z.string(),
                                }),
                            }),
                            GUILayout: z.object({
                                gpos: z.object({
                                    _attributes: z.object({
                                        v: z.string(),
                                    }),
                                }),
                            }),
                            compOutputs: z.object({
                                compOutput: z.object({
                                    uid: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                    comptype: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                }),
                            }),
                            compImplementation: z.object({
                                compInstance: z.object({
                                    path: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                    parameters: z.object({}),
                                    outputBridgings: z.object({
                                        outputBridging: z.object({
                                            uid: z.object({
                                                _attributes: z.object({
                                                    v: z.string(),
                                                }),
                                            }),
                                            identifier: z.object({
                                                _attributes: z.object({
                                                    v: z.string(),
                                                }),
                                            }),
                                        }),
                                    }),
                                }),
                            }),
                        }),
                        z.object({
                            uid: z.object({
                                _attributes: z.object({
                                    v: z.string(),
                                }),
                            }),
                            GUILayout: z.object({
                                gpos: z.object({
                                    _attributes: z.object({
                                        v: z.string(),
                                    }),
                                }),
                            }),
                            connections: z.object({
                                connection: z.object({
                                    identifier: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                    connRef: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                    connRefOutput: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                }),
                            }),
                            compImplementation: z.object({
                                compOutputBridge: z.object({
                                    output: z.object({
                                        _attributes: z.object({
                                            v: z.string(),
                                        }),
                                    }),
                                }),
                            }),
                        }),
                    ])
                ),
            }),
        ]),
    ]),
    baseParameters: z.object({}),
    options: z.object({
        option: z.object({
            name: z.object({
                _attributes: z.object({ v: z.string() }),
            }),
            value: z.object({
                _attributes: z.object({ v: z.string() }),
            }),
        }),
    }),
    root: z.union([
        z.object({}),
        z.object({
            rootOutputs: z.object({
                rootOutput: z.object({
                    output: z.object({
                        _attributes: z.object({
                            v: z.string(),
                        }),
                    }),
                    format: z.object({
                        _attributes: z.object({
                            v: z.string(),
                        }),
                    }),
                    usertag: z.object({
                        _attributes: z.object({
                            v: z.string(),
                        }),
                    }),
                }),
            }),
        }),
    ]),
    metadata: z
        .object({
            treestr: z.union([z.array(singleMetaSchema), singleMetaSchema]),
        })
        .optional(),
})
export type SBS_Schema = z.infer<typeof sbs_schema>
export const sbs_schema = z.object({
    _declaration: z.object({
        _attributes: z.object({ version: z.string(), encoding: z.string() }),
    }),
    package: z.object({
        identifier: z.object({ _attributes: z.object({ v: z.string() }) }),
        desc: z.object({ _attributes: z.object({ v: z.string() }) }).optional(),
        formatVersion: z
            .object({ _attributes: z.object({ v: z.string() }) })
            .optional(),
        updaterVersion: z
            .object({ _attributes: z.object({ v: z.string() }) })
            .optional(),
        fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
        versionUID: z.object({ _attributes: z.object({ v: z.string() }) }),
        metadata: z
            .object({
                treestr: z.union([z.array(singleMetaSchema), singleMetaSchema]),
            })
            .optional(),
        dependencies: z.object({
            dependency: z.union([dependencySchema, z.array(dependencySchema)]),
        }),
        content: z.object({
            graph: z.array(graphSchema),
        }),
    }),
})
