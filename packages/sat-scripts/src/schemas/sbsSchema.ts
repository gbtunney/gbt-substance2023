import { z } from 'zod'

export type SBS_Schema = z.infer<typeof sbs_schema>
export const sbs_schema = z.object({
    _declaration: z.object({
        _attributes: z.object({ version: z.string(), encoding: z.string() }),
    }),
    package: z.object({
        identifier: z.object({ _attributes: z.object({ v: z.string() }) }),
        desc: z.object({ _attributes: z.object({ v: z.string() }) }),
        formatVersion: z.object({ _attributes: z.object({ v: z.string() }) }),
        updaterVersion: z.object({ _attributes: z.object({ v: z.string() }) }),
        fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
        versionUID: z.object({ _attributes: z.object({ v: z.string() }) }),
        metadata: z.object({
            treestr: z.array(
                z.object({
                    name: z.object({
                        _attributes: z.object({ v: z.string() }),
                    }),
                    value: z.object({
                        _attributes: z.object({ v: z.string() }),
                    }),
                })
            ),
        }),
        dependencies: z.object({
            dependency: z.object({
                filename: z.object({
                    _attributes: z.object({ v: z.string() }),
                }),
                uid: z.object({ _attributes: z.object({ v: z.string() }) }),
                type: z.object({ _attributes: z.object({ v: z.string() }) }),
                fileUID: z.object({ _attributes: z.object({ v: z.string() }) }),
                versionUID: z.object({
                    _attributes: z.object({ v: z.string() }),
                }),
            }),
        }),
        content: z.object({
            graph: z.array(
                z.union([
                    z.object({
                        identifier: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        uid: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        graphtype: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        attributes: z.object({
                            category: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            label: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            author: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            authorURL: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            tags: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            description: z.object({
                                _attributes: z.object({ v: z.string() }),
                            }),
                            icon: z.object({
                                datalength: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                                format: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                                strdata: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                            }),
                        }),
                        graphOutputs: z.object({
                            graphoutput: z.object({
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
                        }),
                        compNodes: z.object({
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
                                                            _attributes:
                                                                z.object({
                                                                    v: z.string(),
                                                                }),
                                                        }),
                                                        identifier: z.object({
                                                            _attributes:
                                                                z.object({
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
                        root: z.object({
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
                        metadata: z.object({
                            treestr: z.object({
                                name: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                                value: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                            }),
                        }),
                    }),
                    z.object({
                        identifier: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        uid: z.object({
                            _attributes: z.object({ v: z.string() }),
                        }),
                        graphOutputs: z.object({}),
                        compNodes: z.object({}),
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
                        root: z.object({}),
                        metadata: z.object({
                            treestr: z.object({
                                name: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                                value: z.object({
                                    _attributes: z.object({ v: z.string() }),
                                }),
                            }),
                        }),
                    }),
                ])
            ),
        }),
    }),
})
