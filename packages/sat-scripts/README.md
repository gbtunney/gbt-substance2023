#THIS IS SAT-SCRIPTS

[Command Line Tools | Substance 3D Automation ToolKit](https://substance3d.adobe.com/documentation/sat/command-line-tools)

This is because SBSMutator and the old Automation toolkit is broke.

trying to make a cli thing to:I am trying to populate graph & package values automatically so i can make sure they are uniform than build sbsar's using [sbscooker | Substance 3D Automation ToolKit](https://substance3d.adobe.com/documentation/sat/command-line-tools/sbscooker) UGH.

### TS-TO-ZOD

```shell
pnpm exec ts-to-zod src/data.ts src/schemas/replaceFileSchema.ts
```

## Known issues

-   merge flag will not work if the packages reference each other
-   files and resources cannot be in folders within substance package.
-   duplicates metadata , ugh.

### Unzip sbsar

```shell
7za --help

#unzip archive ? IDK
7za e ./dist/*.sbsar -o./dist/directory

#rezip - broke
cd dist/special && ls . && pnpm exec 7za a ./dist/GBT_Palatten.sbsar ./dist/special/*.*
```

## Completely insane notes:

-   [ ] Graph source package name ( in meta )
-   [ ] Distribution ID

-   [ ] Move cli files to folder w cli index
-   [x] Tsconfig output to dist Binary
-   [x] Add path parser & validator
-   [x] Zod
-   [ ] Test from other package file
-   [ ] Conditionals for pkg

Loop thru a glob of json files - if ID matches a file name , then load matching file

Source_files_path “Src/“ Get glob of meta , gbt-valueprocesssr.json”

Correlate with matching file sbs In Source_files_path  
Merge package config ? or readme?

-   [ ] Maybe markdown to html for descriptions ? https://www.devextent.com/convert-markdown-to-html-nodejs/ Options

Rootdir (package.json in the calling dir) Inputsource dir Data metadir OutDir LOGFILE PATH NoOverwrite DescFilepath ( like readme.md)

First validate and trace

-   [ ] Rootdir resolvedRootDir
-   [ ] Rootdir>metadir RESOLVVEDMetadir
-   [ ] Rootdir>sourcedir resolvedSourxedir
-   [ ] Abu doesn’t excist, abort w error message .

-   [ ] resolvedRootDir>package.json check excist,Load and validate
-   [ ] IF VALID,
-   [ ] Construct defaultMetaObj frompackage.json ( map function)
-   [ ] ( author,name, version, url, email) seperate config key
-   [ ] ELSE DEFAULT {}

Set outputDescriptionArr

After :

-   [ ] Get glob he path :: Root dir > metaDir > “\*.json”or js RESOLVVEDMetadir

For each metaFile:

-   [ ] Match metaFile name with SBSfile
-   [ ] The path :: Root dir > ResolvedInputsourcedir > metaFile name,”sbs” InputFilePath

-   [ ] ERROr if no matching input file , trace

-   [ ] OutputFilepatg : The path :: Root dir > outputDir > metaFile name,”sbs”  
         If can write file?

If InputFilePath excists

-   [ ] REaDFILE: Load meta file from glob path

-   [ ] Deep Merge defaultMetaObj ,metaFile overriding
-   [ ] validate meta w zod , set METACONFIF var
-   [ ] Append descriptions to outputDescriptionArr
-   [ ] REaDFILE : InputFilePath ( INputXML)
-   [ ] Parse to js . ( INPUTJS)
-   [ ] Replace values for output
-   [ ] Set outputFileJS
-   [ ] Set outPutFileXML

WRITE

-   [ ] RootPath > OutputDir mkdir

“no overwrite option? Validate OutputFilepath excist bf write , error . No

-   [ ] Write xmlfile : OutputFilepatg : The path :: Root dir > outputDir > metaFile name,”sbs” outPutFileXML
-   [ ] If app option dump,
-   [ ] Write jsonDump : OutputFilepatg : The path :: Root dir > outputDir > metaFile name,”.json” , outputFileJS

-   [ ] OutputLOGfile , append? RootDir> logfile path.
-   [ ] Output outputDescriptionArr to DescFilepath

Graph meta : Source file name ( so u know if it’s bundled ? ) Package name Package version

Distribution id??

https://github.com/fastify/deepmerge

Get meta from source , remove from Metamapper- ( inSourcejson, inPackage replace )

Compare meta id with pkg.meta dict Loop thru source meta>treeArr If metaKey === pkg.meta.key, Then replace values Else metaKey

Meta:{

}

Loop thru
