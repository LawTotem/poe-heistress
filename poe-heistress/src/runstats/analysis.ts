import { ItemSummary } from "../utils/itemsummary"
import { RunInfo } from "../utils/runinfo"

export declare interface RunStatsInterface {
    load_run : (file_name : string) => Promise<RunInfo>
    get_dir : (file_name : string) => string
    check_dir : (dir_name : string, call_back : (files : string[]) => void) => void,
    get_summary : (file_name : string) => Promise<RunStat>,
    get_correction : (file_name : string) => Promise<any>
}

export type Run = {
    file_name: string,
    enabled: boolean
}

export type Analysis = {
    run_files: string[],
}

export type BoolTri = {
    use : boolean,
    yesno : boolean
}

export type RunStat = {
    name: string,
    type_regex: string,
    min_item_level: number,
    correction_types: string[],
    corrupted: BoolTri,
    synthesised: BoolTri,
    fractured: BoolTri,
    influence : {
        tangled: BoolTri,
        shaper: BoolTri,
        elder: BoolTri,
        hunter: BoolTri,
        warlord: BoolTri,
        redeemer: BoolTri,
        crusader: BoolTri,
    },
    map : {
        min_deli: number,
        fungle: BoolTri,
        baran: BoolTri,
        veritania: BoolTri,
        alhezmin: BoolTri,
        drox: BoolTri,
        enslaver: BoolTri,
        eradicator: BoolTri,
        constrictor: BoolTri,
        purifier: BoolTri
    }
    can_drop : {
        abyss: boolean,
        armour: boolean,
        blight: boolean,
        breach: boolean,
        currency: boolean,
        delirium: boolean,
        divination: boolean,
        essences: boolean,
        fossils: boolean,
        fragments: boolean,
        gems: boolean,
        generic: boolean,
        harbinger: boolean,
        legion: boolean,
        maps: boolean,
        metamorph: boolean,
        talismans: boolean,
        trinkets: boolean,
        uniques: boolean,
        weapons: boolean,
        small: boolean,
        safe: boolean,
        run: boolean
    }
}

function checkTri(search : any, item : any, kk : keyof typeof search)
{
    const s_tri = search[kk] as BoolTri
    if (s_tri.use)
    {
        if (s_tri.use != item[kk as keyof typeof item]) {
            return false
        }
    }
    return true
}

export function checkItem(search : RunStat, item : ItemSummary) {
    const type_regex = RegExp(search.type_regex)
    if (!type_regex.test(item.type)) {
        return false
    }
    if (search.min_item_level > item.item_level)
    {
        return false
    }
    if (!checkTri(search, item, "corrupted")) {
        return false
    }
    if (!checkTri(search, item, "synthesised")) {
        return false
    }
    if (!checkTri(search, item, "fractured")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "tangled")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "shaper")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "elder")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "hunter")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "warlord")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "redeemer")) {
        return false
    }
    if (!checkTri(search.influence, item.influence, "crusader")) {
        return false
    }
    if (search.map.min_deli > item.map.deli){
        return false
    }
    if (!checkTri(search.map, item.map, "fungle")) {
        return false
    }
    if (!checkTri(search.map, item.map, "baran")) {
        return false
    }
    if (!checkTri(search.map, item.map, "veritania")) {
        return false
    }
    if (!checkTri(search.map, item.map, "alhezmin")) {
        return false
    }
    if (!checkTri(search.map, item.map, "drox")) {
        return false
    }
    if (!checkTri(search.map, item.map, "enslaver")) {
        return false
    }
    if (!checkTri(search.map, item.map, "eradicator")) {
        return false
    }
    if (!checkTri(search.map, item.map, "constrictor")) {
        return false
    }
    if (!checkTri(search.map, item.map, "purifier")) {
        return false
    }
    return true
}

export function statRun(search : RunStat, run : RunInfo) {
    var ss = 0
    run.loot.forEach((a : ItemSummary) => {
        if (checkItem(search, a))
        {
            ss += a.stack_size
        }
    })
    return ss
}