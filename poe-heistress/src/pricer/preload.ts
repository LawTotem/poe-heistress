// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";

type PriceCallback = () => void;
type CommandCallback = (command : string) => void;

var i = 0;
contextBridge.exposeInMainWorld(
    'pricer_access',
    {
        register_price_callback(call_back : PriceCallback) {
            ipcRenderer.on('PRICE_EVENT', () => {
                call_back()
            })
        },
        register_command_callback(call_back : CommandCallback) {
            ipcRenderer.on('COMMAND_EVENT', (e, args) => {
                const c = args[0] as Uint8Array
                const v = String.fromCharCode.apply(null, c)
                call_back(v)
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
                context.drawImage(full_canvas, 0, 0, width / scale, height / scale)
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
        async remote_screen(screen_canvas : HTMLCanvasElement) {
            screen_canvas.toBlob( (dblb : Blob) => {
                console.log(dblb)
                dblb.arrayBuffer().then( (ablb : ArrayBuffer) => {
                    const arry = new Uint8Array(ablb)
                    console.log(arry)
                    ipcRenderer.invoke('ScreenUpdate', arry.toString())
                })
            })
        },
        async grab_prices() {
            return await ipcRenderer.invoke('FetchPrices')
        },
        async remote_price(prices : object) {
            ipcRenderer.invoke('PriceUpdate', JSON.stringify(prices))
        }
    }
)