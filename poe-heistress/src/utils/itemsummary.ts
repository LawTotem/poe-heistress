
export type ItemSummary = {
    type: string,
    item_level: number,
    icon: string,
    corrupted: boolean,
    synthesised: boolean,
    fractured: boolean,
    influence : {
        tangled: boolean,
        shaper: boolean,
        elder: boolean,
        hunter: boolean,
        warlord: boolean,
        redeemer: boolean,
        crusader: boolean,
    },
    map : {
        deli: number,
        fungle: boolean,
        baran: boolean,
        veritania: boolean,
        alhezmin: boolean,
        drox: boolean,
        enslaver: boolean,
        eradicator: boolean,
        constrictor: boolean,
        purifier: boolean
    }
    stack_size: number
}