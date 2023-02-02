import HeistInfo from './heist.json'
import { i18n } from './locales/i18n'
import fetch from 'node-fetch';

import en_trans from './locales/en.json'

const reverse_gem = new Map();
Object.keys(en_trans.loot.gem_specials).forEach((short : keyof typeof en_trans.loot.gem_specials) => {
    reverse_gem.set(en_trans.loot.gem_specials[short], short)
})
const reverse_replica = new Map();
Object.keys(en_trans.loot.replicas).forEach((short : keyof typeof en_trans.loot.replicas) => {
    reverse_replica.set(en_trans.loot.replicas[short], short)
})
const reverse_bases = new Map();
Object.keys(en_trans.loot.bases).forEach((short : keyof typeof en_trans.loot.bases) => {
    reverse_bases.set(en_trans.loot.bases[short], short)
})
const reverse_uniques = new Map();
var all_uniques = []
Object.keys(en_trans.loot.uniques).forEach((short : keyof typeof en_trans.loot.uniques) => {
    reverse_uniques.set(en_trans.loot.uniques[short], short)
    all_uniques.push(en_trans.loot.uniques[short])
})
const reverse_orbs = new Map();
var all_orbs = []
Object.keys(en_trans.loot.orbs).forEach((short : keyof typeof en_trans.loot.orbs) => {
    reverse_orbs.set(en_trans.loot.orbs[short], short)
    all_orbs.push(en_trans.loot.orbs[short])
})

async function pullNinjaItems(league : string, this_type : string) {
    const url = "https://poe.ninja/api/data/itemoverview?league=" + league + "&type=" + this_type + "&language=en"
    const req = fetch(
        url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }
    )
    const reqa = await req
    return await reqa.text()
}

async function pullNinjaCurrency(league : string, this_type : string) {
    const url = "https://poe.ninja/api/data/currencyoverview?league=" + league + "&type=" + this_type + "&language=en"
    const req = fetch(
        url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }
    )
    const reqa = await req
    return await reqa.text()
}

var prices = new Map()

type GemInfo = {
    gemLevel? : number,
    gemQuality? : number,
    corrupted? : boolean,
    name? : string,
    chaosValue? : number
}

function priceGem(gem : GemInfo) {
    var lvl = -1;
    var qual = -1;
    if (gem.hasOwnProperty("gemLevel"))
    {
        lvl = gem["gemLevel"]
    }
    if (gem.hasOwnProperty("gemQuality"))
    {
        qual = gem["gemQuality"]
    }
    var is_corrupt = false;
    if (gem.hasOwnProperty("corrupted"))
    {
        is_corrupt = gem["corrupted"]
    }
    if (lvl <= 20 && !is_corrupt)
    {
        const name = gem["name"]
        const price = gem["chaosValue"]
        var alt_s = null
        var gem_s = null
        if (name.startsWith("Anomalous")) {
            alt_s = "anomalous"
            gem_s = reverse_gem.get(name.slice(10))
        }
        if (name.startsWith("Phantasmal")) {
            alt_s = "phantasmal"
            gem_s = reverse_gem.get(name.slice(11))
        }
        if (name.startsWith("Divergent")) {
            alt_s = "divergent"
            gem_s = reverse_gem.get(name.slice(10))
        }
        if (alt_s && !gem) {
            console.log(name)
            console.log(gem)
        }
        if (alt_s && gem) {
            // TODO(locale)
            // Probably doesn't work in other languages 
            // Not sure how to fix having an entry for every possible gem is almost 3x entries and kinda a mess
            // Maybe "loot.gems.[alt].[gem]" to keep things a bit more organized
            const local_name = i18n.global.t("loot.gem_quals."+alt_s) + " " + i18n.global.t("loot.gem_specials."+gem_s)
            if (lvl == 16 && qual < 20)
            {
                prices.set(local_name, "" + price)
            }
            else if (! prices.has(local_name))
            {
                prices.set(local_name, "~" + price)
            }

        }
    }
}

type UniqueInfo = {
    links? : number,
    name : string,
    chaosValue : number
}

function priceUnique(itm : UniqueInfo) {
    var links = 0;
    if (itm.hasOwnProperty("links")){
        links = itm["links"]
    }
    const name = itm["name"]
    const price = itm["chaosValue"]
    var key = null
    if (reverse_replica.has(name)) {
        key = i18n.global.t("loot.replicas." + reverse_replica.get(name))
        //key = "replica." + reverse_replica.get(name)
    }
    if (! key && (name.startsWith("Replica"))) {
        console.log(itm)
    }
    if (reverse_uniques.has(name)){
        //key = "unique." + reverse_uniques.get(name)
        key = i18n.global.t("loot.uniques." + reverse_uniques.get(name))
    }
    if (key)
    {
        if (links == 0)
        {
            prices.set(key, "" + price)
        }
        else
        {
            prices.set(key, "[" + links +"]" + price)
        }
    }
}

type BaseItemInfo = {
    variant? : string,
    name : string,
    chaosValue : number,
    levelRequired : number,
    listingCount : number
}

function priceBase(itm : BaseItemInfo) {
    const name = itm["name"];
    var variant = null;
    if (itm.hasOwnProperty("variant")) {
        variant = itm["variant"]
    }
    if (!variant && itm["listingCount"] > 30)
    {
        const price = itm["chaosValue"]
        const ilvl = itm["levelRequired"]
        if ((price > 5.1 || ilvl >= 86) && reverse_bases.has(name)){
            //const key = reverse_bases.get(name)
            const key = i18n.global.t("loot.bases." + reverse_bases.get(name))
            var current = prices.get(key)
            if (!current) {
                current = ""
            } else {
                current = current + " "
            }
            prices.set(key, current + "[" + ilvl + "]" + price)
        }
    }
}

type CurrencyItemInfo = {
    currencyTypeName: string,
    chaosEquivalent: number
}

function priceCurrency(itm : CurrencyItemInfo) {
    const name = itm["currencyTypeName"]
    if (reverse_orbs.has(name)) {
        const key = i18n.global.t("loot.orbs." + reverse_orbs.get(name))
        const value = itm["chaosEquivalent"]
        prices.set(key, "" + value)
    }
}

var have_grab = false;
var last_grab = new Date();

function timeDelta(nw : Date, past : Date) {
    return (nw.getTime() - past.getTime()) / 1000;
}

export async function ninjaGrab(league : string) {
    const nw = new Date()
    if (! have_grab || timeDelta(nw, last_grab) > 30*60 ) {
        prices = new Map()
        const sgems = JSON.parse(await pullNinjaItems(league, "SkillGem"))
        sgems.lines.forEach(priceGem)
        const weaps = JSON.parse(await pullNinjaItems(league, "UniqueWeapon"))
        weaps.lines.forEach(priceUnique)
        const armor = JSON.parse(await pullNinjaItems(league, "UniqueArmour"))
        armor.lines.forEach(priceUnique)
        const umaps = JSON.parse(await pullNinjaItems(league, "UniqueMap"))
        umaps.lines.forEach(priceUnique)
        const jewel = JSON.parse(await pullNinjaItems(league, "UniqueJewel"))
        jewel.lines.forEach(priceUnique)
        const rings = JSON.parse(await pullNinjaItems(league, "UniqueAccessory"))
        rings.lines.forEach(priceUnique)
        const flask = JSON.parse(await pullNinjaItems(league, "UniqueFlask"))
        flask.lines.forEach(priceUnique)
        const bases = JSON.parse(await pullNinjaItems(league, "BaseType"))
        bases.lines.forEach(priceBase)
        const corbs = JSON.parse(await pullNinjaCurrency(league, "Currency"))
        corbs.lines.forEach(priceCurrency)
        //const frags = JSON.parse(await pullNinjaCurrency(league, "Fragment"))
        //const boils = JSON.parse(await pullNinjaItems(league, "Oil"))
        //const incub = JSON.parse(await pullNinjaItems(league, "Incubator"))
        //const scarb = JSON.parse(await pullNinjaItems(league, "Scarab"))
        //const dorbs = JSON.parse(await pullNinjaItems(league, "DeliriumOrb"))
        //const wmaps = JSON.parse(await pullNinjaItems(league, "Map"))
        //const essen = JSON.parse(await pullNinjaItems(league, "Essence"))
        //const reson = JSON.parse(await pullNinjaItems(league, "Resonator"))
        //const fossl = JSON.parse(await pullNinjaItems(league, "Fossil"))
    }
    return prices
}