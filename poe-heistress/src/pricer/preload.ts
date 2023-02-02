// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";

type PriceCallback = () => void;

var i = 0;
contextBridge.exposeInMainWorld(
    'pricer_access',
    {
        register_price_callback(call_back : PriceCallback) {
            ipcRenderer.on('PRICE_EVENT', () => {
                call_back()
            })

        },
        resize() {
            ipcRenderer.invoke('resizePricer', [540, 250]).then()
        },
        async get_setting(name : string, default_value : string | number | boolean) {
            return ipcRenderer.invoke("getSetting", [name, default_value])
        },
        async get_screen(video_ele : HTMLVideoElement,
                         overlay_canvas : HTMLCanvasElement,
                         img_canvas : HTMLCanvasElement,
                         full_canvas : HTMLCanvasElement, scale : number) {
            const sourceId = await ipcRenderer.invoke("PoEWindowID")
            const stream = await (<any> navigator.mediaDevices).getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId
                    }
                }
            }) as MediaStream
            const width = stream.getTracks()[0].getSettings().width
            const height = stream.getTracks()[0].getSettings().height
            ipcRenderer.invoke('resizePricer', [Math.round(width/scale) + 15,Math.round(height/scale) + 15])
            video_ele.srcObject = stream
            video_ele.onloadeddata = (e) => {
                video_ele.play()
                overlay_canvas.width = width / scale
                overlay_canvas.height = height / scale
                img_canvas.width = width / scale
                img_canvas.height = height / scale
                full_canvas.width = width
                full_canvas.height = height
                const context = img_canvas.getContext('2d')
                const context_full = full_canvas.getContext('2d')
                context_full.drawImage(video_ele, 0, 0, width, height)
                ipcRenderer.invoke('showPricer', [])
                context.drawImage(full_canvas, 0, 0, width/3, height/3)
                video_ele.srcObject = null
                stream.getTracks().forEach((track) => {
                    track.stop()
                })
            }
        },
        async dump_image(full_canvas : HTMLCanvasElement,
            x : number,
            y : number,
            width : number,
            height : number,
            scan_canvas : HTMLCanvasElement) {
            ipcRenderer.invoke("getSetting", ["dump_image", true]).then((dump : boolean) => {
                if(dump) {
                    console.log("dumping image")
                    ipcRenderer.invoke("getSetting", ["dump_location", "./"]).then((loc : string) => {
                        while (existsSync(loc + 'price_scan_' + ('0000'+i).slice(-4) + '.json')) {
                            i = i + 1;
                        }
                        const info = {
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        }
                        console.log( ('0000'+i).slice(-4))
                        writeFile(loc + 'price_scan_' + ('0000' + i).slice(-4) + '.json',
                                JSON.stringify(info))
                        full_canvas.toBlob( (dblb : Blob) => {
                            dblb.arrayBuffer().then((ablb :ArrayBuffer) => {
                                writeFile(loc + 'price_scan_fs_' + ('0000' + i).slice(-4) + '.png', Buffer.from(new Uint8Array(ablb)))
                            })
                        },"image/png")
                        scan_canvas.toBlob( (dblb : Blob) => {
                            dblb.arrayBuffer().then((ablb :ArrayBuffer) => {
                                writeFile(loc + 'price_scan_sel_' + ('0000' + i).slice(-4) + '.png', Buffer.from(new Uint8Array(ablb)))
                            })
                        },"image/png")
                    })
                }
            })  
        },
        async grab_prices() {
            return await ipcRenderer.invoke('FetchPrices')
        }
    }
)