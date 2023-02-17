<script lang="ts" >

import { RunInfo } from '../utils/runinfo';

declare interface TrackerInterface {
    read_client : () => string,
    get_setting : (name : string, default_value : string | number | boolean) => Promise<string | number | boolean>,
    pull_inventory : () => Promise<String>,
    dump_run : (run_info : any) => Promise<void>
}

declare global {
    interface Window {
        tracker_access : TrackerInterface
    }
}

import { defineComponent } from 'vue';
import HeistInfo from '../heist.json'
import Icons from '../resources/icons.json'
import { inventoryDelta, parseInventory } from './inventory';

type ZoneInfo = {
    name: string,
    line: string,
    jobs: string[],
    damage: string[],
    target: string
}

type RogueInfo = {
    name : string,
    jobs : string[],
    objective : string[],
    lines : string[],
    lockpicking? : string[],
    perception? : string[],
    agility? : string[],
    brute? : string[],
    demolition? : string[],
    engineering? : string[],
    trapdisarm? : string[],
    deception? : string[]
}

const damagemap = new Map<string, boolean>()

HeistInfo.damage.forEach(element => {
    damagemap.set(element, false)
});

const rewardmap = new Map<string, boolean>()
const rewardmap2 = new Map<string, boolean>()
const rewardcount = new Map<string, number>()

HeistInfo.rewards.forEach(element =>{
    rewardmap.set(element, false)
    rewardmap2.set(element, false)
    rewardcount.set(element, 0)
});

const roguemap = new Map()

HeistInfo.rogues.forEach(element => {
    roguemap.set(element.name, false)
});

const jobmap = new Map<string, boolean>()
const jobmap2 = new Map<string, boolean>()
const jobrewards = new Map<string, string[]>()

HeistInfo.jobs.forEach(element => {
    jobmap.set(element.name, false);
    jobmap2.set(element.name, false);
    jobrewards.set(element.name, element.rewards);
})

const start_lines = HeistInfo.zones.flatMap(element => element.line)


const room_map = new Map<string, ZoneInfo>()
HeistInfo.zones.forEach((element : ZoneInfo) => room_map.set(element.line, element))

function checkStart(line : string) {
    for (let sli in start_lines) {
        const sl = start_lines[sli];
        if (line.includes(sl)) {
            return room_map.get(sl)
        }
    }
    return {}
}

var died_line = ""

function checkDied(line : string) {
    return line.includes(died_line)
}

var complete_line = ""

function checkComplete(line : string) {
    return line.includes(complete_line)
}

var rogue_lines : string[] = []

type LineSummary = {
    rogue: string,
    objective: boolean,
    job: string
}

var lines_info : LineSummary[] = []

function checkRogue(line :string) : LineSummary {
    for (let rli in rogue_lines) {
        const rl = rogue_lines[rli]
        if (line.includes(rl)) {
            return lines_info[rli]
        }
    }
    return null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default defineComponent({
    data() {
        return {
            trackLoot: true,
            timerStart: new Date(),
            timerCurrent: new Date(),
            timerGrab: new Date(),
            timerRunning: false,
            grabbedLoot: false,
            foundFile: false,
            name: '',
            isBlueprint: false,
            info: HeistInfo,
            hasDamage: damagemap,
            hasReward: rewardmap,
            couldReward: rewardmap2,
            rewardCount: rewardcount,
            hasJob: jobmap,
            couldJob: jobmap2,
            jobRewards: jobrewards,
            hasRogue: roguemap,
            start_inventory: [new Map(), new Map()]
        }
    },
    created() {
        document.body.style.backgroundImage = "url('../static/paperbackground.png')"
        window.tracker_access.get_setting("tracker_trackloot", true).then((data : boolean) => {
            this.trackLoot = data
        })
        died_line = this.$t("lines.slain")
        complete_line = this.$t("lines.hub")
        HeistInfo.rogues.forEach((rogue : RogueInfo) => {
            rogue.objective.forEach(line => {
                rogue_lines.push(this.convertLine(rogue.name, line));
                lines_info.push({"rogue": rogue.name, "objective": true, "job": "none"})
            });
            rogue.lines.forEach(line => {
                rogue_lines.push(this.convertLine(rogue.name, line));
                lines_info.push({"rogue": rogue.name, "objective": false, "job": "none"})
            });
            rogue.jobs.forEach((job : keyof RogueInfo ) => {
                const job_lines = rogue[job] as string[]
                job_lines.forEach((line : string) => {
                    rogue_lines.push(this.convertLine(rogue.name, line));
                    lines_info.push({"rogue": rogue.name, "objective": false, "job": job})
                })
            })
        })
        setInterval(this.getNow, 50)
    },
    methods: {
        convertLine(name : string, line : string) {
            return this.$t("rogues_long." + name) + ": " + this.$t("lines." + name + "." + line)
        },
        startTimer(zone : ZoneInfo) {
            this.timerRunning = true;
            this.grabbedLoot = false;
            this.timerStart = new Date();
            this.timerGrab = new Date();
            this.timerCurrent = new Date();
            this.name = zone.name
            zone.damage.forEach((element : string) => {
                this.hasDamage.set(element, true);
            })
            zone.jobs.forEach(element => {
                this.couldJob.set(element, true);
                this.jobRewards.get(element).forEach( (reward : string) => {
                    this.couldReward.set(reward, true);
                })
            })
            sleep(100).then(() => {
                this.start_inventory = [new Map(), new Map()]
                window.tracker_access.pull_inventory().then((data : string) => {
                    this.start_inventory = parseInventory(data)
                })
                this.updateRewards();
            })
        },
        updateRewards() {
            this.hasReward.forEach((value : boolean, element : string) => {
                this.hasReward.set(element, false);
            })
            this.hasJob.forEach((value : boolean, element : string) => {
                if (value)
                {
                    this.jobRewards.get(element).forEach((reward : string) => {
                        this.hasReward.set(reward, true);
                    })
                }
            })
            this.hasReward.set("small", true);
        },
        checkClient() {
            const line = window.tracker_access.read_client()
            if (line)
            {
                if (! this.timerRunning)
                {
                    const room = checkStart(line)
                    if (room.hasOwnProperty("name"))
                    {
                        this.resetCounter()
                        this.startTimer(room)
                    }
                }
                else
                {
                    if (checkDied(line))
                    {
                        this.timerRunning = false;
                    }
                    else if (checkComplete(line))
                    {
                        sleep(100).then(() => {
                        window.tracker_access.pull_inventory().then((data : string) => {
                            const delta = inventoryDelta(this.start_inventory, parseInventory(data))
                            const current_time = new Date()
                            var run_info = {
                                run_time: current_time,
                                start: this.timerStart,
                                grab: this.timerGrab,
                                end: this.timerCurrent,
                                tileset: this.name,
                                loot: delta,
                                blueprint: this.isBlueprint,
                                reward_chests: {
                                    abyss: 0,
                                    armour: 0,
                                    blight: 0,
                                    breach: 0,
                                    currency: 0,
                                    delirium: 0,
                                    divination: 0,
                                    essences: 0,
                                    fossils: 0,
                                    fragments: 0,
                                    gems: 0,
                                    generic: 0,
                                    harbinger: 0,
                                    legion: 0,
                                    maps: 0,
                                    metamorph: 0,
                                    talismans: 0,
                                    trinkets: 0,
                                    uniques: 0,
                                    weapons: 0,
                                    small: 0
                                },
                                rogues: {
                                    karst: false,
                                    tibbs: false,
                                    isla: false,
                                    tullina: false,
                                    niles: false,
                                    nenet: false,
                                    vinderi: false,
                                    gianna: false,
                                    huck: false
                                },
                                jobs: {
                                    lockpicking: false,
                                    perception: false,
                                    cthaumaturgy: false,
                                    agility: false,
                                    engineering: false,
                                    demolition: false,
                                    trapdisarm: false,
                                    deception: false,
                                    brute: false
                                },
                                league: "",
                                account_name: "",
                                character_name: ""
                            } as RunInfo
                            this.rewardCount.forEach((value : number, element : keyof typeof run_info.reward_chests) => {
                                run_info.reward_chests[element] = value
                            })
                            this.hasRogue.forEach((value : boolean, element : keyof typeof run_info.rogues) => {
                                run_info.rogues[element] = value
                            })
                            this.hasJob.forEach((value : boolean, element : keyof typeof run_info.jobs) => {
                                run_info.jobs[element] = value
                            })
                            window.tracker_access.dump_run(run_info)
                            })
                        })
                        this.timerRunning = false;
                    }
                    else
                    {
                        const lineinfo = checkRogue(line)
                        if (lineinfo)
                        {
                            if(lineinfo.objective)
                            {
                                this.grabbedLoot = true;
                            }
                            if(lineinfo.job != "none")
                            {
                                this.hasJob.set(lineinfo.job, true);
                                this.updateRewards()
                            }
                            this.hasRogue.set(lineinfo.rogue, true);
                            var num_rogue = 0;
                            this.hasRogue.forEach((value : boolean, element : string) => {
                                if (value) {num_rogue = num_rogue + 1}
                            });
                            if (num_rogue > 1) {
                                this.isBlueprint = true
                            }
                        }
                    }
                }
            }
        },
        getNow() {
            this.checkClient()
            if (this.timerRunning)
            {
                this.timerCurrent = new Date();
                if (! this.grabbedLoot)
                {
                    this.timerGrab = new Date();
                }
            }
        },
        resetCounter() {
            this.timerRunning = false;
            this.name = ""
            this.hasDamage.forEach((value : boolean, element : string) => {
                this.hasDamage.set(element, false);
            })
            this.hasReward.forEach((value : boolean, element : string) => {
                this.hasReward.set(element, false);
                this.couldReward.set(element, false);
                this.rewardCount.set(element, 0);
            })
            this.hasRogue.forEach((value : boolean, element : string) => {
                this.hasRogue.set(element, false)
            })
            this.hasJob.forEach((value : boolean, element : string) => {
                this.hasJob.set(element, false)
                this.couldJob.set(element, false)
            })
            this.hasReward.set("small", true)
            this.couldReward.set("small", true)
        },
        getTime(start : Date, now : Date) : string {
            const dmilli = now.getMilliseconds() - start.getMilliseconds();
            const dsecs = now.getSeconds() - start.getSeconds();
            const dmin = now.getMinutes() - start.getMinutes();
            const dhour = now.getHours() - start.getHours();
            const ddays = now.getDay() - start.getDay();
            var delta = dmilli + 1000 * (dsecs + 60 * (dmin + 60 * (dhour + 24 * ddays)));
            if (delta < 0)
            {
                delta = 0;
            }
            const mins = Math.floor(delta / 1000 / 60);
            delta = delta - mins * 1000 * 60;
            const secs = Math.floor(delta / 1000);
            delta = delta - secs * 1000;
            const subsecs = Math.floor(delta/100);
            return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2) + "." + subsecs
        },
        toggleBlueprint() {
            if (this.isBlueprint)
            {
                this.isBlueprint = false;
            }
            else
            {
                this.isBlueprint = true;
            }
        },
        toggleJob(job : string) {
            if (this.hasJob.get(job))
            {
                this.hasJob.set(job, false)
            }
            else
            {
                this.hasJob.set(job, true)
            }
            this.updateRewards()
        },
        toggleRogue(rogue : string) {
            if (this.hasRogue.get(rogue))
            {
                this.hasRogue.set(rogue, false)
            }
            else
            {
                this.hasRogue.set(rogue, true)
            }
        },
        addReward(reward : string) {
            const current = this.rewardCount.get(reward)
            this.rewardCount.set(reward, current + 1)
        },
        removeReward(reward : string) {
            const current = this.rewardCount.get(reward)
            if (current > 0)
            {
                this.rewardCount.set(reward, current - 1)
            }
        },
        getDmgIcon(icon_name : string) : string {
            const icon = icon_name as keyof typeof Icons.damage
            return Icons.damage[icon]
        },
        getJobIcon(icon_name : string) : string {
            const icon = icon_name as keyof typeof Icons.jobs
            return Icons.jobs[icon]
        },
        getRewardIcon(icon_name : string) : string {
            const icon = icon_name as keyof typeof Icons.rewards
            return Icons.rewards[icon]
        }
    }
})
</script>

<template>
    <div class="tracker-div" id="tracker">
        <div class="flex-span" v-if="name">
            <span v-if="isBlueprint">{{ $t("common.blueprint") }}</span>
            <span v-if="!isBlueprint">{{ $t("common.contract") }}</span> : {{ $t("instances." + name) }}
            <div class="damage-types"></div>
            <div class="damage-types" v-for="dmg in info.damage">
                <img v-if="hasDamage.get(dmg)" :src="'../static/' + getDmgIcon(dmg)" />
            </div>
        </div>
        <div class="flex-span" v-else>
            {{ $t("common.notrunning") }}
        </div>
        <div class="flex-span">
            <div class="main-tracking">{{ getTime(timerStart, timerCurrent) }}</div>
            <div class="sub-tracking">
                <span>{{ $t("common.grab") }}</span>
                <span>{{ getTime(timerStart, timerGrab) }}</span>
            </div>
            <div class="sub-tracking">
                <span>{{ $t("common.complete") }}</span>
                <span>{{ getTime(timerGrab, timerCurrent) }}</span>
            </div>
            <div class="sub-tracking">
                <span class="blueprint" @click="toggleBlueprint">{{ $t("common.blueprint") }}</span>
            </div>
        </div>
        <div v-if="trackLoot" class="rogue-span">
            <div class="rogue-text" v-for="rogue in info.rogues" :key="rogue.name">
                <span @click="toggleRogue(rogue.name)" :style="{'color': hasRogue.get(rogue.name) ? '#a1212a' : 'black'}">{{ $t("rogues_short." + rogue.name) }}</span>
            </div>
        </div>
        <div v-if="trackLoot" class="flex-span">
            <div class="job-span" v-for="job in info.jobs">
                <img @click="toggleJob(job.name)" :style="{'filter': hasJob.get(job.name) ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': couldJob.get(job.name) ? '1.0' : '0.3'}" :src="'../static/' + getJobIcon(job.name)"/>
            </div>
        </div>
        <div id="rewards" v-if="trackLoot" class="reward-span">
            <div class="reward-button" v-for="reward in info.rewards" :key="reward" :style="{'opacity': couldReward.get(reward) ? '1.0' : '0.3'}">
                <img @click.alt="removeReward(reward)" @click.exact="addReward(reward)"  :style="{'filter':  hasReward.get(reward) ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': hasReward.get(reward) ? '1.0' : '0.6'}" :src="'../static/' + getRewardIcon(reward)" :alt="$t('rewards.' + reward)" />
                <div @click.alt="removeReward(reward)" @click.exact="addReward(reward)" class="reward-button-text">
                    <span>{{ rewardCount.get(reward) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css">
/*@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');*/
.tracker-div {
    font-family: "Caveat", cursive;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
    background-size:cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
.flex-span {
    display: flex;
    align-items: left;
    width: 100%;
    font-size: 3vw;
}
.damage-types {
    width: 5%;
}
.damage-types > img {
    width: 100%;
}
.main-tracking {
    width: 40%;
    font-size: 5vw;
}
.sub-tracking {
    width: 20%;
    font-size: 3vw;
}
.sub-tracking > span {
    display: block;
}
.blueprint {
    -webkit-app-region: no-drag;
}
.rogue-span {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
}
.rogue-text {
    -webkit-app-region: no-drag;
    display: inline-grid;
    font-size: 3vw;
    width: 100%
}
.job-span {
    width: 7%;
}
.job-span > img {
    -webkit-app-region: no-drag;
    width: 100%;
}
.reward-span {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
}
.reward-button {
    display: inline-grid;
    position: relative;
}
.reward-button > img {
    -webkit-app-region: no-drag;
    width:100%;
}
.reward-button-text {
    position: absolute;
    font-size: 3vw;
    bottom: 0.1vw;
    right: 0vw;
    text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
    color: darkslategray;
}
</style>