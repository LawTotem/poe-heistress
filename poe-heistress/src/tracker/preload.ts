// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { closeSync, existsSync, openSync, readSync, writeSync } from "fs";

var is_open = false;
var client_fh = 0;

ipcRenderer.invoke("getSetting", ["client_txt", ""]).then((client_txt) =>{
    if (existsSync(client_txt)) {
        is_open = true
        client_fh = openSync(client_txt, 'r')
        var b = Buffer.alloc(1024)
        var num_read = readSync(client_fh, b);
        while (num_read > 0) {
            num_read = readSync(client_fh, b);
        }
    }
})

var i = 0;
contextBridge.exposeInMainWorld(
  'tracker_access',
  {
    read_client() {
        if (is_open) {
            var b = Buffer.alloc(1024);
            const bytes = readSync(client_fh, b);
            return b.toString('utf8', 0, bytes);
        }
        return ""
    },
    async get_setting(name : string, default_value : string | number | boolean) {
        return ipcRenderer.invoke("getSetting", [name, default_value])
    },
    async pull_inventory() {
        return ipcRenderer.invoke("fetchInventory")
    },
    dump_run(run_info : any) {
        ipcRenderer.invoke("getSetting", ["dump_location", "./"]).then((loc : string) => {
            while (existsSync(loc + 'run_info_' + ('0000'+i).slice(-4) + '.json')) {
                i = i + 1;
            }
            const df = openSync(loc + 'run_info_' + ('0000'+i).slice(-4) + '.json', 'w')
            writeSync(df, JSON.stringify(run_info, null, 2))
            closeSync(df)
        })
    }
  }
)