import { ItemSummary } from "./itemsummary"

export interface RewardChests {
    abyss: number,
    armour: number,
    blight: number,
    breach: number,
    currency: number,
    delirium: number,
    divination: number,
    essences: number,
    fossils: number,
    fragments: number,
    gems: number,
    generic: number,
    harbinger: number,
    legion: number,
    maps: number,
    metamorph: number,
    talismans: number,
    trinkets: number,
    uniques: number,
    weapons: number,
    small: number
}

export interface RunInfo {
    run_time : Date,
    start : Date,
    grab : Date,
    end : Date,
    tileset: string,
    loot : ItemSummary[],
    blueprint: boolean,
    reward_chests : RewardChests,
    rogues: {
        karst: boolean,
        tibbs: boolean,
        isla: boolean,
        tullina: boolean,
        niles: boolean,
        nenet: boolean,
        vinderi: boolean,
        gianna: boolean,
        huck: boolean
    },
    jobs: {
        lockpicking: boolean,
        perception: boolean,
        cthaumaturgy: boolean,
        agility: boolean,
        engineering: boolean,
        demolition: boolean,
        trapdisarm: boolean,
        deception: boolean,
        brute: boolean
    },
    league: string,
    account_name: string,
    character_name: string
}

export interface PreDateRunInfo extends Omit<RunInfo, 'run_time'|'start'|'grab'|'end'> {
    run_time : string,
    start : string,
    grab : string,
    end : string
}

export function convert_run_info(info : PreDateRunInfo) : RunInfo {
    const run_info = {
        run_time: new Date(info.run_time),
        start : new Date(info.start),
        grab : new Date(info.grab),
        end : new Date(info.end),
        loot : info.loot,
        blueprint: info.blueprint,
        tileset: info.tileset,
        reward_chests: info.reward_chests,
        rogues: info.rogues,
        jobs: info.jobs,
        league: info.league,
        account_name: info.account_name,
        character_name: info.character_name
    } as RunInfo
    return run_info
}