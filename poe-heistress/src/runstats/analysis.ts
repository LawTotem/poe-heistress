import { JSONable, getProperty } from "../utils/jsonable"
import { ItemSummary } from "../utils/itemsummary"
import { RunInfo } from "../utils/runinfo"

export declare interface RunStatsInterface {
    load_run : (file_name : string) => Promise<Object>
    get_dir : (file_name : string) => string
    check_dir : (dir_name : string, call_back : (files : string[]) => void) => void,
    get_summary : (file_name : string) => Promise<Object>,
    get_correction : (file_name : string) => Promise<any>
}

export type Run = {
    file_name: string,
    enabled: boolean
}

export type Analysis = {
    run_files: string[],
}

export class Tristate implements JSONable<Tristate> {
    use: boolean;
    yesno: boolean;
    constructor() {
        this.use = false;
        this.yesno = false;
    }
    set(value : boolean) {
        this.use = true;
        this.yesno = value
    }
    dontcare() {
        this.use = false;
    }
    dejson(input : Object) {
        this.use = getProperty(input, "use", false) as boolean;
        this.yesno = getProperty(input, "yesno", false) as boolean;
        return this
    }
    rejson() {
        return {
            use: this.use,
            yesno: this.yesno
        }
    }
    check(item : any, kk : keyof typeof item) : boolean
    {
        if (this.use) {
            if (this.yesno != item[kk])
            {
                return false
            }
        }
        return true
    }
}

export class InfluenceSearch implements JSONable<InfluenceSearch> {
    tangled: Tristate;
    shaper: Tristate;
    elder: Tristate;
    hunter: Tristate;
    warlord: Tristate;
    redeemer: Tristate;
    crusader: Tristate;
    constructor() {
        this.tangled = new Tristate()
        this.shaper = new Tristate()
        this.elder = new Tristate()
        this.hunter = new Tristate()
        this.warlord = new Tristate()
        this.redeemer = new Tristate()
        this.crusader = new Tristate()
    }
    dejson(input : Object) {
        this.tangled = new Tristate().dejson(input["tangled" as keyof typeof input])
        this.shaper = new Tristate().dejson(input["shaper" as keyof typeof input])
        this.elder = new Tristate().dejson(input["elder" as keyof typeof input])
        this.hunter = new Tristate().dejson(input["hunter" as keyof typeof input])
        this.warlord = new Tristate().dejson(input["warlord" as keyof typeof input])
        this.redeemer = new Tristate().dejson(input["redeemer" as keyof typeof input])
        this.crusader = new Tristate().dejson(input["crusader" as keyof typeof input])
        return this
    }
    rejson() {
        return {
            tangled: this.tangled.rejson(),
            shaper: this.shaper.rejson(),
            elder: this.elder.rejson(),
            hunter: this.hunter.rejson(),
            warlord: this.warlord.rejson(),
            redeemer: this.redeemer.rejson(),
            crusader: this.crusader.rejson()
        }
    }
    check(item : any, kk : keyof typeof item) : boolean {
        const ss = item[kk]
        var result = true;
        result = result && this.tangled.check(ss, "tangled");
        result = result && this.shaper.check(ss, "shaper");
        result = result && this.elder.check(ss, "elder");
        result = result && this.hunter.check(ss, "hunter");
        result = result && this.warlord.check(ss, "warlord");
        result = result && this.redeemer.check(ss, "redeemer");
        result = result && this.crusader.check(ss, "crusader");
        return result
    }
}

export class MapSearch implements JSONable<MapSearch> {
    min_deli: number;
    fungle: Tristate;
    baran: Tristate;
    veritania: Tristate;
    alhezmin: Tristate;
    drox: Tristate;
    enslaver: Tristate;
    eradicator: Tristate;
    constrictor: Tristate;
    purifier: Tristate;
    constructor() {
        this.min_deli = 0;
        this.fungle = new Tristate();
        this.baran = new Tristate();
        this.veritania = new Tristate();
        this.alhezmin = new Tristate();
        this.drox = new Tristate();
        this.enslaver = new Tristate();
        this.eradicator = new Tristate();
        this.constrictor = new Tristate();
        this.purifier = new Tristate();
    }
    dejson(input : Object) {
        this.min_deli = getProperty(input, "min_deli", 0) as number;
        this.fungle = new Tristate().dejson(input["fungle" as keyof typeof input])
        this.baran = new Tristate().dejson(input["baran" as keyof typeof input])
        this.veritania = new Tristate().dejson(input["veritania" as keyof typeof input])
        this.alhezmin = new Tristate().dejson(input["alhezmin" as keyof typeof input])
        this.drox = new Tristate().dejson(input["drox" as keyof typeof input])
        this.enslaver = new Tristate().dejson(input["enslaver" as keyof typeof input])
        this.eradicator = new Tristate().dejson(input["eradicator" as keyof typeof input])
        this.constrictor = new Tristate().dejson(input["constrictor" as keyof typeof input])
        this.purifier = new Tristate().dejson(input["purifier" as keyof typeof input])
        return this;
    }
    rejson() {
        return {
            min_deli: this.min_deli,
            fungle: this.fungle.rejson(),
            baran: this.baran.rejson(),
            veritania: this.veritania.rejson(),
            alhezmin: this.alhezmin.rejson(),
            drox: this.drox.rejson(),
            enslaver: this.enslaver.rejson(),
            eradicator: this.eradicator.rejson(),
            constrictor: this.constrictor.rejson(),
            purifier: this.purifier.rejson()
        }
    }
    check(input : any, kk : keyof typeof input) : boolean {
        const ss = input[kk]
        var result = true;
        result = result && ss["deli" as keyof typeof input] >= this.min_deli;
        result = result && this.fungle.check(ss, "fungle");
        result = result && this.baran.check(ss, "baran");
        result = result && this.veritania.check(ss, "veritania");
        result = result && this.alhezmin.check(ss, "alhezmin");
        result = result && this.drox.check(ss, "drox");
        result = result && this.enslaver.check(ss, "enslaver");
        result = result && this.eradicator.check(ss, "eradicator");
        result = result && this.constrictor.check(ss, "constrictor");
        result = result && this.purifier.check(ss, "purifier")
        return result
    }
}

export class DropLocations implements JSONable<DropLocations> {
    abyss: boolean;
    armour: boolean;
    blight: boolean;
    breach: boolean;
    currency: boolean;
    delirium: boolean;
    divination: boolean;
    essences: boolean;
    fossils: boolean;
    fragments: boolean;
    gems: boolean;
    generic: boolean;
    harbinger: boolean;
    legion: boolean;
    maps: boolean;
    metamorph: boolean;
    talismans: boolean;
    trinkets: boolean;
    uniques: boolean;
    weapons: boolean;
    small: boolean;
    safe: boolean;
    run: boolean;
    constructor() {
        this.abyss = false;
        this.armour = false;
        this.blight = false;
        this.breach = false;
        this.currency = false;
        this.delirium = false;
        this.divination = false;
        this.essences = false;
        this.fossils = false;
        this.fragments = false;
        this.gems = false;
        this.generic = false;
        this.harbinger = false;
        this.legion = false;
        this.maps = false;
        this.metamorph = false;
        this.talismans = false;
        this.trinkets = false;
        this.uniques = false;
        this.weapons = false;
        this.small = false;
        this.safe = false;
        this.run = false;
    }
    dejson(input : Object) {
        this.abyss = getProperty(input, "abyss", false) as boolean;
        this.armour = getProperty(input, "armour", false) as boolean;
        this.blight = getProperty(input, "blight", false) as boolean;
        this.breach = getProperty(input, "breach", false) as boolean;
        this.currency = getProperty(input, "currency", false) as boolean;
        this.delirium = getProperty(input, "delirium", false) as boolean;
        this.divination = getProperty(input, "divination", false) as boolean;
        this.essences = getProperty(input, "essences", false) as boolean;
        this.fossils = getProperty(input, "fossils", false) as boolean;
        this.fragments = getProperty(input, "fragments", false) as boolean;
        this.gems = getProperty(input, "gems", false) as boolean;
        this.generic = getProperty(input, "generic", false) as boolean;
        this.harbinger = getProperty(input, "harbinger", false) as boolean;
        this.legion = getProperty(input, "legion", false) as boolean;
        this.maps = getProperty(input, "maps", false) as boolean;
        this.metamorph = getProperty(input, "metamorph", false) as boolean;
        this.talismans = getProperty(input, "talismans", false) as boolean;
        this.trinkets = getProperty(input, "trinkets", false) as boolean;
        this.uniques = getProperty(input, "uniques", false) as boolean;
        this.weapons = getProperty(input, "weapons", false) as boolean;
        this.small = getProperty(input, "small", false) as boolean;
        this.safe = getProperty(input, "safe", false) as boolean;
        this.run = getProperty(input, "run", false) as boolean;
        return this;
    }
    rejson() {
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
            small: this.small,
            safe: this.safe,
            run: this.run
        }
    }
}

export class SummarySearch implements JSONable<SummarySearch> {
    name: string;
    type_regex: string;
    min_item_level: number;
    correction_types: string[];
    corrupted: Tristate;
    synthesized: Tristate;
    fractured: Tristate;
    influenced: InfluenceSearch;
    map: MapSearch;
    can_drop: DropLocations;
    constructor() {
        this.name = "";
        this.type_regex = "";
        this.min_item_level = 0;
        this.correction_types = [];
        this.corrupted = new Tristate();
        this.synthesized = new Tristate();
        this.fractured = new Tristate();
        this.influenced = new InfluenceSearch();
        this.map = new MapSearch();
        this.can_drop = new DropLocations();
    }
    dejson(input : Object) : SummarySearch {
        this.name = getProperty(input, "name", "") as string;
        this.type_regex = getProperty(input, "type_regex", "") as string;
        this.min_item_level = getProperty(input, "min_item_level", 0) as number;

        const cts = input["correction_types" as keyof typeof input] as any;
        this.correction_types = cts as string[];

        this.corrupted = new Tristate().dejson(input["corrupted" as keyof typeof input])
        this.synthesized = new Tristate().dejson(input["synthesised" as keyof typeof input])
        this.fractured = new Tristate().dejson(input["fractured" as keyof typeof input])
        this.influenced = new InfluenceSearch().dejson(input["influence" as keyof typeof input])
        this.map = new MapSearch().dejson(input["map" as keyof typeof input])
        this.can_drop = new DropLocations().dejson(input["can_drop" as keyof typeof input])

        return this;
    }
    rejson() {
        return {
            name: this.name,
            type_regex: this.type_regex,
            min_item_level: this.min_item_level,
            correction_types: this.correction_types,
            corrupted: this.corrupted.rejson(),
            synthesized: this.synthesized.rejson(),
            fractured: this.fractured.rejson(),
            influenced: this.influenced.rejson(),
            map: this.map.rejson(),
            can_drop: this.can_drop.rejson()
        }
    }
    checkItem(item : ItemSummary) {
        const type_regex = RegExp(this.type_regex)
        if (!type_regex.test(item.type)) {
            return false;
        }
        console.log(item)
        console.log(this)
        if (this.min_item_level > item.item_level) {
            console.log("Missed Level")
            return false;
        }
        if (!this.corrupted.check(item, "corrupted")) {
            console.log("Missed Corruption")
            return false;
        }
        if (!this.synthesized.check(item, "synthesised")) {
            console.log("Missed Synthesised")
            return false;
        }
        if (!this.fractured.check(item, "fractured")) {
            console.log("Missed Fractured")
            return false;
        }
        if (!this.influenced.check(item, "influence")) {
            console.log("Missed Influence")
            return false;
        }
        if (!this.map.check(item, "map")) {
            console.log("Missed Map")
            return false;
        }
        console.log("Passed")
        return true;
    }
    statRun(run : RunInfo) {
        var ss = 0
        run.loot.forEach((a : ItemSummary) => {
            if (this.checkItem(a)) {
                ss += a.stack_size
            }
        })
        return ss
    }
}