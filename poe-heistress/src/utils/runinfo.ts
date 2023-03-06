import { RoomMap } from "../heistinfo";
import { ItemSummary } from "./itemsummary"
import { getProperty, JSONable } from "./jsonable";

const reward_list = [
    "abyss",
    "armour",
    "blight",
    "breach",
    "currency",
    "delirium",
    "divination",
    "essences",
    "fossils",
    "fragments",
    "gems",
    "generic",
    "harbinger",
    "legion",
    "maps",
    "metamorph",
    "talismans",
    "trinkets",
    "uniques",
    "weapons",
    "small"
]

export class RewardChests implements JSONable<RewardChests> {
    abyss: number;
    armour: number;
    blight: number;
    breach: number;
    currency: number;
    delirium: number;
    divination: number;
    essences: number;
    fossils: number;
    fragments: number;
    gems: number;
    generic: number;
    harbinger: number;
    legion: number;
    maps: number;
    metamorph: number;
    talismans: number;
    trinkets: number;
    uniques: number;
    weapons: number;
    small: number;
    constructor() {
        this.abyss = 0;
        this.armour = 0;
        this.blight = 0;
        this.breach = 0;
        this.currency = 0;
        this.delirium = 0;
        this.divination = 0;
        this.essences = 0;
        this.fossils = 0;
        this.fragments = 0;
        this.gems = 0;
        this.generic = 0;
        this.harbinger = 0;
        this.legion = 0;
        this.maps = 0;
        this.metamorph = 0;
        this.talismans = 0;
        this.trinkets = 0;
        this.uniques = 0; 
        this.weapons = 0;
        this.small = 0;
    }
    rewardMap() : Map<string, number> {
        const rvalue = new Map<string, number>()
        reward_list.forEach((v : string) => {
            rvalue.set(v, this[v as keyof RewardChests] as number)
        })
        return rvalue
    }
    dejson(input : Object) : RewardChests {
        this.abyss = getProperty(input, "abyss", 0) as number;
        this.armour = getProperty(input, "armour", 0) as number;
        this.blight = getProperty(input, "blight", 0) as number;
        this.breach = getProperty(input, "breach", 0) as number;
        this.currency = getProperty(input, "currency", 0) as number;
        this.delirium = getProperty(input, "delirium", 0) as number;
        this.divination = getProperty(input, "divination", 0) as number;
        this.essences = getProperty(input, "essences", 0) as number;
        this.fossils = getProperty(input, "fossils", 0) as number;
        this.fragments = getProperty(input, "fragments", 0) as number;
        this.gems = getProperty(input, "gems", 0) as number;
        this.generic = getProperty(input, "generic", 0) as number,
        this.harbinger = getProperty(input, "harbinger", 0) as number;
        this.legion = getProperty(input, "legion", 0) as number;
        this.maps = getProperty(input, "maps", 0) as number;
        this.metamorph = getProperty(input, "metamorph", 0) as number;
        this.talismans = getProperty(input, "talismans", 0) as number;
        this.trinkets = getProperty(input, "trinkets", 0) as number;
        this.uniques = getProperty(input, "uniques", 0) as number;
        this.weapons = getProperty(input, "weapons", 0) as number;
        this.small = getProperty(input, "small", 0) as number;
        return this
    }
    rejson() : Object {
        return {
            abyss: this.abyss,
            armour: this.armour,
            blight: this.blight,
            breach: this.breach,
            currency: this.currency,
            delirium: this.delirium,
            divination: this.divination,
            essences: this.essences,
            fossils: this.fossils,
            fragments: this.fragments,
            gems: this.gems,
            generic: this.generic,
            harbinger: this.harbinger,
            legion: this.legion,
            maps: this.maps,
            metamorph: this.metamorph,
            talismans: this.talismans,
            trinkets: this.trinkets,
            uniques: this.uniques,
            weapons: this.weapons,
            small: this.small
        }
    }
}

export const full_reward_keys = [
    "abyss",
    "armour",
    "blight",
    "breach",
    "currency",
    "delirium",
    "divination",
    "essences",
    "fossils",
    "fragments",
    "gems",
    "generic",
    "harbinger",
    "legion",
    "maps",
    "metamorph",
    "talismans",
    "trinkets",
    "uniques",
    "weapons",
    "small",
    "safe",
    "run"
]

export class FullRewards extends RewardChests implements JSONable<FullRewards> {
    safe: number;
    run: number;
    constructor(base? : RewardChests, blueprint ? : boolean, tileset? : string) {
        super()
        this.abyss = base.abyss;
        this.armour = base.armour;
        this.blight = base.blight;
        this.breach = base.breach;
        this.currency = base.currency;
        this.delirium = base.delirium;
        this.divination = base.divination;
        this.essences = base.essences;
        this.fossils = base.fossils;
        this.fragments = base.fragments;
        this.gems = base.gems;
        this.generic = base.generic;
        this.harbinger = base.harbinger;
        this.legion = base.legion;
        this.maps = base.maps;
        this.metamorph = base.metamorph;
        this.talismans = base.talismans;
        this.trinkets = base.trinkets;
        this.uniques = base.uniques; 
        this.weapons = base.weapons;
        this.small = base.small;
        this.run = 1;
        this.safe = 0;
        if (tileset)
        {
            if(blueprint)
            {
                if (RoomMap.get(tileset).blueprint_safes)
                {
                    this.safe = 2
                }
            }
            else
            {
                if (RoomMap.get(tileset).contract_safes)
                {
                    this.safe = 2
                }
            }
        }
    }
    dejson(input : Object) {
        super.dejson(input)
        this.run = getProperty(input, "run", 1) as number;
        this.safe = getProperty(input, "safe", 0) as number;
        return this;
    }
    rejson() {
        return {
            ...super.rejson(),
            run: this.run,
            safe: this.safe
        }
    }
}

const all_rogues = [
    "karst",
    "tibbs",
    "isla",
    "tullina",
    "niles",
    "nenet",
    "vinderi",
    "gianna",
    "huck"
]

export class RogueList implements JSONable<RogueList> {
    karst: boolean;
    tibbs: boolean;
    isla: boolean;
    tullina: boolean;
    niles: boolean;
    nenet: boolean;
    vinderi: boolean;
    gianna: boolean;
    huck: boolean;
    constructor() {
        this.karst = false;
        this.tibbs = false;
        this.isla = false;
        this.tullina = false;
        this.niles = false;
        this.nenet = false;
        this.vinderi = false;
        this.gianna = false;
        this.huck = false;
    }
    currentRogues() : Array<string> {
        return all_rogues.filter((v : string) => this[v as keyof RogueList])
    }
    rogueMap() : Map<string, boolean> {
        const rvalue = new Map<string, boolean>()
        all_rogues.forEach((v : string) => {
            rvalue.set(v, this[v as keyof RogueList] as boolean)
        })
        return rvalue
    }
    dejson(input : Object) : RogueList {
        this.karst = getProperty(input, "karst", false) as boolean;
        this.tibbs = getProperty(input, "tibbs", false) as boolean;
        this.isla = getProperty(input, "isla", false) as boolean;
        this.tullina = getProperty(input, "tullina", false) as boolean;
        this.niles = getProperty(input, "niles", false) as boolean;
        this.nenet = getProperty(input, "nenet", false) as boolean;
        this.vinderi = getProperty(input, "vinderi", false) as boolean;
        this.gianna = getProperty(input, "gianna", false) as boolean;
        this.huck = getProperty(input, "huck", false) as boolean;
        return this
    }
    rejson() {
        return {
            karst: this.karst,
            tibbs: this.tibbs,
            isla: this.isla,
            tullina: this.tullina,
            niles: this.niles,
            nenet: this.nenet,
            vinderi: this.vinderi,
            gianna: this.gianna,
            huck: this.huck
        }
    }
}

const all_jobs = [
    "lockpicking",
    "perception",
    "agility",
    "cthaumaturgy",
    "engineering",
    "demolition",
    "trapdisarm",
    "deception",
    "brute"
]

export class JobList implements JSONable<JobList> {
    lockpicking: boolean;
    perception: boolean;
    agility: boolean;
    cthaumaturgy: boolean;
    engineering: boolean;
    demolition: boolean;
    trapdisarm: boolean;
    deception: boolean;
    brute: boolean;
    constructor() {
        this.lockpicking = false;
        this.perception = false;
        this.agility = false;
        this.cthaumaturgy = false;
        this.engineering = false;
        this.demolition = false;
        this.trapdisarm = false;
        this.deception = false;
        this.brute = false;
    }
    currentJobs() : Array<string> {
        return all_jobs.filter((v : string) => this[v as keyof JobList])
    }
    jobMap() : Map<string, boolean> {
        const rvalue = new Map<string, boolean>()
        all_jobs.forEach((v : string) => {
            rvalue.set(v, this[v as keyof JobList] as boolean)
        })
        return rvalue
    }
    dejson(input : Object) : JobList {
        this.lockpicking = getProperty(input, "lockpicking", false) as boolean;
        this.perception = getProperty(input, "perception", false) as boolean;
        this.agility = getProperty(input, "agility", false) as boolean;
        this.cthaumaturgy = getProperty(input, "cthaumaturgy", false) as boolean;
        this.engineering = getProperty(input, "engineering", false) as boolean;
        this.demolition = getProperty(input, "demolition", false) as boolean;
        this.trapdisarm = getProperty(input, "trapdisarm", false) as boolean;
        this.deception = getProperty(input, "deception", false) as boolean;
        this.brute = getProperty(input, "brute", false) as boolean;
        return this
    }
    rejson() {
        return {
            lockpicking: this.lockpicking,
            perception: this.perception,
            agility: this.agility,
            cthaumaturgy: this.agility,
            engineering: this.engineering,
            demolition: this.demolition,
            trapdisarm: this.trapdisarm,
            deception: this.deception,
            brute: this.brute
        }
    }
}

export class RunInfo implements JSONable<RunInfo> {
    run_time : Date;
    start : Date;
    grab : Date;
    end : Date;
    tileset: string;
    loot : ItemSummary[];
    blueprint: boolean;
    reward_chests : RewardChests;
    rogues: RogueList;
    jobs: JobList;
    league: string;
    account_name: string;
    character_name: string;
    constructor() {
        this.run_time = new Date();
        this.start = new Date();
        this.grab = new Date();
        this.end = new Date();
        this.tileset = "",
        this.loot = [];
        this.blueprint = false;
        this.reward_chests = new RewardChests();
        this.rogues = new RogueList();
        this.jobs = new JobList();
        this.league = "";
        this.account_name = "";
        this.character_name = "";
    }
    dejson(input : Object) {
        const rt = getProperty(input, "run_time", "") as string;
        const st = getProperty(input, "start", "") as string;
        const gt = getProperty(input, "grab", "") as string;
        const et = getProperty(input, "end", "") as string;

        this.run_time = new Date(rt);
        this.start = new Date(st);
        this.grab = new Date(gt);
        this.end = new Date(et);
        this.tileset = getProperty(input, "tileset", "") as string;
        if (input.hasOwnProperty("loot"))
        {
            const k = "loot" as keyof typeof input
            const lt = input[k] as any
            this.loot = lt.map((v : Object) => {return new ItemSummary().dejson(v)})
        }
        else
        {
            this.loot = [];
        }
        this.blueprint = getProperty(input, "blueprint", false) as boolean;
        if (input.hasOwnProperty("reward_chests"))
        {
            this.reward_chests = new RewardChests().dejson(input["reward_chests" as keyof typeof input])
        }
        else
        {
            this.reward_chests = new RewardChests()
        }
        if (input.hasOwnProperty("rogues"))
        {
            this.rogues = new RogueList().dejson(input["rogues" as keyof typeof input])
        }
        else
        {
            this.rogues = new RogueList();
        }
        if (input.hasOwnProperty("jobs"))
        {
            this.jobs = new JobList().dejson(input["jobs" as keyof typeof input])
        }
        else
        {
            this.jobs = new JobList()
        }
        this.league = getProperty(input, "league", "") as string;
        this.account_name = getProperty(input, "account_name", "") as string;
        this.character_name = getProperty(input, "character_name", "") as string;
        return this
    }
    rejson() {
        return {
            run_time: this.run_time.toString(),
            start: this.start.toString(),
            grab: this.grab.toString(),
            end: this.end.toString(),
            tileset: this.tileset,
            loot: this.loot.map((v : ItemSummary) => {return v.rejson()}),
            blueprint: this.blueprint,
            reward_chests: this.reward_chests.rejson(),
            rogues: this.rogues.rejson(),
            jobs: this.jobs.rejson(),
            league: this.league,
            account_name: this.account_name,
            character_name: this.character_name,
        }
    }
}