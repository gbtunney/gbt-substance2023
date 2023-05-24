import { z } from 'zod'
import { computed, ComputedRef, createSSRApp, ref } from 'vue'
import { splitEvery } from 'ramda'
import { renderToString } from 'vue/server-renderer'
import {
    AppAliasOption,
    initApp,
    unResolvedAppOptions,
} from '@snailicide/cli-app'
import { ImageData, loadAllImageFiles, writeTemplate } from './loaders.js'
import { ResolvedOptions, svg_legend_schema } from './options.js'

const alias: AppAliasOption<typeof svg_legend_schema> = {
    help: 'h',
    version: 'v',
    rootDir: 'r',
    outDir: 'o',
    inputImages: 'img',
    columns: 'col',
    gutter: 'g',
    svgWidth: 'w',
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

const initFunc = (args: z.output<typeof svg_legend_schema>) => {
    if (args !== undefined) {
        const options: ResolvedOptions = args

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
                    return Math.floor(DocWidth.value / options.columns)
                })

                const indexMultiplier = (value: number) => {
                    const multiplier = value + 1
                    return (
                        (SwatchSize.value + options.gutter) * multiplier -
                        SwatchSize.value
                    )
                }
                // expose to template and other options API hooks
                return {
                    count,
                    options,
                    imageDataArr,
                    Grid,
                    SwatchSize,
                    DocWidth,
                    indexMultiplier,
                }
            },
            template: `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :width='options.svgWidth'  :height='((SwatchSize * Grid.length) + (options.gutter * Grid.length) )' xml:space="preserve">
                <defs>
                    <pattern v-for='(imageData , index) in imageDataArr' :id='imageData.file.filename' :viewBox="'0,0,'+ imageData.width +','+imageData.height" width='1' height='1' patternTransform='scale(.5)'>
                        <image :xlink:href='imageData.data' :height='imageData.width' :width='imageData.height' />
                    </pattern>
                </defs>
                <g v-for='(row , row_index) in Grid' :transform="'translate(0,'+  indexMultiplier(row_index) +')'">
                    <g v-for='(col_imageData , col_index) in row' :transform="'translate('+  indexMultiplier(col_index) +',0)'">
                        <rect :width='SwatchSize + "px"' :opacity='(1/(col_index+1))' :height='SwatchSize + "px"'  :fill="'url(#' + col_imageData.file.filename  + ')'" />
                        <text style="font-family:sans-serif;font-size:18px">{{col_imageData.file.filename}}</text>
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
