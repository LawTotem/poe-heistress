import { i18n } from '../locales/i18n'
import { getProperty, JSONable } from './jsonable'

export type PoEItemProperty = {
    name: string,
    values: Array<Array<string | number>> 
}

export type PoEItem = {
    inventoryId?: string,
    typeLine: string,
    stackSize? : number,
    icon? : string,
    ilvl? : number,
    tangled? : boolean,
    corrupted? : boolean,
    synthesised? : boolean,
    shaper? : boolean,
    elder?: boolean,
    hunter?: boolean,
    warlord?: boolean,
    redeemer?: boolean,
    crusader?: boolean,
    fractured?: boolean,
    properties? : Array<PoEItemProperty>,
    enchantMods? : Array<string>,
    implicitMods? : Array<string>
}

/**
 * Check the enchant list for a mod.
 * 
 * @param item The item to check.
 * @param enchant The enchant to check for, should exist in the localization under `mods.`.
 * @returns True if the enchant was found.
 */
function checkEnchant(item : PoEItem, enchant : string) : boolean {
    var rval = false
    if (! item.hasOwnProperty("implicitMods"))
    {
        rval = false
    }
    else
    {
        const all_mods = item.implicitMods as Array<String>
        const enchant_str = i18n.global.t("mods." + enchant)
        all_mods.forEach((mod : string) => {
            if (mod.startsWith(enchant_str) ||
                mod.endsWith(enchant_str)) {
                rval = true
            }
        })
    }
    return rval;
}

/**
 * Checks the delirium level on an item.
 * 
 * @param item The item to check.
 * @returns The amount of delirium on the item
 */
function checkDeli(item : PoEItem) : number {
    var deli = 0;
    if (! item.hasOwnProperty("enchantMods"))
    {
        deli = 0
    }
    else
    {
        const all_enchants = item.enchantMods as Array<String>
        all_enchants.forEach((enchant : string) => {
            if (enchant.includes(i18n.global.t("mods.deli")))
            {
                console.log(parseInt(enchant.substring(20, 22)))
                deli = parseInt(enchant.substring(20, 22));
            }
        })
    }
    return deli;
}

/**
 * 
 * PoE Item Properties look like this
 * [
 * {
 *  "name": "Map Tier",
 *  "values":[
 *     [
 *        "14",
 *        0
 *     ]
 *   ],
 *   "displayMode": 0,
 *   "type": 1
 * },
 * {
 *  "name": "Item Quantity",
 *  "values": [
 *     [
 *       "+3%",
 *       1
 *     ]
 *   ],
 *   "displayMode": 0,
 *   "type": 2
 * }
 * ]
 * 
 * @param item Item to check.
 * @param prop Property name.
 * @param default_value Value to return if no property was found.
 * @returns The first value of the first element of the list in the property.
 */
function getItemProperty(item : PoEItem, prop : string, default_value : string) : string {
    if(item.properties) {
        for (let i in item.properties) {
            // TODO Its unclear how other languages item properties would work
            if (item.properties[i].name == prop) {
                return item.properties[i].values[0][0] as string;
            }
        }
    }
    else
    {
        return default_value;
    }
}

export class ItemInfluence implements JSONable<ItemInfluence> {
    tangled: boolean;
    shaper: boolean;
    elder: boolean;
    hunter: boolean;
    warlord: boolean;
    redeemer: boolean;
    crusader: boolean;
    constructor(item? : PoEItem) {
        if (item) {
            this.tangled = getProperty(item, "tangled", false) as boolean;
            this.shaper = getProperty(item, "shaper", false) as boolean;
            this.elder = getProperty(item, "elder", false) as boolean;
            this.hunter = getProperty(item, "hunter", false) as boolean;
            this.warlord = getProperty(item, "warlord", false) as boolean;
            this.redeemer = getProperty(item, "redeemer", false) as boolean;
            this.crusader = getProperty(item, "crusader", false) as boolean;
        } else {
            this.tangled = false;
            this.shaper = false;
            this.elder = false;
            this.hunter = false
            this.warlord = false;
            this.redeemer = false;
            this.crusader = false;
        }
    }
    toList() : (string | number | boolean)[] {
        return [
            this.tangled,
            this.shaper,
            this.elder,
            this.hunter,
            this.warlord,
            this.redeemer,
            this.crusader
        ]
    }
    dejson(input : Object) {
        this.tangled = getProperty(input, "tangled", false) as boolean;
        this.shaper = getProperty(input, "shaper", false) as boolean;
        this.elder = getProperty(input, "elder", false) as boolean;
        this.hunter = getProperty(input, "hunter", false) as boolean;
        this.warlord = getProperty(input, "warlord", false) as boolean;
        this.redeemer = getProperty(input, "redeemer", false) as boolean;
        this.crusader = getProperty(input, "crusader", false) as boolean;
        return this
    }
    rejson() {
        return {
            tangled: this.tangled,
            shaper: this.shaper,
            elder: this.elder,
            hunter: this.hunter,
            warlord: this.warlord,
            redeemer: this.redeemer,
            crusader: this.crusader
        }
    }
}

export class MapInfo implements JSONable<MapInfo> {
    deli: number;
    fungle: boolean;
    blighted: boolean;
    baran: boolean;
    veritania: boolean;
    alhezmin: boolean;
    drox: boolean;
    enslaver: boolean;
    eradicator: boolean;
    constrictor: boolean;
    purifier: boolean;
    tier: number;

    constructor(item? : PoEItem) {
        if (item) {
            this.deli = checkDeli(item);
            this.fungle = checkEnchant(item, 'fungle');
            this.blighted = checkEnchant(item, 'blight');
            this.baran = checkEnchant(item, 'baran');
            this.veritania = checkEnchant(item, 'veritania');
            this.alhezmin = checkEnchant(item, 'alhezmin');
            this.drox = checkEnchant(item, 'drox');
            this.enslaver = checkEnchant(item, 'enslaver');
            this.eradicator = checkEnchant(item, 'eradicator');
            this.constrictor = checkEnchant(item, 'constrictor');
            this.purifier = checkEnchant(item, 'purifier');
            this.tier = Number(getItemProperty(item, "Map Tier", ""));
        } else {
            this.deli = 0;
            this.fungle = false;
            this.blighted = false;
            this.baran = false;
            this.veritania = false;
            this.alhezmin = false;
            this.drox = false;
            this.enslaver = false;
            this.eradicator = false;
            this.constrictor = false;
            this.purifier = false;
            this.tier = 0;
        }
    }
    toList() : (string | number | boolean)[] {
        return [
            this.deli,
            this.fungle,
            this.blighted,
            this.baran,
            this.veritania,
            this.alhezmin,
            this.drox,
            this.enslaver,
            this.eradicator,
            this.constrictor,
            this.purifier,
            this.tier
        ]
    }
    dejson(input : Object) {
        this.deli = getProperty(input, "deli", 0) as number;
        this.fungle = getProperty(input, "fungle", false) as boolean;
        this.blighted = getProperty(input, "blighted", false) as boolean;
        this.baran = getProperty(input, "baran", false) as boolean;
        this.veritania = getProperty(input, "veritania", false) as boolean;
        this.alhezmin = getProperty(input, "alhezmin", false) as boolean;
        this.drox = getProperty(input, "drox", false) as boolean;
        this.enslaver = getProperty(input, "enslaver", false) as boolean;
        this.eradicator = getProperty(input, "eradicator", false) as boolean;
        this.constrictor = getProperty(input, "constrictor", false) as boolean;
        this.purifier = getProperty(input, "purifier", false) as boolean;
        this.tier = getProperty(input, "tier", 0) as number;
        return this;
    }
    rejson() {
        return {
            deli: this.deli,
            fungle: this.fungle,
            blighted: this.blighted,
            baran: this.baran,
            veritania: this.veritania,
            alhezmin: this.alhezmin,
            drox: this.drox,
            enslaver: this.enslaver,
            eradicator: this.eradicator,
            constrictor: this.constrictor,
            purifier: this.purifier,
            tier: this.tier
        }
    }
}

export class ItemSummary implements JSONable<ItemSummary> {
    type: string;
    item_level: number;
    icon: string;
    corrupted: boolean;
    synthesised: boolean;
    fractured: boolean;
    influence : ItemInfluence;
    map: MapInfo;
    stack_size: number

    constructor(item? : PoEItem) {
        if (item) {
            this.type = item.typeLine;
            this.item_level = getProperty(item, "ilvl", 0) as number;
            this.icon = getProperty(item, "icon", "") as string;
            this.corrupted = getProperty(item, "corrupted", false) as boolean;
            this.synthesised = getProperty(item, "synthesised", false) as boolean;
            this.fractured = getProperty(item, "fractured", false) as boolean;
            this.influence = new ItemInfluence(item);
            this.map = new MapInfo(item);
            this.stack_size = getProperty(item, "stackSize", 1) as number;
        } else {
            this.type = "";
            this.item_level = 0;
            this.icon = "";
            this.corrupted = false;
            this.synthesised = false;
            this.fractured = false;
            this.influence = new ItemInfluence();
            this.map = new MapInfo();
            this.stack_size = 0;
        }
    }
    toList() : (string | number | boolean)[] {
        return [this.type,
         this.item_level,
         this.icon,
         this.corrupted,
         this.synthesised,
         this.fractured
        ].concat(this.influence.toList(), this.map.toList())
    }
    dejson(input : Object) {
        this.type = getProperty(input, "type", "") as string;
        this.item_level = getProperty(input, "item_level", 0) as number;
        this.icon = getProperty(input, "icon", "") as string;
        this.corrupted = getProperty(input, "corrupted", false) as boolean;
        this.fractured = getProperty(input, "fractured", false) as boolean;
        if (input.hasOwnProperty("influence"))
        {
            this.influence = new ItemInfluence().dejson(input["influence" as keyof typeof input])
        }
        else
        {
            this.influence = new ItemInfluence()
        }
        if (input.hasOwnProperty("map"))
        {
            this.map = new MapInfo().dejson(input["map" as keyof typeof input])
        }
        else
        {
            this.map = new MapInfo()
        }
        this.stack_size = getProperty(input, "stack_size", 0) as number;
        return this;
    }
    rejson() {
        return {
            type: this.type,
            item_level: this.item_level,
            icon: this.icon,
            corrupted: this.corrupted,
            fractured: this.fractured,
            influence: this.influence.rejson(),
            map: this.map.rejson(),
            stack_size: this.stack_size
        }
    }
}