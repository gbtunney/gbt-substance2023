aUpdaterPath = aContext.getBatchToolExePath(aBatchTool=sbsenum.BatchToolsEnum.UPDATER, aBatchToolsFolder=aBatchToolsFolder)
aPresetPackagePath = aContext.getDefaultPackagePath()
try:
    aCommand = [aUpdaterPath, '--no-dependency', '--output-path', '{inputPath}', '--output-name', '{inputName}', '--presets-path', aPresetPackagePath]
    log.info(aCommand)

    aRootDir = os.path.normpath(aPackagesFolderRootDir)

    for root, subFolders, files in os.walk(aRootDir):
        for aFile in files:
            if aFile.endswith('.sbs'):
                aPackagePath = os.path.join(root, aFile)
                aDoc = substance.SBSDocument(aContext=aContext, aFileAbsPath=aPackagePath)
                log.info('Parse substance '+aPackagePath)
                try:
                    aDoc.parseDoc()
                except SBSIncompatibleVersionError:
                    pass

                if aDoc.mFormatVersion == aPreviousVersion and aDoc.mUpdaterVersion == aPreviousUpdaterVersion:
                    aMutatorCmd = aCommand + ['--input', aPackagePath]
                    print(aMutatorCmd)
                    log.info('Update substance '+aPackagePath)
                    subprocess.check_call(aMutatorCmd)

    log.info('=> All packages have been updated using the Mutator Batch Tool')
    return True

except BaseException as error:
    log.error("!!! [demoUpdatePackagesVersion] Failed to update a package")
    raise error
