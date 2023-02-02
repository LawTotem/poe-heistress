<script lang="ts">

declare interface PricerInterface {
    register_price_callback : (call_back : () => void) => void,
    resize : () => void,
    get_screen : (video_ele : HTMLVideoElement,
                  overlay_canvas : HTMLCanvasElement,
                  img_canvas : HTMLCanvasElement,
                  full_canvas : HTMLCanvasElement, scale : number) => Promise<void>,
    grab_prices : () => Promise<Map<string, string>>,
    dump_image : (full_canvas : HTMLCanvasElement,
                  x : number, y : number, width : number, height : number,
                  scan_canvas : HTMLCanvasElement) => void,
    get_setting : (n: string, v : string | number | boolean ) => Promise<string | number | boolean>
}

declare global {
    interface Window {
        pricer_access : PricerInterface
    }
}

const tf = require('@tensorflow/tfjs');

function convertName(name : string) {
    return name.toUpperCase().replace(/ /g,"")
}

tf.setBackend('webgl')

var model : any = null;
const char_array = ['','A','B','C','D','E','F','G','H','I','J','K',
                    'L','M','N','O','P','Q','R','S','T','U','V','W',
                    'X','Y','Z','-','\'']

function CTCString(array : Array<number>) {
    var last_char = 0
    var rstring = ""
    array.forEach((c) => {
        if (c != last_char)
        {
            rstring = rstring + char_array[c]
        }
        last_char = c
    })
    return rstring
}

type FingerPrintT = [string[], string[], string[], string[]]

function fingerPrint(name : string) : FingerPrintT {
    var f1 = []
    var f2 = []
    var f3 = []
    var f4 = []
    for (let i = 0; i < name.length; ++i){
        const c1 = name.charAt(i)
        if (f1.indexOf(c1) == -1) {
            f1.push(c1)
        }
        if (i + 1 < name.length) {
            const c2 = name.substring(i,i+2)
            if (f2.indexOf(c2) == -1) {
                f2.push(c2)
            }
        }
        if (i + 2 < name.length) {
            const c3 = name.substring(i, i+3)
            if (f3.indexOf(c3) == -1) {
                f3.push(c3)
            }
        }
        if (i + 3 < name.length) {
            const c4 = name.substring(i, i+4)
            if (f4.indexOf(c4) == -1) {
                f4.push(c4)
            }
        }
    }
    return [f1, f2, f3, f4]
}

function compareFingerprints(scn : FingerPrintT,
                             ref : FingerPrintT) : number {
    const nf1 = scn[0]
    const nf2 = scn[1]
    const nf3 = scn[2]
    const nf4 = scn[3]

    const rf1 = ref[0]
    const rf2 = ref[1]
    const rf3 = ref[2]
    const rf4 = ref[3]

    var score = 0
    nf1.forEach((j) => {
        if (rf1.indexOf(j) >= 0) {
            score += 1;
        }
    })
    nf2.forEach((j) => {
        if (rf2.indexOf(j) >= 0) {
            score += 2;
        }
    })
    nf3.forEach((j) => {
        if (rf3.indexOf(j) >= 0) {
            score += 4;
        }
    })
    nf4.forEach((j) => {
        if (rf4.indexOf(j) >= 0) {
            score += 16;
        }
    })
    return score
}

function compare_match(p1 : [number, string, string], p2 : [number, string, string]) {
    return p2[0] - p1[0]
}

export default {
    data() {
        return {
            overlay_canvas: 0,
            overlay_offset: null,
            img_canvas: 0,
            full_canvas: 0,
            video_ele: 0,
            select_start_x: 0,
            select_start_y: 0,
            isDown: false,
            scale_factor: 3,
            grabbing: true,
            price_info: [],
            scan_value: "",
            prices: []
        }
    },
    mounted() {
        this.video_ele = document.getElementById("video")
        this.overlay_canvas = document.getElementById("overlay_canvas")
        this.full_canvas = document.getElementById("high_res")
        this.img_canvas = document.getElementById("img_canvas")
        window.pricer_access.register_price_callback(this.begin_grab)
        document.body.style.backgroundImage = "url('../static/paperbackground2.png')"
        document.body.style.backgroundSize = 'cover'
        //document.getElementById("grab").style.alignContent = "center"
        window.pricer_access.grab_prices().then((v) => {
            this.update_prices(v)
        })
        tf.ready().then(async () => {
            model = await tf.loadLayersModel("../heist_ocr_en/model.json")
        })
        window.pricer_access.get_setting('price_interval', 60*60).then((interval : number) => {
            setInterval(this.grab_prices, 1000 * interval)
        })
    },
    methods: {
        grab_prices() {
            window.pricer_access.grab_prices().then((v) =>{
                this.update_prices(v)
            })

        },
        begin_grab() {
            this.grabbing = true;
            window.pricer_access.get_screen(this.video_ele,
                                            this.overlay_canvas,
                                            this.img_canvas,
                                            this.full_canvas,
                                            this.scale_factor)
        },
        update_svalue(e : Event) {
            this.scan_value = convertName(this.scan_value)
        },
        check_price() {
            const fp = fingerPrint(this.scan_value)
            var tt : [number, string, string][] = []
            this.prices = []
            this.price_info.forEach((p : [string, FingerPrintT, string]) => {
                const v2 = compareFingerprints(fp, p[1])
                tt.push([v2, p[0], p[2]])
            })
            var num_price = 0
            tt.sort(compare_match)
            tt.forEach((p) => {
                if (num_price < 5) {
                    this.prices.push([p[1],p[2]])
                    num_price++;
                }
            })
        },
        update_prices(new_prices : Map<string, string>) {
            this.price_info  = [] as [string, FingerPrintT, string][];
            new_prices.forEach( (k : string, p : string) => {
                this.price_info.push(
                    [p, fingerPrint(convertName(p)), k + ' chaos']
                )
            })
        },
        selectdown(e : MouseEvent) {
            this.select_start_x = e.offsetX
            this.select_start_y = e.offsetY
            this.isDown = true;
        },
        selectup(e : MouseEvent) {
            this.isDown = false;
            const context = this.overlay_canvas.getContext('2d')
            context.strokeRect(this.select_start_x, this.select_start_y, this.select_width, this.select_height)
            const cvs= document.getElementById("grab") as HTMLCanvasElement
            const ctx2 = cvs.getContext('2d')
            const cvss = document.getElementById("small_grab") as HTMLCanvasElement
            const ctx2s = cvss.getContext('2d')
            cvs.width = 1000
            cvs.height = 50
            cvss.width = 500
            cvss.height = 25
            ctx2.fillRect(0,0,1000,50)
            ctx2s.fillRect(0,0,500,25)
            const sx = this.select_start_x * this.scale_factor
            const sy = this.select_start_y * this.scale_factor
            const sw = this.select_width * this.scale_factor
            const sh = this.select_height * this.scale_factor
            var sf = 50 / sh
            if (sw * sf > 1000)
            {
                sf = 1000 / sw
            }
            //cvs.width = this.select_width * this.scale_factor
            //cvs.height = this.select_height * this.scale_factor
            ctx2.drawImage(this.full_canvas,
                sx,
                sy,
                sw,
                sh, 0, 0,
                sw * sf,
                sh * sf)
            
            ctx2s.drawImage(this.full_canvas,
                sx,
                sy,
                sw,
                sh, 0, 0,
                sw * sf / 2,
                sh * sf / 2)
            window.pricer_access.dump_image(this.full_canvas, sx, sy, sw, sh, cvs)
            this.grabbing = false
            const img = tf.browser.fromPixels(cvs);
            const imgp = tf.cast(img.reshape([1, ...img.shape]), 'float32')
            const raw_prediction = model.predict(imgp)
            const prediction = raw_prediction.argMax(2).arraySync()[0]
            const pred_chars = CTCString(prediction)
            this.scan_value = pred_chars
            this.check_price()
        
            img.dispose()
            raw_prediction.dispose()
            imgp.dispose()

            window.pricer_access.resize()
        },
        selectout(e : MouseEvent) {
            this.isDown = false;
        },
        selectmove(e : MouseEvent) {
            if (!this.isDown)
            {
                return;
            }
            const mouseX = e.offsetX
            const mouseY = e.offsetY
            const context = this.overlay_canvas.getContext('2d')
            context.clearRect(0,0,this.overlay_canvas.width, this.overlay_canvas.height)
            this.select_width = mouseX - this.select_start_x;
            this.select_height = mouseY - this.select_start_y;
            context.strokeStyle = "rgba(0, 150, 150, 1)"
            context.fillStyle = "rgba(0, 150, 150, 0.3)"
            context.strokeRect(this.select_start_x, this.select_start_y, this.select_width, this.select_height)
            context.fillRect(this.select_start_x, this.select_start_y, this.select_width, this.select_height)
        }
    },
}
</script>

<template>
<video hidden id="video"></video>
<canvas hidden id="high_res"></canvas>
<canvas hidden id="grab"></canvas>
<div :hidden='! grabbing' class="wrapper">
<canvas id="img_canvas"></canvas>
<canvas @mousedown="selectdown"
        @mouseup="selectup"
        @mouseout="selectout"
        @mousemove="selectmove" id="overlay_canvas"></canvas>
</div>
<div :hidden='grabbing'>
<div class="grab-display">
    <canvas id="small_grab"></canvas>
</div>
<div class="grab-display">
    <input v-model="scan_value" @change="check_price"/>
</div>
<div>
    <div v-for="prc in prices">
        <span>{{ prc[0] }}</span> - <span> {{ prc[1] }}</span>
    </div>
</div>
<div class="seal-display"><img width="50" :src="'../static/' + 'WaxSeal.png'" /></div>
</div>
</template>

<style lang="css">
.pricer-body {
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
}
.seal-display{
    display:flex
}
.seal-display > img {
    margin-left:auto;
    margin-right: 0;
}
.wrapper{
    font-weight: bold;
    position: relative;
}
.wrapper > canvas {
    position: absolute;
}
.grab-display {
    display:flex
}
.grab-display > canvas {
    margin-right:auto;
    margin-left:auto;
}
.grab-display > input {
    -webkit-app-region: no-drag;
}
</style>