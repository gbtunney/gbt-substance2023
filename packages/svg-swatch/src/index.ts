import { z } from 'zod'
import { computed, ComputedRef, createSSRApp, ref } from 'vue'
import { splitEvery } from 'ramda'
import { renderToString } from 'vue/server-renderer'
import {
    AppAliasOption,
    initApp,
    unResolvedAppOptions,
} from '@snailicide/cli-app'
import {
    ImageData,
    loadAllImageFiles,
    writeReadme,
    writeTemplate,
} from './loaders.js'
import { ResolvedOptions, svg_legend_schema } from './options.js'
const alias: AppAliasOption<typeof svg_legend_schema> = {
    help: 'h',
    version: 'v',
    rootDir: 'r',
    outDir: 'o',
    inputImages: 'i',
    columns: 'c',
    gutter: 'g',
    svgWidth: 'w',
    patternTiling: 't',
    outFile: 'f',
    debug: 'd',
}
const OPTIONS: unResolvedAppOptions = {
    name: 'svg-swatch',
    description: 'SVG Swatch : Creates an svg out of the images',
    version: '0.0.1',
    alias,
}
const initialize = () => {
    initApp(svg_legend_schema, initFunc, OPTIONS)
}

const initFunc = (args: z.output<typeof svg_legend_schema>, help?: string) => {
    if (args !== undefined) {
        const options: ResolvedOptions = args

        /* * todo: reenable write Readme * */
        /* if (help !== undefined) {writeReadme(help, options)}*/
        const app = createSSRApp({
            setup: (context) => {
                const count = ref(1)
                const imageDataArr = loadAllImageFiles(options) // Ref<ImageData[]> = ref( node.getFilePathArr(options.inputImages))
                const Grid: ComputedRef<ImageData[][]> = computed(() => {
                    return splitEvery(<number>options.columns, imageDataArr) //  JSON.stringify(imageDataArr.value)
                })

                const DocWidth: ComputedRef<number> = computed(() => {
                    return Math.floor(
                        options.svgWidth - options.columns * options.gutter
                    )
                })
                const SwatchSize: ComputedRef<number> = computed(() => {
                    return Math.floor(
                        (DocWidth.value - options.gutter) / options.columns
                    )
                })

                const indexMultiplier = (value: number) => {
                    const multiplier = value + 1
                    return (
                        (SwatchSize.value + options.gutter) * multiplier -
                        SwatchSize.value
                    )
                }
                //OPACITY :opacity='(1/(col_index+1))'
                const truncate = (value: string) => {
                    const splitArr = value.split(options.delimiter)
                    if (splitArr.length === 1) {
                        return splitArr[0]
                    } else {
                        return splitArr
                            .slice(splitArr.length - 2, splitArr.length - 0)
                            .join('_')
                    }
                }
                const getTransform = (value: number, key = 'scale') =>
                    `${key}(${1 / value})`

                // expose to template and other options API hooks
                return {
                    count,
                    options,
                    imageDataArr,
                    Grid,
                    SwatchSize,
                    DocWidth,
                    indexMultiplier,
                    truncate,
                    getTransform,
                }
            },
            template: `
                <svg version='1.0'
                    id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
                    :width='options.svgWidth'
                    :height='((SwatchSize * Grid.length) + (options.gutter * Grid.length) + options.gutter )'
                    xml:space='preserve'>
                <defs>
                    <pattern v-for='(imageData , index) in imageDataArr'
                        :id='truncate(imageData.file.filename)'
                        :viewBox="'0,0,'+ imageData.width +','+imageData.height" width='1' height='1'
                        :patternTransform='getTransform( options.patternTiling)'>
                         <image 
                             :height='imageData.height' 
                             :width='imageData.width'
                             :xlink:href='imageData.data' />
                    </pattern>
                </defs>
                <g v-for='(row , row_index) in Grid' :transform="'translate(0,'+  indexMultiplier(row_index) +')'">
                    <g v-for='(col_imageData , col_index) in row' :transform="'translate('+  indexMultiplier(col_index) +',0)'">
                        <rect :width='SwatchSize + "px"' :height='SwatchSize + "px"' :fill="'url(#' + truncate(col_imageData.file.filename)  + ')'" />
                        <text style='font-family:sans-serif;font-size:18px'>{{ truncate(col_imageData.file.filename) }}</text>
                    </g>
                </g>
                </svg>`,
        })
        renderToString(app).then((html) => {
            if (args !== undefined) writeTemplate(html, options)
        })
    }
}
export default initialize()
