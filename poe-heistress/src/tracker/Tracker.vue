<script lang="ts" >

import { RunInfo } from '../utils/runinfo';

import { HeistressRequest, RunStatus, RewardChests, JobList, all_rogues, all_damage, reward_type, reward_list, all_jobs } from '../utils/remoteinfo'

type CommandCallback = (command : string) => void;

declare interface TrackerInterface {
    register_command_callback : (call_back : CommandCallback) => void,
    read_client : () => string,
    get_setting : (name : string, default_value : string | number | boolean) => Promise<string | number | boolean>,
    pull_inventory : () => Promise<String>,
    dump_run : (run_info : any) => Promise<void>,
    update_remote : (run_status : object) => Promise<void>
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
            foundFile: false,
            jobRewards: jobrewards,
            start_inventory: [new Map(), new Map()],
            trackedRun: new RunStatus()
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
            if (all_damage.includes(e))
            {
                this.trackedRun.damage[e] = false
            }
            else
            {
                console.log('Warning -- invalid damage [' + e + ']')
            }
        })
        HeistInfo.rewards.forEach((e : string) => {
            if (reward_list.includes(e)){
                this.trackedRun.can_rewards[e] = 0;
                this.trackedRun.has_rewards[e] = 0;
                this.trackedRun.reward_chests[e] = 0;
            }
        })
        setInterval(this.getNow, 50)
        window.tracker_access.get_setting("enable_remote", true).then((data : boolean) => {
            if (data) {
                setInterval(this.sendUpdate, 500)
            }
        })
        window.tracker_access.register_command_callback((message : string) => {
            console.log('got message' + message)
            const data = JSON.parse(message)
            const request = new HeistressRequest('update').dejson(data)
            this.handleRequest(request)
        })
    },
    methods: {
        convertLine(name : string, line : string) {
            return this.$t("rogues_long." + name) + ": " + this.$t("lines." + name + "." + line)
        },
        startTimer(zone : ZoneInfo) {
            this.trackedRun = new RunStatus()
            this.trackedRun.timer_running = true;
            this.trackedRun.name = zone.name
            
            zone.damage.forEach((element : string) => {
                if (all_damage.includes(element)) {
                    this.trackedRun.damage[element] = true;
                } else {
                    console.warn('Invalid damage [' + element +']')
                }
            })
            zone.jobs.forEach(element => {
                if (all_jobs.includes(element)) {
                    this.trackedRun.could_job[element] = true;
                    jobrewards.get(element).forEach( (reward : string) => {
                        if (reward_list.includes(reward)) {
                            this.trackedRun.can_rewards[reward] = 1;
                        } else {
                            console.warn('Invalid reward [' + reward +']')
                        }
                    })
                } else {
                    console.warn('Invalid job [' + element + ']')
                }
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
            reward_list.forEach((k : string) => {
                this.trackedRun.has_rewards[k] = 0;
            })
            this.trackedRun.jobs.currentJobs().forEach((v : string) => {
                jobrewards.get(v).forEach((r : string) => {
                    if (reward_list.includes(r)) {
                        this.trackedRun.has_rewards[r] = 1
                    } else {
                        console.warn('Invalid reward [' + r + ']')
                    }
                })
            })
            this.trackedRun.can_rewards['small'] = 1;
            this.trackedRun.has_rewards['small'] = 1;
        },
        checkClient() {
            const line = window.tracker_access.read_client()
            if (line)
            {
                if (! this.trackedRun.timer_running)
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
                        this.trackedRun.timer_running = false;
                    }
                    else if (checkComplete(line))
                    {
                        const current_time = new Date()
                        sleep(150).then(() => {
                        window.tracker_access.pull_inventory().then((data : string) => {
                            const delta = inventoryDelta(this.start_inventory, parseInventory(data))
                            var currentRun = new RunInfo()
                            currentRun.run_time = current_time
                            currentRun.start = this.trackedRun.timer_start
                            currentRun.grab = this.trackedRun.timer_grab
                            currentRun.end = this.trackedRun.timer_end
                            currentRun.tileset = this.trackedRun.name
                            currentRun.loot = delta
                            currentRun.blueprint = this.trackedRun.blueprint
                            currentRun.reward_chests = this.trackedRun.reward_chests
                            currentRun.jobs = this.trackedRun.jobs
                            window.tracker_access.dump_run(currentRun.rejson())
                            })
                        })
                        this.trackedRun.timer_running = false;
                        this.sendUpdate()
                    }
                    else
                    {
                        const lineinfo = checkRogue(line)
                        if (lineinfo)
                        {
                            if(lineinfo.objective)
                            {
                                this.trackedRun.grabbed_loot = true;
                            }
                            if(all_jobs.includes(lineinfo.job))
                            {
                                this.trackedRun.jobs[lineinfo.job as keyof JobList] = true
                                this.updateRewards()
                            }
                            if (all_rogues.includes(lineinfo.rogue))
                            {
                                this.trackedRun.rogues[lineinfo.rogue as keyof JobList] = true
                            }
                            if (this.trackedRun.rogues.currentRogues().length > 1){
                                this.trackedRun.blueprint = true;
                            }
                            this.sendUpdate()
                        }
                    }
                }
            }
        },
        getNow() {
            this.checkClient()
            if (this.trackedRun.timer_running)
            {
                this.trackedRun.timer_current = new Date();
                if (! this.trackedRun.grabbed_loot)
                {
                    this.trackedRun.timer_grab = new Date();
                }
            }
        },
        getTime(start : Date, now : Date) : string {
            return getTimeString(start, now)
        },
        handleRequest(request : HeistressRequest) {
            if (request.type == 'toggle_blueprint') {
                if (this.trackedRun.blueprint) {
                    this.trackedRun.blueprint = false
                } else {
                    this.trackedRun.blueprint = true
                }
            }
            if (request.type == 'toggle_job') {
                if (all_jobs.includes(request.data)) {
                    const job = request.data;
                    if (this.trackedRun.jobs[job]) {
                        this.trackedRun.jobs[job] = false
                    } else {
                        this.trackedRun.jobs[job] = true
                    }
                    this.updateRewards()
                } else {
                    console.warn('Invalid job [' + request.data + ']')
                }
            }
            if (request.type == 'toggle_rogue') {
                if (all_rogues.includes(request.data)) {
                    const rogue = request.data;
                    if (this.trackedRun.rogues[rogue]) {
                        this.trackedRun.rogues[rogue] = false
                    } else {
                        this.trackedRun.rogues[rogue] = true
                    }
                } else {
                    console.warn('Invalid rogue [' + request.data + ']')
                }
            }
            if (request.type == 'add_reward') {
                if (reward_list.includes(request.data)) {
                    const reward = request.data;
                    const current = this.trackedRun.reward_chests[reward];
                    this.trackedRun.reward_chests[reward] = current + 1;
                } else {
                    console.warn('Invalid reward [' + request.data + ']')
                }
            }
            if (request.type == 'remove_reward') {
                if (reward_list.includes(request.data)) {
                    const reward = request.data;
                    const current = this.trackedRun.reward_chests[reward];
                    if (current > 0) {
                        this.trackedRun.reward_chests[reward] = current - 1;
                    }
                } else {
                    console.warn('Invalid reward [' + request.data + ']')
                }
            }
            this.sendUpdate()
        },
        toggleBlueprint() {
            const request = new HeistressRequest('toggle_blueprint')
            this.handleRequest(request)
        },
        toggleJob(job : string) {
            const request = new HeistressRequest('toggle_job', job)
            this.handleRequest(request)
        },
        toggleRogue(rogue : string) {
            const request = new HeistressRequest('toggle_rogue', rogue)
            this.handleRequest(request)
        },
        addReward(reward : string) {
            const request = new HeistressRequest('add_reward', reward)
            this.handleRequest(request)
        },
        removeReward(reward : string) {
            const request = new HeistressRequest('remove_reward', reward)
            this.handleRequest(request)
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
        },
        sendUpdate() {
            window.tracker_access.update_remote(this.trackedRun.rejson())
        }
    }
})
</script>

<template>
    <div class="tracker-div" id="tracker">
        <div class="flex-span" v-if="trackedRun.name">
            <span v-if="trackedRun.blueprint">{{ $t("common.blueprint") }}</span>
            <span v-if="!trackedRun.blueprint">{{ $t("common.contract") }}</span> : {{ $t("instances." + trackedRun.name) }}
            <div class="damage-types"></div>
            <div class="damage-types" v-for="dmg in trackedRun.damage.currentDamage()">
                <img :src="'../static/' + getDmgIcon(dmg)" />
            </div>
        </div>
        <div class="flex-span" v-else>
            {{ $t("common.notrunning") }}
        </div>
        <div class="flex-span">
            <div class="main-tracking">{{ getTime(trackedRun.timer_start, trackedRun.timer_current) }}</div>
            <div class="sub-tracking">
                <span>{{ $t("common.grab") }}</span>
                <span>{{ getTime(trackedRun.timer_start, trackedRun.timer_grab) }}</span>
            </div>
            <div class="sub-tracking">
                <span>{{ $t("common.complete") }}</span>
                <span>{{ getTime(trackedRun.timer_grab, trackedRun.timer_current) }}</span>
            </div>
            <div class="sub-tracking">
                <span class="blueprint" @click="toggleBlueprint">{{ $t("common.blueprint") }}</span>
            </div>
        </div>
        <div v-if="trackLoot" class="rogue-span">
            <div class="rogue-text" v-for="rogue in trackedRun.rogues.rogueMap()">
                <span @click="toggleRogue(rogue[0])" :style="{'color': rogue[1] ? '#a1212a' : 'black'}">{{ $t("rogues_short." + rogue[0]) }}</span>
            </div>
        </div>
        <div v-if="trackLoot" class="flex-span">
            <div class="job-span" v-for="job in trackedRun.jobs.jobMap()">
                <img @click="toggleJob(job[0])" :style="{'filter': job[1] ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': trackedRun.could_job[job[0] as keyof JobList] ? '1.0' : '0.3'}" :src="'../static/' + getJobIcon(job[0])"/>
            </div>
        </div>
        <div id="rewards" v-if="trackLoot" class="reward-span">
            <div class="reward-button" v-for="reward in trackedRun.reward_chests.rewardMap()" :style="{'opacity': trackedRun.can_rewards[reward[0] as reward_type] > 0 ? '1.0' : '0.3'}">
                <img @click.alt="removeReward(reward[0])" @click.exact="addReward(reward[0])"  :style="{'filter':  trackedRun.has_rewards[reward[0] as reward_type] > 0 ? 'grayscale(0%)' : 'grayscale(100%)', 'opacity': trackedRun.has_rewards[reward[0] as reward_type] > 0 ? '1.0' : '0.6'}" :src="'../static/' + getRewardIcon(reward[0])" :alt="$t('rewards.' + reward[0])" />
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