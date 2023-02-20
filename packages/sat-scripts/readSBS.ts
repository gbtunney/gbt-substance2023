import { xml2js } from 'xml-js'
import fs from 'fs'
import path from 'path'

/*
@doc_source_code_enum
class AttributesEnum:
    """
    Enumeration of the different attributes available on a :class:`.SBSGraph` or a :class:`.SBSFunction`
    """
    Category     ,\
    Label        ,\
    Author       ,\
    AuthorURL    ,\
    Tags         ,\
    Description  ,\
    UserTags     ,\
    Icon         ,\
    HideInLibrary,\
    PhysicalSize ,\
    = range(10)
*/
const sbsContent = fs.readFileSync(
    path.resolve(
        '/Users/gilliantunney/gh_repos/SNAILICIDE/gbt-substance2023/packages/sat-scripts/src/Sbs/leather_fine/leather_fine.sbs'
    ),
    'utf8'
)

const json = JSON.stringify(
    JSON.parse(JSON.stringify(xml2js(sbsContent, { compact: true }))),
    undefined,
    2
)
fs.writeFileSync('./dist/gill.json', json)

import shellJS from 'shelljs'
//console.log(json);
