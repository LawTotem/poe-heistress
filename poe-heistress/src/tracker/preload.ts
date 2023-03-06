import { contextBridge, ipcRenderer } from "electron";
import { closeSync, existsSync, openSync, readSync, writeSync } from "fs";
import { RunInfo } from "../utils/runinfo";

var is_open = false;
var client_fh = 0;

var league = "";
var account_name = "";
var character = "";

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

ipcRenderer.invoke("getSetting", ["league", ""]).then((league_s : string) => {
    league = league_s
})
ipcRenderer.invoke("getSetting", ["account_name", ""]).then((account_name_s : string) => {
    account_name = account_name_s
})
ipcRenderer.invoke("getSetting", ["character", ""]).then((character_s : string) => {
    character = character_s
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
    dump_run(run_info_in : Object) {
        const run_info = new RunInfo().dejson(run_info_in)
        run_info.league = league
        run_info.account_name = account_name
        run_info.character_name = character
        ipcRenderer.invoke("getSetting", ["dump_location", "./"]).then((loc : string) => {
            while (existsSync(loc + 'run_info_' + ('0000'+i).slice(-4) + '.json')) {
                i = i + 1;
            }
            const df = openSync(loc + 'run_info_' + ('0000'+i).slice(-4) + '.json', 'w')
            writeSync(df, JSON.stringify(run_info.rejson(), null, 2))
            closeSync(df)
        })
    }
  }
)