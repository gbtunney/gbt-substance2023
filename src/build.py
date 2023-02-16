#!/usr/bin/env python
import os
import sys
import batchtools_utilities as batchtools

# TODO: Parse arguments

__copyright__ = '@copyright Allegorithmic. All rights reserved.'
__author__ = 'gaetan.lassagne@allegorithmic.com'
VERSION = 'BatchTools demo scripts 0.1'

"""
Module **demos** provides usage examples of the Substance Batchtools and the **batchtools_utilites** module.
"""


def get_batchtools_path():
    SAT_env = 'SDAPI_SATPATH'

    # Detect if we have an environment variable providing the location for the SAT
    if not os.environ.get(SAT_env) is None:
        path = os.environ.get(SAT_env)
        print('Overriding path to batch tools using path: %s from environment variable %s' %
              (path, SAT_env))
        return path

    # Detect based on default locations on systems
    if 'win32' in sys.platform:
        batchtools_path = 'C:/Program Files/Allegorithmic/Substance Automation Toolkit/'
        # an option is not to search the SPT batchtools to assume the script is launched from inside the app itself
        # and checking the app name is in the current path so the var will be:
        # batchtools_path = os.path.join(os.path.abspath(os.curdir), '../../')
    elif 'darwin' in sys.platform:
        batchtools_path = '/Applications/Substance Automation Toolkit/'
    elif 'linux' in sys.platform:
        # Path relative to the sample scripts assuming the directory from
        # the zip is untouched
        script_path = os.path.dirname(os.path.realpath(__file__))
        batchtools_path = os.path.join(script_path, '..')
    else:
        # calling it from a specifc distro not supported
        raise BaseException('Unknown platform.')

    if os.path.exists(batchtools_path):
        return batchtools_path
    else:
        raise OSError('Automation Toolkit not found.')


def get_sample_base_path():
    # Relative path assuming sample scripts are installed next
    # to the data and run from the directory they are in
    sample_base_path = '.'

    return sample_base_path


def ensure_directory_creation(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)


def main(initial_path):
    batchtools_path = os.path.normpath(get_batchtools_path())

    tool_names = ['sbsbaker', 'sbscooker', 'sbsmutator', 'sbsrender']
    sample_dir_names = ['Sbs', 'Sbsar', 'Meshes']

    base_resources_path = os.path.join(batchtools_path, 'resources', 'packages')
    base_docs_path = get_sample_base_path()
    base_samples_path = base_docs_path # os.path.join(base_docs_path, 'samples')
    base_output_path = os.path.join(base_docs_path, './../dist')

    exe_path = {exe: os.path.join(batchtools_path, exe) for exe in tool_names}
    samples_path = {_dir: os.path.join(base_samples_path, _dir) for _dir in sample_dir_names}
    output_path = {_dir: os.path.join(base_output_path, _dir) for _dir in sample_dir_names}

    # Set graph attributes and icon
    #aGraph.setAttribute(aAttributeIdentifier = sbsenum.AttributesEnum.Author, aAttributeValue = 'Substance Designer API')
    #aGraph.setIcon(aIconAbsPath = sbsDoc.buildAbsPathFromRelToMePath('Bitmaps/graphIcon.jpg'))

    # create the output folders
    if not os.path.exists(base_docs_path):
        raise OSError('User directory {} not found'.format(base_docs_path))

    for key, value in output_path.items():
        ensure_directory_creation(value)

    batchtools.cook_sbsar_files(exe_path['sbscooker'], base_resources_path, samples_path['Sbs'], output_path['Sbs'])


     # Generate bitmaps from sbsar detected at specified location
     #batchtools.render_sbsar_files(exe_path['sbsrender'], samples_path['Sbsar'], '11', '11', output_path['Sbsar'])

    # Export sbs files detected at specified location with dependencies
    #batchtools.export_sbs_files_with_dep(exe_path['sbsmutator'], base_resources_path, samples_path['Sbs'], output_path['Sbs'])


if __name__ == '__main__':
    # Update the current dir to the directory where the script is located
    os.chdir(os.path.abspath(os.path.dirname(__file__)))
    main(sys.argv[1:])
