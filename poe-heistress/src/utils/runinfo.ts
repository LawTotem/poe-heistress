import { RoomMap } from "../heistinfo";
import { ItemSummary } from "./itemsummary"

import { getProperty, JSONable } from './jsonable';

import { RewardChests, RogueList, JobList } from './remoteinfo'

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