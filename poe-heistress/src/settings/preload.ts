// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
  'settings_access',
  {
    async get_setting(name : string, default_value : string | number | boolean) {
        return ipcRenderer.invoke("getSetting", [name, default_value])
    },
    async set_setting(name : string, value : string | number | boolean) {
        return ipcRenderer.invoke("setSetting", [name, value])
    },
    async encrypt_string(string : string) {
        return ipcRenderer.invoke("encryptString", string)
    },
    async decrypt_string(string : string) {
        return ipcRenderer.invoke("decryptString", string)
    }
  }
)