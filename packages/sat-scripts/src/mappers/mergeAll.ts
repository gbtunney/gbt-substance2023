import { z } from 'zod'
import { deepmerge } from 'deepmerge-ts'

import {
    _dataGraphSchema,
    _dataSBSPackageSchema,
} from '../schemas/replaceFileSchema.js'
export const _dataQueueInSchema = z.array(
    z.union([z.record(_dataGraphSchema), z.record(_dataSBSPackageSchema)])
)
const _dataQueueFlattenedSchema = z.union([
    z.record(_dataGraphSchema),
    z.record(_dataSBSPackageSchema),
])

/* * FLATTEN DATA QUEUE * */
export const _flattenDataQueue = (
    inPreprocessQueue: z.infer<typeof _dataQueueInSchema>
) => {
    const _pre_flatten = inPreprocessQueue.reduce((acc, value) => {
        return deepmerge(acc, value)
    }, {})
    if (_dataQueueFlattenedSchema.safeParse(_pre_flatten).success)
        return _dataQueueFlattenedSchema.parse(_pre_flatten)
    return {}
}
