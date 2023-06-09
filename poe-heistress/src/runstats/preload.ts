import { contextBridge, ipcRenderer } from "electron";
import { readdir, readFile} from "fs/promises";
import path from "path";
import { RunInfo } from "../utils/runinfo";
import { RunStatsInterface } from "./analysis";

function isRun(file_name : string) {
    return file_name.startsWith("run_info_") && file_name.endsWith(".json")
}

contextBridge.exposeInMainWorld(
    'runstats_access',
    {
        async load_run(file_name: string) {
            const file_contents = await readFile(file_name)
            return JSON.parse(file_contents.toString())
        },
        get_dir(file_name : string) {
            return path.parse(file_name).dir
        },
        check_dir(dir_name : string, call_back : (files : string[]) => void) {
            readdir(dir_name).then((files : string[]) => {
                const good_files = files.filter(isRun).map((file_name:string) => { return path.join(dir_name,file_name) })
                call_back(good_files)
            })
        },
        async get_summary(file_name : string) {
            const file_contents = await readFile(file_name)
            return JSON.parse(file_contents.toString())
        },
        async get_correction(file_name : string) {
            const file_contents = await readFile(file_name)
            return JSON.parse(file_contents.toString())
        }
    } as RunStatsInterface
)