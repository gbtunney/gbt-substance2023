///resolve ARGS!! like in vite plugins/
import {
    sbs_updater_options,
    resolved_sbs_updater_options,
} from './schemas/optionsSchema.js'
import type {
    SBS_UpdaterOptions,
    ResolvedSBS_UpdaterOptions,
} from './schemas/optionsSchema'

export const resolveOptions = (
    options: any //SBS_UpdaterOptions
): ResolvedSBS_UpdaterOptions | undefined => {
    if (sbs_updater_options.safeParse(options).success) {
        if (
            resolved_sbs_updater_options.safeParse(
                sbs_updater_options.parse(options)
            ).success
        ) {
            return resolved_sbs_updater_options.parse(
                sbs_updater_options.parse(options)
            )
        }
    } else {
        sbs_updater_options.parse(options)
    }
    return undefined
}

export default resolveOptions
