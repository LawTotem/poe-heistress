<script lang="ts" >

import { JobList, RewardChests, RogueList, RunInfo } from '../utils/runinfo';

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
import { getTimeString } from '../utils/time';

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

const rewardmap = new Map<string, boolean>()
const rewardmap2 = new Map<string, boolean>()

HeistInfo.rewards.forEach(element =>{
    rewardmap.set(element, false)
    rewardmap2.set(element, false)
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
            hasDamage: new Map<string, boolean>(),
            hasReward: new Map<string, boolean>(),
            couldReward: new Map<string, boolean>(),
            currentRun: new RunInfo(),
            couldJob: new JobList(),
            jobRewards: jobrewards,
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
        HeistInfo.damage.forEach((e : string) => {
            this.hasDamage.set(e, false);
        })
        HeistInfo.rewards.forEach((e : string) => {
            this.couldReward.set(e, false);
            this.hasReward.set(e, false);
        })
        setInterval(this.getNow, 50)
    },
    methods: {
        convertLine(name : string, line : string) {
            return this.$t("rogues_long." + name) + ": " + this.$t("lines." + name + "." + line)
        },
        startTimer(zone : ZoneInfo) {
            this.timerStart = new Date();
            this.timerGrab = new Date();
            this.timerCurrent = new Date();
            this.hasDamage.forEach((v : boolean, k : string) => {
                this.hasDamage.set(k, false)
            })
            this.couldReward.forEach((v : boolean, k : string) => {
                this.couldReward.set(k, false);
                this.hasReward.set(k, false);
            })
            this.currentRun = new RunInfo()

            this.timerRunning = true;
            this.grabbedLoot = false;
            this.currentRun.tileset = zone.name
            this.name = zone.name
            zone.damage.forEach((element : string) => {
                this.hasDamage.set(element, true);
            })
            zone.jobs.forEach(element => {
                this.couldJob[element] = true;
                jobrewards.get(element).forEach( (reward : string) => {
                    this.couldReward.set(reward, true);
                })
            })
            this.updateRewards();
            sleep(150).then(() => {
                this.start_inventory = [new Map(), new Map()]
                window.tracker_access.pull_inventory().then((data : string) => {
                    this.start_inventory = parseInventory(data)
                })
            })
        },
        updateRewards() {
            this.hasReward.forEach((v : boolean, k : string) => {
                this.hasReward.set(k, false);
            })
            this.currentRun.jobs.currentJobs().forEach((v : string) => {
                jobrewards.get(v).forEach((r : string) => {
                    this.hasReward.set(r, true);
                })
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
                        const current_time = new Date()
                        sleep(150).then(() => {
                        window.tracker_access.pull_inventory().then((data : string) => {
                            const delta = inventoryDelta(this.start_inventory, parseInventory(data))
                            this.currentRun.run_time = current_time
                            this.currentRun.start = this.timerStart
                            this.currentRun.grab = this.timerGrab
                            this.currentRun.end = this.timerCurrent
                            this.currentRun.loot = delta
                            window.tracker_access.dump_run(this.currentRun.rejson())
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
                            if(this.currentRun.jobs.hasOwnProperty(lineinfo.job))
                            {
                                this.currentRun.jobs[lineinfo.job as keyof JobList] = true
                                this.updateRewards()
                            }
                            if (this.currentRun.rogues.hasOwnProperty(lineinfo.rogue))
                            {
                                this.currentRun.rogues[lineinfo.rogue as keyof JobList] = true
                            }
                            if (this.currentRun.rogues.currentRogues().length > 1){
                                this.currentRun.blueprint = true;
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
        getTime(start : Date, now : Date) : string {
            return getTimeString(start, now)
        },
        toggleBlueprint() {
            if (this.currentRun.blueprint)
            {
                this.currentRun.blueprint = false;
            }
            else
            {
                this.currentRun.blueprint = true;
            }
        },
        toggleJob(job : string) {
            if (this.currentRun.jobs[job])
            {
                this.currentRun.jobs[job] = false
            }
            else
            {
                this.currentRun.jobs[job] = true
            }
            this.updateRewards()
        },
        toggleRogue(rogue : string) {
            if (this.currentRun.rogues[rogue])
            {
                this.currentRun.rogues[rogue] = false
            }
            else
            {
                this.currentRun.rogues[rogue] = true
            }
        },
        addReward(reward : string) {
            const current = this.currentRun.reward_chests[reward as keyof RewardChests]
            this.currentRun.reward_chests[reward] = current + 1;
        },
        removeReward(reward : string) {
            const current = this.currentRun.reward_chests[reward as keyof RewardChests]
            if (current > 0)
            {
                this.currentRun.reward_chests[reward] = current - 1;
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
            <span v-if="currentRun.blueprint">{{ $t("common.blueprint") }}</span>
            <span v-if="!currentRun.blueprint">{{ $t("common.contract") }}</span> : {{ $t("instances." + name) }}
            <div class="damage-types"></div>
            <div class="damage-types" v-for="dmg in hasDamage">
                <img v-if="dmg[1]" :src="'../static/' + getDmgIcon(dmg[0])" />
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
            <div class="rogue-text" v-for="rogue in currentRun.rogues.rogueMap()">
                <span @click="toggleRogue(rogue[0])" :style="{'color': rogue[1] ? '#a1212a' : 'black'}">{{ $t("rogues_short." + rogue[0]) }}</span>
            </div>
        </div>
        <div v-if="trackLoot" class="flex-span">
            <div class="job-span" v-for="job in currentRun.jobs.jobMap()">
                <img @click="toggleJob(job[0])" :style="{'filter': job[1] ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': couldJob[job[0] as keyof JobList] ? '1.0' : '0.3'}" :src="'../static/' + getJobIcon(job[0])"/>
            </div>
        </div>
        <div id="rewards" v-if="trackLoot" class="reward-span">
            <div class="reward-button" v-for="reward in currentRun.reward_chests.rewardMap()" :style="{'opacity': couldReward.get(reward[0]) ? '1.0' : '0.3'}">
                <img @click.alt="removeReward(reward[0])" @click.exact="addReward(reward[0])"  :style="{'filter':  hasReward.get(reward[0]) ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': hasReward.get(reward[0]) ? '1.0' : '0.6'}" :src="'../static/' + getRewardIcon(reward[0])" :alt="$t('rewards.' + reward[0])" />
                <div @click.alt="removeReward(reward[0])" @click.exact="addReward(reward[0])" class="reward-button-text">
                    <span>{{ reward[1] }}</span>
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