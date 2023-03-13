import os
import subprocess
import sys
import threading

try:
    if sys.version_info.major == 2:
        import Queue as queue
    elif sys.version_info.major == 3:
        import queue
except ImportError as e:
    raise e.message


__copyright__ = "@copyright Allegorithmic. All rights reserved."
__author__ = "gaetan.lassagne@allegorithmic.com"
VERSION = "BatchTools demo scripts 0.1"

"""
Needed to run the script:
- Python 2.7.x or 3.x
- Substance Batchtools 6.x 
- Substance Designer 6.x (resources required for "sbsmutator" or "sbscooker")
"""

"""
GENERATE A COMMAND LINE STRING FROM A LIST OF ARGUMENTS
"""


def list_to_command_line(string_array):
    # Note, using subprocess.list2cmdline rather than join
    # means we see the actual command line generated with citations etc.
    return subprocess.list2cmdline(string_array)


"""
RENDER SBSAR TO BITMAPS
"""


# Create sbsar from sbs files using sbscooker
def render_sbsar(
    sbsrender_path,
    sbsar_file_path,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    # Classic cooking (no error log)
    cmd = [
        sbsrender_path,
        "render",
        "--inputs",
        sbsar_file_path,
        "--set-value",
        "$outputsize@" + width_resolution + "," + height_resolution,
        "--output-path",
        output_path,
    ]
    if debug:
        print("____________________")
        print("Processing: " + sbsar_file_path)
        print("Command: " + list_to_command_line(cmd))
    run_command_popen(cmd)


"""
RENDER BITMAPS FROM SBSAR DETECTED AT SPECIFIED LOCATION
"""


def render_sbsar_files(
    sbsrender_path,
    sbsar_files_path,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    files_to_process = get_files_by_extension(sbsar_files_path, ".sbsar", debug)
    if files_to_process:
        for sbsar in files_to_process:
            render_sbsar(
                sbsrender_path,
                sbsar,
                width_resolution,
                height_resolution,
                output_path,
                debug,
            )
    else:
        print("No sbsar file detected at: " + sbsar_files_path)


"""
EXPORT SBS WITH DEPENDENCIES
"""


# Export sbs with dependencies
def export_sbs_with_dep(
    sbsmutator_path, sd_resources_path, sbs_file_path, output_path, debug=True
):
    # Classic cooking (no error log)
    export_cmd = [
        sbsmutator_path,
        "export",
        "--input",
        sbs_file_path,
        "--presets-path",
        sd_resources_path,
        "--preserve-alias",
        '"sbs"',
        "--output-path",
        output_path,
    ]
    if debug:
        print("____________________")
        print("Processing: " + sbs_file_path)
        print("Command: " + list_to_command_line(export_cmd))
    run_command_popen(export_cmd)


"""
EXPORT SBS DETECTED AT SPECIFIED LOCATION WITH DEPENDENCIES
"""


def export_sbs_files_with_dep(
    sbsmutator_path, sd_resources_path, sbs_files_path, output_path, debug=True
):
    files_to_process = get_files_by_extension(sbs_files_path, ".sbs", debug)
    if files_to_process:
        for sbs in files_to_process:
            export_sbs_with_dep(
                sbsmutator_path, sd_resources_path, sbs, output_path, debug
            )
    else:
        print("No sbs file detected at: " + sbs_files_path)


"""
CREATE SBSAR FROM SBS
"""


# Create sbsar from sbs files using sbscooker
def cook_sbsar(
    sbscooker_path, sd_resources_path, sbs_file_path, output_path, debug=True
):
    # Classic cooking (no error log)
    cook_sbsar_cmd = [
        sbscooker_path,
        "--inputs",
        sbs_file_path,
        "--includes",
        sd_resources_path,
        "--quiet",
        "--size-limit",
        "13",
        "--output-path",
        output_path,
    ]
    if debug:
        print("____________________")
        print("Processing: " + sbs_file_path)
        print("Command: " + list_to_command_line(cook_sbsar_cmd))
    run_command_popen(cook_sbsar_cmd)


"""
CREATE SBSAR FROM SBS DETECTED AT SPECIFIED LOCATION
"""


def cook_sbsar_files(
    sbscooker_path, sd_resources_path, sbs_files_path, output_path, debug=True
):
    files_to_process = get_files_by_extension(sbs_files_path, ".sbs", debug)
    if files_to_process:
        for sbs in files_to_process:
            cook_sbsar(sbscooker_path, sd_resources_path, sbs, output_path, debug)
    else:
        print("No sbs file detected at: " + sbs_files_path)


"""
BAKE MODELS NORMAL MAP FROM MESHES USING LOW AND HIGH POLY
"""


# Bake normal maps from meshes detected (will collect .obj and low/high poly based on "_high" and "_low" suffix)
def bake_normal_from_meshes(
    sbsbaker_path,
    meshes_path,
    meshes_extension,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    meshes_dictionary = detect_high_and_low_poly_meshes(
        meshes_path, meshes_extension, debug
    )
    for low_poly, high_poly in meshes_dictionary.items():
        bake_nrm_cmd = [
            sbsbaker_path,
            "normal-from-mesh",
            "--inputs",
            low_poly,
            "--highdef-mesh",
            high_poly,
            "--quiet",
            "--output-size",
            width_resolution + "," + height_resolution,
            "--output-path",
            output_path,
        ]
        if debug:
            print("____________________")
            print("Baking Normal map using : " + low_poly + " and " + high_poly)
            print("Command: " + list_to_command_line(bake_nrm_cmd))
        run_command_popen(bake_nrm_cmd)


# Bake normal maps from meshes detected and match by name (will collect .obj and low/high poly based on "_high" and "_low" suffix)
def bake_normal_from_meshes_match_by_name(
    sbsbaker_path,
    meshes_path,
    meshes_extension,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    meshes_dictionary = detect_high_and_low_poly_meshes(
        meshes_path, meshes_extension, debug
    )
    for low_poly, high_poly in meshes_dictionary.items():
        bake_nrm_cmd = [
            sbsbaker_path,
            "normal-from-mesh",
            "--inputs",
            low_poly,
            "--highdef-mesh",
            high_poly,
            "--quiet",
            "--match",
            "1",
            "--output-size",
            width_resolution + "," + height_resolution,
            "--output-path",
            output_path,
        ]
        if debug:
            print("____________________")
            print("Baking Normal map using : " + low_poly + " and " + high_poly)
            print("Command: " + list_to_command_line(bake_nrm_cmd))
        run_command_popen(bake_nrm_cmd)


"""
BAKE MODELS ID MAP FROM MESHES USING LOW AND HIGH POLY
"""


# Bake id maps from meshes detected (will collect .obj and low/high poly based on "_high" and "_low" suffix)
def bake_id_from_meshes(
    sbsbaker_path,
    meshes_path,
    meshes_extension,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    meshes_dictionary = detect_high_and_low_poly_meshes(
        meshes_path, meshes_extension, debug
    )
    for low_poly, high_poly in meshes_dictionary.items():
        bake_id_cmd = [
            sbsbaker_path,
            "color-from-mesh",
            "--inputs",
            low_poly,
            "--highdef-mesh",
            high_poly,
            "--color-source",
            "1",
            "--output-size",
            width_resolution + "," + height_resolution,
            "--output-path",
            output_path,
        ]
        if debug:
            print("____________________")
            print("Baking ID map using : " + low_poly + " and " + high_poly)
            print("Command: " + list_to_command_line(bake_id_cmd))
        run_command_popen(bake_id_cmd)


# Bake id maps from meshes detected (will collect .obj and low/high poly based on "_high" and "_low" suffix)
def bake_id_from_meshes_match_by_name(
    sbsbaker_path,
    meshes_path,
    meshes_extension,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    meshes_dictionary = detect_high_and_low_poly_meshes(
        meshes_path, meshes_extension, debug
    )
    for low_poly, high_poly in meshes_dictionary.items():
        bake_id_cmd = [
            sbsbaker_path,
            "color-from-mesh",
            "--inputs",
            low_poly,
            "--highdef-mesh",
            high_poly,
            "--color-source",
            "1",
            "--match",
            "1",
            "--output-size",
            width_resolution + "," + height_resolution,
            "--output-path",
            output_path,
        ]
        if debug:
            print("____________________")
            print("Baking ID map using : " + low_poly + " and " + high_poly)
            print("Command: " + list_to_command_line(bake_id_cmd))
        run_command_popen(bake_id_cmd)


"""
BAKE INFORMATION USING A LOW POLY AND NORMAL MAP
"""


# Bake a map ("baker_name" can be "ambient-occlusion", "curvature", "position", etc.) from low poly meshes detected and normal maps list (as those bakers are GPU based)
def bake_from_meshes_and_nrm(
    sbsbaker_path,
    baker_name,
    meshes_path,
    meshes_extension,
    nrm_path,
    nrm_extension,
    width_resolution,
    height_resolution,
    output_path,
    debug=True,
):
    detected_meshes = get_files_by_extension(meshes_path, meshes_extension, True)
    detected_nrm = get_files_by_extension(nrm_path, nrm_extension, True)
    meshes_and_nrm_dictionary = {}

    if detected_meshes != None:
        for d in detected_meshes:
            # Check if it's a low poly
            if "_low" in d:
                mesh_name = os.path.split(d)[1]
                mesh_name_no_ext = os.path.splitext(mesh_name)[0]
                needed_nrm_name = mesh_name_no_ext + "_normal-from-mesh"
                # Check if we can get a Normal map based on mesh name
                if detected_nrm != None:
                    for nrm in detected_nrm:
                        if needed_nrm_name in nrm:
                            meshes_and_nrm_dictionary[d] = nrm
                else:
                    print(
                        "No Normal maps detected at: "
                        + str(nrm_path)
                        + " for "
                        + str(baker_name)
                        + " baker."
                    )
        for low_poly, nrm in meshes_and_nrm_dictionary.items():
            bake_from_low_cmd = [
                sbsbaker_path,
                baker_name,
                "--inputs",
                low_poly,
                "--normal",
                nrm,
                "--output-size",
                width_resolution + "," + height_resolution,
                "--output-path",
                output_path,
            ]
            if debug:
                print("____________________")
                print("Baking " + baker_name + " using : " + low_poly + " and " + nrm)
                print("Command: " + list_to_command_line(bake_from_low_cmd))
            run_command_popen(bake_from_low_cmd)


"""
HELPERS : functions not related to Substance Batchtools
"""


def run_command_popen(cmd):
    sp = subprocess.Popen(cmd, stderr=subprocess.PIPE)
    out, err = sp.communicate()
    if err:
        print("__________________________")
        print("Subprocess standard error:")
        print(err.decode("ascii"))
    sp.wait()


# Get files (recursively or not) based on specified path and extension
def get_files_by_extension(path_name, extension, recursive):
    # path_name = '\"' + path_name +'\"';
    if os.path.exists(path_name):
        detected_files = []
        # Get files in all folders/sub folders
        if recursive:
            for dirName, subdirList, fileList in os.walk(str(path_name)):
                for fName in fileList:
                    if os.path.splitext(fName)[1] == extension:
                        file_complete_path = os.path.join(dirName, fName)
                        detected_files.append(file_complete_path)
        else:
            # Get files at root level
            dirName = os.listdir(str(path_name))
            for fName in dirName:
                if os.path.splitext(fName)[1] == extension:
                    file_complete_path = os.path.join(path_name, fName)
                    detected_files.append(file_complete_path)
        if detected_files:
            return detected_files
        else:
            print("No resource detected based on following extension: " + extension)
            return None
    else:
        print("Please specify a valid source path. Current path: " + path_name)
        return None


# Detect high and low poly obj meshes based on name convention ("_high" and "_low" suffix)
def detect_high_and_low_poly_meshes(path_name, extension, recursive):
    detected_meshes = get_files_by_extension(path_name, extension, recursive)
    detected_meshes_dict = {}
    final_dict = {}

    if detected_meshes != None:
        for m in detected_meshes:
            mesh_path = m
            mesh_name = os.path.split(m)[1]
            detected_meshes_dict[mesh_name] = mesh_path

        for k in detected_meshes_dict:
            # Check if we get a low poly mesh
            if "_low" in k:
                # Check if it already exists in our final listing
                if final_dict.get(detected_meshes_dict[k]) == None:
                    # Check if a high poly version for the mesh is available in detected meshes
                    high_poly_key_name = (
                        os.path.splitext(k)[0][:-4] + "_high" + os.path.splitext(k)[1]
                    )
                    if detected_meshes_dict.get(high_poly_key_name) != None:
                        # Store the low poly path as key and high poly path as value
                        final_dict[detected_meshes_dict[k]] = detected_meshes_dict[
                            high_poly_key_name
                        ]

    return final_dict


def run_thread(task_queue):
    """
    Function pulling a job from a task queue and returns whem
    the queue is empty

    :param task_queue: The queue of jobs to pull from
    :type task_queue: Queue.queue with functions in
    :return: None
    """
    while not task_queue.empty():
        try:
            job = task_queue.get_nowait()
            job()
        except queue.Empty:
            return


def run_thread(task_queue):
    """
    Thread main function for grabbing a function from a queue and run it

    :param task_queue: The queue of jobs to pull from
    :type task_queue: Queue.queue with functions in
    :return: None
    """
    while not task_queue.empty():
        try:
            job = task_queue.get_nowait()
            job()
        except queue.Empty:
            return


def run_tasks(task_list, thread_count):
    """
    Runs a list of tasks on a specified number of threads

    :param task_list: A list of independent functions to be run on different threads
    :type task_list: [] with functions in
    :param thread_count: The number of threads to run on
    :type thread_count: int
    :return: None
    """
    # Put all the tasks in the queue
    task_queue = queue.Queue()
    [task_queue.put(task) for task in task_list]
    threads = []

    # Start thread_count number of threads pulling jobs
    # from task_queue
    for i in range(0, thread_count):
        t = threading.Thread(target=run_thread, args=(task_queue,))
        threads.append(t)
        t.start()

    # Join all threads to wait until all jobs done
    for t in threads:
        t.join()


def get_gpu_engine_for_platform():
    """
    Gets the gpu engine string for the current platform

    :return: string the gpu engine string
    """
    from sys import platform

    if "linux" in platform:
        return "ogl3"
    elif "darwin" in platform:
        return "ogl3"
    elif "win" in platform:
        return "d3d11pc"
    raise BaseException("Failed to identify platform")
