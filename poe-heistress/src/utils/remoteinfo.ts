import { getProperty, JSONable } from './jsonable';

export type reward_type = 
    'abyss' |
    'armour' |
    'blight' |
    'breach' |
    'currency' |
    'delirium' |
    'divination' |
    'essences' |
    'fossils' |
    'fragments' |
    'gems' |
    'generic' |
    'harbinger' |
    'legion' |
    'maps' |
    'metamorph' |
    'talismans' |
    'trinkets' |
    'uniques' |
    'weapons' |
    'small';

export const reward_list = [
    'abyss',
    'armour',
    'blight',
    'breach',
    'currency',
    'delirium',
    'divination',
    'essences',
    'fossils',
    'fragments',
    'gems',
    'generic',
    'harbinger',
    'legion',
    'maps',
    'metamorph',
    'talismans',
    'trinkets',
    'uniques',
    'weapons',
    'small'
]

export class RewardChests implements JSONable<RewardChests> {
    public static THIS_VERSION = 'V3P1YTYC';
    version : string;
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
        this.version = RewardChests.THIS_VERSION;
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
    dejson(input : object) : RewardChests {
        this.version = getProperty(input, 'version', '') as string;
        if (this.version != RewardChests.THIS_VERSION)
        {
            console.log('RewardChests - Incorrect Version Number [%s vs %s].',
                        this.version, RewardChests.THIS_VERSION)
        }
        this.abyss = getProperty(input, 'abyss', 0) as number;
        this.armour = getProperty(input, 'armour', 0) as number;
        this.blight = getProperty(input, 'blight', 0) as number;
        this.breach = getProperty(input, 'breach', 0) as number;
        this.currency = getProperty(input, 'currency', 0) as number;
        this.delirium = getProperty(input, 'delirium', 0) as number;
        this.divination = getProperty(input, 'divination', 0) as number;
        this.essences = getProperty(input, 'essences', 0) as number;
        this.fossils = getProperty(input, 'fossils', 0) as number;
        this.fragments = getProperty(input, 'fragments', 0) as number;
        this.gems = getProperty(input, 'gems', 0) as number;
        this.generic = getProperty(input, 'generic', 0) as number,
        this.harbinger = getProperty(input, 'harbinger', 0) as number;
        this.legion = getProperty(input, 'legion', 0) as number;
        this.maps = getProperty(input, 'maps', 0) as number;
        this.metamorph = getProperty(input, 'metamorph', 0) as number;
        this.talismans = getProperty(input, 'talismans', 0) as number;
        this.trinkets = getProperty(input, 'trinkets', 0) as number;
        this.uniques = getProperty(input, 'uniques', 0) as number;
        this.weapons = getProperty(input, 'weapons', 0) as number;
        this.small = getProperty(input, 'small', 0) as number;
        return this
    }
    rejson() : object {
        return {
            version: this.version,
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

export const all_rogues = [
    'karst',
    'tibbs',
    'isla',
    'tullina',
    'niles',
    'nenet',
    'vinderi',
    'gianna',
    'huck'
]

export class RogueList implements JSONable<RogueList> {
    public static THIS_VERSION = 'T3IDMD1P';
    version: string;
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
        this.version = RogueList.THIS_VERSION;
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
    dejson(input : object) : RogueList {
        this.version = getProperty(input, 'version', '') as string;
        if (this.version != RogueList.THIS_VERSION)
        {
            console.warn('RogueList - Incorrect Version Number [%s vs %s].',
                        this.version, RogueList.THIS_VERSION)
        }
        this.karst = getProperty(input, 'karst', false) as boolean;
        this.tibbs = getProperty(input, 'tibbs', false) as boolean;
        this.isla = getProperty(input, 'isla', false) as boolean;
        this.tullina = getProperty(input, 'tullina', false) as boolean;
        this.niles = getProperty(input, 'niles', false) as boolean;
        this.nenet = getProperty(input, 'nenet', false) as boolean;
        this.vinderi = getProperty(input, 'vinderi', false) as boolean;
        this.gianna = getProperty(input, 'gianna', false) as boolean;
        this.huck = getProperty(input, 'huck', false) as boolean;
        return this
    }
    rejson() {
        return {
            version: this.version,
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

export const all_jobs = [
    'lockpicking',
    'perception',
    'agility',
    'cthaumaturgy',
    'engineering',
    'demolition',
    'trapdisarm',
    'deception',
    'brute'
]

export class JobList implements JSONable<JobList> {
    public static THIS_VERSION = 'NDQ5ZVT9';
    version: string;
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
        this.version = JobList.THIS_VERSION;
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
    dejson(input : object) : JobList {
        this.version = getProperty(input, 'version', '') as string;
        if (this.version != JobList.THIS_VERSION)
        {
            console.warn('JobList - Incorrect Version Number [%s vs %s].',
                        this.version, JobList.THIS_VERSION)
        }
        this.lockpicking = getProperty(input, 'lockpicking', false) as boolean;
        this.perception = getProperty(input, 'perception', false) as boolean;
        this.agility = getProperty(input, 'agility', false) as boolean;
        this.cthaumaturgy = getProperty(input, 'cthaumaturgy', false) as boolean;
        this.engineering = getProperty(input, 'engineering', false) as boolean;
        this.demolition = getProperty(input, 'demolition', false) as boolean;
        this.trapdisarm = getProperty(input, 'trapdisarm', false) as boolean;
        this.deception = getProperty(input, 'deception', false) as boolean;
        this.brute = getProperty(input, 'brute', false) as boolean;
        return this
    }
    rejson() {
        return {
            version: this.version,
            lockpicking: this.lockpicking,
            perception: this.perception,
            agility: this.agility,
            cthaumaturgy: this.cthaumaturgy,
            engineering: this.engineering,
            demolition: this.demolition,
            trapdisarm: this.trapdisarm,
            deception: this.deception,
            brute: this.brute
        }
    }
}

export const all_damage = [
    'physical',
    'chaos',
    'cold',
    'fire',
    'lightning'
]

export class DamageList implements JSONable<DamageList> {
    public static THIS_VERSION = '';
    version : string;
    physical : boolean;
    chaos : boolean;
    cold : boolean;
    fire : boolean;
    lightning : boolean;
    constructor() {
        this.version = DamageList.THIS_VERSION;
        this.physical = false;
        this.chaos = false;
        this.cold = false;
        this.fire = false;
        this.lightning = false;
    }
    currentDamage() : Array<string> {
        return all_damage.filter((v : string) => this[v as keyof DamageList])
    }
    dejson(input : object) {
        this.version = getProperty(input, 'version' ,'') as string;
        this.physical = getProperty(input, 'physical', false) as boolean;
        this.chaos = getProperty(input, 'chaos', false) as boolean;
        this.cold = getProperty(input, 'cold', false) as boolean;
        this.fire = getProperty(input, 'fire', false) as boolean;
        this.lightning = getProperty(input, 'lightning', false) as boolean;
        return this
    }
    rejson() {
        return {
            version: this.version,
            physical: this.physical,
            chaos: this.chaos,
            cold: this.cold,
            fire: this.fire,
            lightning: this.lightning
        }
    }
}

export class RunStatus implements JSONable<RunStatus> {
    public static THIS_VERSION = 'JH4VI0H1';
    version : string;
    name: string;
    timer_running : boolean;
    timer_start : Date;
    timer_grab : Date;
    timer_current : Date;
    timer_end : Date;
    grabbed_loot : boolean;
    blueprint: boolean;
    can_rewards : RewardChests;
    has_rewards : RewardChests;
    reward_chests : RewardChests;
    rogues: RogueList;
    could_job : JobList;
    jobs: JobList;
    damage: DamageList;
    constructor() {
        this.version = RunStatus.THIS_VERSION;
        this.name = '';
        this.timer_running = false;
        this.timer_start = new Date();
        this.timer_grab = new Date();
        this.timer_current = new Date();
        this.timer_end = new Date();
        this.grabbed_loot = false;
        this.blueprint = false;
        this.can_rewards = new RewardChests();
        this.has_rewards = new RewardChests();
        this.reward_chests = new RewardChests();
        this.rogues = new RogueList();
        this.jobs = new JobList();
        this.could_job = new JobList();
        this.damage = new DamageList();
    }
    dejson(input : object) {
        this.version = getProperty(input, 'version', '') as string;
        if (this.version != RunStatus.THIS_VERSION)
        {
            console.log('RunStatus - Incorrect Version Number [%s vs %s].',
                        this.version, RunStatus.THIS_VERSION)
        }
        this.name = getProperty(input, 'name', '') as string;
        this.timer_running = getProperty(input, 'timer_running', false) as boolean;
        const st = getProperty(input, 'timer_start', '') as string;
        const gt = getProperty(input, 'timer_grab', '') as string;
        const ct = getProperty(input, 'timer_current', '') as string;
        const et = getProperty(input, 'timer_end', '') as string;
        this.timer_start = new Date(st);
        this.timer_grab = new Date(gt);
        this.timer_current = new Date(ct);
        this.timer_end = new Date(et);
        this.grabbed_loot = getProperty(input, 'grabbed_loot', false) as boolean;
        this.blueprint = getProperty(input, 'blueprint', false) as boolean;
        this.can_rewards = new RewardChests()
        if (input.hasOwnProperty('can_rewards'))
        {
            this.can_rewards.dejson(input['can_rewards' as keyof typeof input])
        }
        this.has_rewards = new RewardChests()
        if (input.hasOwnProperty('has_rewards'))
        {
            this.has_rewards.dejson(input['has_rewards' as keyof typeof input])
        }
        this.reward_chests = new RewardChests()
        if (input.hasOwnProperty('reward_chests'))
        {
            this.reward_chests.dejson(input['reward_chests' as keyof typeof input])
        }
        this.rogues = new RogueList()
        if (input.hasOwnProperty('rogues'))
        {
            this.rogues.dejson(input['rogues' as keyof typeof input])
        }
        this.could_job = new JobList()
        if (input.hasOwnProperty('could_job'))
        {
            this.could_job.dejson(input['could_job' as keyof typeof input])
        }
        this.jobs = new JobList()
        if (input.hasOwnProperty('jobs'))
        {
            this.jobs.dejson(input['jobs' as keyof typeof input])
        }
        this.damage = new DamageList()
        if (input.hasOwnProperty('damage'))
        {
            this.damage.dejson(input['damage' as keyof typeof input])
        }
        return this
    }
    rejson() {
        return {
            version : this.version,
            name: this.name,
            timer_running : this.timer_running,
            timer_start : this.timer_start.toString(),
            timer_grab : this.timer_grab.toString(),
            timer_current : this.timer_current.toString(),
            timer_end : this.timer_end.toString(),
            grabbed_loot : this.grabbed_loot,
            blueprint: this.blueprint,
            has_rewards: this.has_rewards.rejson(),
            can_rewards: this.can_rewards.rejson(),
            reward_chests : this.reward_chests.rejson(),
            rogues: this.rogues.rejson(),
            could_job: this.could_job.rejson(),
            jobs: this.jobs.rejson(),
            damage: this.damage.rejson(),
        }
    }
}

export const all_requests = [
    'update',
    'toggle_blueprint',
    'toggle_job',
    'toggle_rogue',
    'add_reward',
    'remove_reward',
    'capture_curio',
    'curio_select'
]

export type request_type = 
    'update' |
    'toggle_blueprint' |
    'toggle_job' |
    'toggle_rogue' |
    'add_reward' |
    'remove_reward' |
    'capture_curio' |
    'curio_select'

export class PriceInfo implements JSONable<PriceInfo> {
    public static THIS_VERSION = 'SJARUohiCz'
    version : string;
    search_string : string;
    prices : Array<string>;

    constructor(search_string = '', prices : Array<string> = []) {
        this.version = PriceInfo.THIS_VERSION
        this.search_string = search_string
        this.prices = prices as Array<string>
    }
    dejson(input : object) {
        this.version = getProperty(input, 'version', '') as string
        if (this.version != PriceInfo.THIS_VERSION)
        {
            console.warn('PriceInfo - Incorrect Version Number [%s vs %s].',
                         this.version, PriceInfo.THIS_VERSION)
        }
        this.search_string = getProperty(input, 'search_string', '') as string
        this.prices = []
        if (input.hasOwnProperty('prices'))
        {
            this.prices = input['prices' as keyof typeof input]
        }
        return this
    }
    rejson() {
        return {
            version: this.version,
            search_string: this.search_string,
            prices: this.prices
        }
    }
}

export class HeistressRequest implements JSONable<HeistressRequest> {
    public static THIS_VERSION = 'Dx019saJCU';
    version : string;
    type : request_type;
    data : string;

    constructor(type : request_type, data = '') {
        this.version = HeistressRequest.THIS_VERSION
        this.type = type 
        this.data = data
    }
    dejson(input : object) {
        this.version = getProperty(input, 'version', '') as string
        if (this.version != HeistressRequest.THIS_VERSION)
        {
            console.log('HeistressRequest - Incorrect Version Number [%s vs %s].',
                        this.version, HeistressRequest.THIS_VERSION)
        }
        const tpe_proto = getProperty(input, 'type', '') as string
        if (all_requests.includes(tpe_proto)) {
            this.type = tpe_proto as request_type
        }
        else
        {
            console.log('TrackerRequest - type request not correct [%s].', tpe_proto)
            this.type = 'update'
        }
        this.data = getProperty(input, 'data', '') as string;
        return this
    }
    rejson() {
        return {
            version: this.version,
            type: this.type,
            data: this.data
        }
    }
}