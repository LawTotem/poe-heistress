import { ItemSummary, PoEItem } from '../utils/itemsummary'

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
        const summary_item = new ItemSummary(item)
        const stack_size = summary_item.stack_size
        const summary_item_list = summary_item.toList()
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
                               end : [Map<string, number>, Map<string, ItemSummary>]) : Array<ItemSummary> {
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