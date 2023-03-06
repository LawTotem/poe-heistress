<script lang="ts">
import { RunStatsInterface, RunStat, statRun } from "./analysis";
import { FullRewards, full_reward_keys, RunInfo } from '../utils/runinfo';
import { getTimeString } from '../utils/time';
import Icons from '../resources/icons.json'

import { matrix, pinv, multiply, identity, transpose, add } from 'mathjs'
import { file } from "@babel/types";
import { RoomMap } from "../heistinfo";

declare global {
    interface Window {
        runstats_access : RunStatsInterface
    }
}

type RunFile = {
    file_name : string,
    data : RunInfo,
    time : Date
}

type StatSummary = {
    name : string,
    stack : number
}


export default {
    data() {
        return {
            in_config: true,
            file_select: "",
            sorted_runs: [] as RunFile[],
            run_folders: [] as string[],
            show_run: null as RunInfo,
            show_reward_chests: null as FullRewards,
            show_run_file_name: "",
            show_summary: [] as StatSummary[],
            known_files: [] as string[],
            statistics: [] as RunStat[],
            run_loot_summaries: [] as number[][],
            run_room_summaries: [] as FullRewards[],
            need_update: true,
            drop_keys: full_reward_keys,
            summary_rates: [] as number[][],
            include_blueprints: true,
            include_contracts: true,
            include_trinkets: false,
            calculating: false,
            correction: new Map<string, Map<string, number>>()
        }
    },
    computed: {
        show_rewards: function() {
            return this.drop_keys.filter((reward : keyof typeof this.show_reward_chests) => {
                return this.show_reward_chests[reward] > 0
            })
        }
    },
    mounted() {
        setInterval(this.check_folders, 400)
        setInterval(this.calc_stats, 1000)
    },
    methods: {
        check_folders() {
            this.check_folders_async()
        },
        async check_folders_async() {
            this.run_folders.forEach((fld : string) => {
                window.runstats_access.check_dir(fld, this.check_files)
            })
        },
        add_folder() {
            const fi = this.$refs["file"] as HTMLInputElement
            fi.click()
        },
        folder_changed() {
            const fi = this.$refs["file"] as HTMLInputElement
            const folder = window.runstats_access.get_dir(fi.files[0].path)
            if (! this.run_folders.includes(folder))
            {
                this.run_folders.push(folder)
                window.runstats_access.check_dir(folder, this.check_files)
            }
        },
        add_summary() {
            const fi = this.$refs["summary"] as HTMLInputElement
            fi.click()
        },
        summary_changed() {
            const fi = this.$refs["summary"] as HTMLInputElement
            const file = fi.files[0].path
            window.runstats_access.get_summary(file).then((stat : RunStat) => {
                this.statistics.push(stat)
                this.need_update = true
            })
        },
        check_files(files : string[]) {
            files.forEach((fn : string) => {
                if (! this.known_files.includes(fn))
                {
                    this.add_file(fn)
                    this.need_update = true
                }
            })
        },
        calc_stats(){
            this.calc_stats_async()
        },
        async calc_stats_async() {
            if (this.need_update) {
                this.run_loot_summaries = this.sorted_runs.map((ri : RunFile) => {
                    return this.statistics.map((smr : RunStat) => {
                        return statRun(smr, ri.data)
                    })
                })
                this.run_room_summaries = this.sorted_runs.map((ri : RunFile) => {
                    const base_loot = new FullRewards(ri.data.reward_chests, ri.data.blueprint, ri.data.tileset)
                    if (this.drop_keys.length == 0)
                    {
                        this.drop_keys = Object.keys(base_loot)
                    }
                    return base_loot
                })
                this.calc_rates()
            }
            this.need_update = false
        },
        set_run(i : number) {
            this.show_run = this.sorted_runs[i-1].data
            this.show_reward_chests = this.run_room_summaries[i-1]
            this.show_run_file_name = this.sorted_runs[i-1].file_name
        },
        calc_rates() {
            if(! this.calculating)
            {
                this.calculating = true
                this.calc_rates_async().then(()=>{this.calculating = false})
            }
        },
        async calc_rates_async() {
            this.summary_rates = [] as number[][]
            for (let j = 0; j < this.statistics.length; j++){
                const tr = this.run_room_summaries.map(()=>{return 0.0})
                this.summary_rates.push(tr)
            }
            var new_summary = [] as number[][]
            var non_specials = 0
            for (let j = 0; j < this.statistics.length; j++){
                const si = this.statistics[j]
                const drps = this.drop_keys.filter((a : keyof typeof si.can_drop) => {return si.can_drop[a]})
                var mrows = [] as number[][]
                var drops = [] as number[]
                for (let i = 0 ; i < this.run_room_summaries.length; i++)
                {
                    const this_run = this.sorted_runs[i] as RunFile
                    var total_rooms = 0
                    var special_rooms = 0
                    const tr = drps.map((a : keyof FullRewards) => {
                        if (! (a == "safe" || a == "run" || a == "small"))
                        {
                            special_rooms = 1
                        }
                        const nd = this.run_room_summaries[i][a]
                        total_rooms += nd;
                        return nd
                    })
                    if (special_rooms == 0)
                    {
                        if (non_specials > 100)
                        {
                            total_rooms = 0
                        }
                        else
                        {
                            non_specials += 1
                        }
                    }
                    const is_blueprint = this_run.data.blueprint
                    if (is_blueprint)
                    {
                        if (!this.include_blueprints)
                        {
                            total_rooms = 0
                        }
                        else
                        {
                            if (!this.include_trinkets)
                            {
                                const room = RoomMap.get(this_run.data.tileset)
                                if (room.target == "trinkets")
                                {
                                    total_rooms = 0
                                }
                            }
                        }
                    }
                    else
                    {
                        if (!this.include_contracts)
                        {
                            total_rooms = 0
                        }
                    }
                    if (total_rooms > 0)
                    {
                        mrows.push(tr)
                        const rgs = Object.keys(this_run.data.rogues)
                        const corr_types = si.correction_types
                        var lt = this.run_loot_summaries[i][j]
                        var factor = 1.0
                        var v_factor = 1.0
                        rgs.forEach((a : keyof typeof this_run.data.rogues) => {
                            if (this_run.data.rogues[a])
                            {
                                if(a == "vinderi")
                                {
                                    v_factor = 1.16
                                }
                                if (this.correction.has(a))
                                {
                                    const corrections = this.correction.get(a)
                                    corr_types.forEach((tpe : string) =>{
                                        if (corrections.has(tpe)){
                                            factor += corrections.get(tpe)
                                        }
                                    })
                                }
                            }
                        })
                        lt /= factor
                        lt /= v_factor
                        drops.push(lt)
                    }
                }
                const mtrx = matrix(mrows)
                const mmt = add(multiply(mtrx, transpose(mtrx)), multiply(0.0001, identity(mtrx.size()[0])))
                const pmtrx = multiply(transpose(mtrx), pinv(mmt))
                const dvec = matrix(drops)
                const drate = multiply(pmtrx, dvec)
                var this_summary = this.drop_keys.map((a : string) => {
                    const idx = drps.indexOf(a);
                    if (idx >= 0)
                    {
                        return drate.get([idx])
                    }
                    else
                    {
                        return 0.0
                    }
                })
                new_summary.push(this_summary)
            }
            this.summary_rates = new_summary
        },
        add_file(file_name : string): void {
            this.known_files.push(file_name)
            window.runstats_access.load_run(file_name).then((ri : RunInfo) => {
                const this_run = {
                    file_name: file_name,
                    data: ri,
                    time: ri.run_time
                } as RunFile
                var index =  this.sorted_runs.findIndex((a : RunFile) => {
                    a.time < this_run.time
                })
                index = -1
                if (index == -1)
                {
                    this.sorted_runs.push(this_run)
                    this.set_run(this.sorted_runs.length)
                }
                else
                {
                    this.sorted_runs.splice(index, 0, this_run)
                }
                this.need_update = true
            })
        },
        getTime(start : Date, end : Date) {
            return getTimeString(start, end)
        },
        getRewardIcon(icon_name : string) : string {
            const icon = icon_name as keyof typeof Icons.rewards
            return Icons.rewards[icon]
        },
        correction_change() {
            const fi = this.$refs["correction"] as HTMLInputElement
            const file_name = fi.files[0].path
            window.runstats_access.get_correction(file_name).then((corr : any) => {
                this.correction = new Map<string, Map<string, number>>()
                const keys = Object.keys(corr) as string[]
                keys.forEach((k : keyof typeof corr) => {
                    if (k != "trinket") {
                        const rgue = corr[k]
                        const tps = Object.keys(rgue)
                        const mp = new Map<string, number>()
                        tps.forEach((tp : keyof typeof rgue) => {
                            mp.set(tp as string, rgue[tp])
                        })
                        this.correction.set(k, mp)
                    }
                })
                this.need_update = true
            })
        },
        set_correction() {
            const fi = this.$refs["correction"] as HTMLInputElement
            fi.click()
        }
    }
}
</script>

<template>
<div :hidden="!in_config" id="config">
<div id="folders">
<ul>
    <li v-for="folder in run_folders">
    {{ folder }}
    </li>
</ul>
</div>
<div>
    <div v-if="show_run">
        <span>{{ show_run_file_name }}</span> <br>
        <span v-if="show_run.blueprint"> {{ $t("common.blueprint") }}</span>
        <span v-if="!show_run.blueprint"> {{ $t("common.contract") }}</span>
        <span>: {{ $t("instances." + show_run.tileset) }}</span>
        <span> : {{ getTime(show_run.start,show_run.end) }}</span>
        <div id="rewards"  class="reward-span">
            <div class="reward-button" v-for="reward in show_rewards">
                <img v-if="reward!='run'" :src="'../static/' + getRewardIcon(reward)" :alt="$t('rewards.' + reward)" :title="$t('rewards.' + reward)" />
                <div v-if="reward!='run'" class="reward-button-text">
                    <span>{{ show_reward_chests[reward as keyof FullRewards] as number }}</span>
                </div>
            </div>
        </div>
        <div id="loot" class="loot-span">
            <div class="reward-button" v-for="loot in show_run.loot">
                <img :title="loot.type" :src="loot.icon">
                <div class="reward-button-text">
                    <span>{{ loot.stack_size as number }}</span>
                </div>
            </div>
        </div>
        <div id="summary">
            <div v-for="statsum in show_summary">
                {{ statsum.name + " - " + statsum.stack }}
            </div>
        </div>
    </div>
</div>
<div>
<input type="file" ref="file" style="display: none" @change="folder_changed()"/>
<button @click="add_folder()">Add Folder</button>
<input type="file" ref="summary" style="display: none" @change="summary_changed()"/>
<button @click="add_summary()">Add Summary</button>
<input type="file" ref="correction" style="display: none" @change="correction_change()"/>
<button @click="set_correction()">Set Correction</button>
<input type="checkbox" @change="calc_rates" v-model="include_contracts">{{ $t("common.include_contracts") }}
<input type="checkbox" @change="calc_rates" v-model="include_blueprints">{{ $t("common.include_blueprints") }}
<input type="checkbox" @change="calc_rates" v-model="include_trinkets">{{ $t("common.include_trinkets") }}
</div>

</div>
<div id="summary">
    <div id="mapvloot" class="short-table">
        <table>
            <tr>
                <th>{{ $t("common.runnum") }}</th>
                <th>{{ $t("common.location") }}</th>
                <th>{{ $t("common.runtime") }}</th>
                <th>{{ $t("common.blueprint") }}</th>
                <th v-for="smr in statistics">{{ smr.name }}</th>
            </tr>
            <tr v-for="i in sorted_runs.length">
                <td @click="set_run(i)" :title="sorted_runs[i-1].file_name">{{ $t("common.run") + " " + i }}</td>
                <td>{{ $t("instances." + sorted_runs[i-1].data.tileset) }}</td>
                <td>{{ getTime(sorted_runs[i-1].data.start, sorted_runs[i-1].data.end) }}</td>
                <td>{{ sorted_runs[i-1].data.blueprint }}</td>
                <td v-if="run_loot_summaries[i-1]?.length > 0" v-for="n in run_loot_summaries[i-1]?.length">
                    {{ run_loot_summaries[i-1][n-1] }}
                </td>
            </tr>
        </table>
    </div>
    <div id="summaryvreward" class="short-table">
        <table>
            <tr>
                <th>{{ $t("common.summarystat") }}</th>
                <th v-for="k in drop_keys">
                    <img v-if="k!='run'" :src="'../static/' + getRewardIcon(k)" :alt="$t('rewards.' + k)" :title="$t('rewards.' + k)" />
                    <span v-if="k=='run'">{{ $t("rewards.run") }}</span>
                </th>
            </tr>
            <tr v-for="i in statistics.length">
                <td>{{ statistics[i-1].name }}</td>
                <td v-if="summary_rates[i-1]?.length > 0" v-for="k in drop_keys.length">
                    {{ summary_rates[i-1][k-1].toFixed(3) }}
                </td>
            </tr>
        </table>
    </div>
</div>

</template>

<style lang="css">
body {
    background-color: #ddc3a2;
}
.short-table {
    height: 30vh;
    overflow: auto;
}
.short-table > table > tr > th > img {
    width:3vw;
}
.short-table > table > tr > th {
    position:sticky;
    top: 0;
    z-index:2;
    background-color:#ddc3a2;
    width:3vw;
}
.reward-span {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto;
    width: 80vw;
}
.reward-button {
    display: inline-grid;
    position: relative;
    margin-left: auto;
    margin-right: 0;
}
.reward-button > img {
    -webkit-app-region: no-drag;
    max-width:100%;
    max-height:8vw;
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