import { i18n } from '../locales/i18n'

import { ItemSummary } from '../utils/itemsummary'

type PoEItem = {
    inventoryId?: string,
    typeLine : string,
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
    enchantMods? : Array<string>,
    implicitMods? : Array<string>
}

// TODO(localization) I don't know how the inventory fields work for non US locales

export function parseInventory(raw_inventory : string) : [Map<string, number>, Map<string, ItemSummary>] {
    const inv = JSON.parse(raw_inventory)
    var inventory = new Map<string, number>()
    var imap = new Map<string, ItemSummary>()
    for (let ii in inv["items"]){
        const item = inv["items"][ii] as PoEItem
        if (! ofInterest(item)) {
            continue;
        }
        const summary_item : ItemSummary = {
            type: item["typeLine"],
            item_level: getProperty(item, "ilvl", 0) as number,
            icon: getProperty(item, "icon", "") as string,
            corrupted: getProperty(item, "corrupted", false) as boolean,
            synthesised: getProperty(item, "synthesised", false) as boolean,
            fractured: getProperty(item, "fractured", false) as boolean,
            influence: {
                tangled: getProperty(item, "tangled", false) as boolean,
                shaper: getProperty(item, "shaper", false) as boolean,
                elder: getProperty(item, "elder", false) as boolean,
                hunter: getProperty(item, "hunter", false) as boolean,
                warlord: getProperty(item, "warlord", false) as boolean,
                redeemer: getProperty(item, "redeemer", false) as boolean,
                crusader: getProperty(item, "crusader", false) as boolean
            },
            map : {
                deli: checkDeli(item),
                fungle: checkEnchant(item, 'fungle'),
                baran: checkEnchant(item, "baran"),
                veritania: checkEnchant(item, "veritania"),
                alhezmin: checkEnchant(item, "alhezmin"),
                drox: checkEnchant(item, "drox"),
                enslaver: checkEnchant(item, "enslaver"),
                eradicator: checkEnchant(item, "eradicator"),
                constrictor: checkEnchant(item, "constrictor"),
                purifier: checkEnchant(item, "purifier")
            },
            stack_size: getProperty(item, "stackSize", 1) as number
        }
        console.log(summary_item)
        const stack_size = summary_item.stack_size
        const summary_item_list = [
            summary_item.type,
            summary_item.item_level,
            summary_item.icon,
            summary_item.corrupted,
            summary_item.synthesised,
            summary_item.fractured,
            summary_item.influence.tangled,
            summary_item.influence.shaper,
            summary_item.influence.elder,
            summary_item.influence.hunter,
            summary_item.influence.warlord,
            summary_item.influence.redeemer,
            summary_item.influence.crusader,
            summary_item.map.deli,
            summary_item.map.fungle,
            summary_item.map.baran,
            summary_item.map.veritania,
            summary_item.map.alhezmin,
            summary_item.map.drox,
            summary_item.map.enslaver,
            summary_item.map.eradicator,
            summary_item.map.constrictor,
            summary_item.map.purifier
        ]
        const summary_item_string = summary_item_list.toString()
        if (inventory.has(summary_item_string)) {
            const current_stack = inventory.get(summary_item_string)
            inventory.set(summary_item_string, current_stack + stack_size)
        }
        else
        {
            imap.set(summary_item_string, summary_item)
            inventory.set(summary_item_string, stack_size)
        }
    }
    return [inventory, imap]
}

export function inventoryDelta(start : [Map<string, number>, Map<string, ItemSummary>],
                               end : [Map<string, number>, Map<string, ItemSummary>]) {
    var delta_inventory : Array<ItemSummary> = []
    end[0].forEach((value : number, element : string) => {
        var start_value = 0;
        if (start[0].has(element)) {
            start_value = start[0].get(element)
        }
        if (value > start_value) {
            var v = end[1].get(element)
            v.stack_size = value - start_value
            delta_inventory.push(v)
        }
    })
    return delta_inventory
}

function ofInterest(item : PoEItem) : boolean {
    var interesting = true;
    if (! item.hasOwnProperty("inventoryId"))
    {
        interesting = false;
    }
    else
    {
        if (item.inventoryId != "MainInventory")
        {
            interesting = false;
        }
        if (! item.hasOwnProperty("typeLine")) {
            interesting = false
        }
    }
    return interesting;
}

function getProperty(item : PoEItem, name : keyof PoEItem, default_value : string | number | boolean) {
    if (! item.hasOwnProperty(name)) {
        return default_value;
    }
    return item[name]
}


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