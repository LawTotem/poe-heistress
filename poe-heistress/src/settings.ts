
import { getProperty, JSONable } from './utils/jsonable';

export type HeistressSettingsType = string | number | boolean;

export class HeistressSettings implements JSONable<HeistressSettings> {
    use_tracker : boolean
    tracker_ontop : boolean
    tracker_height : number
    tracker_width : number
    tracker_trackloot : boolean
    account_name : string
    client_txt : string
    character : string
    poesessid : string
    league : string
    screen_name : string
    dump_location : string
    use_pricer : boolean
    pricer_shortcut : string
    price_interval : number
    dump_image : boolean
    enable_remote: boolean
    pricer_ontop : boolean
    constructor() {
        this.use_tracker = true
        this.tracker_ontop = true
        this.tracker_height = 380
        this.tracker_width = 500
        this.tracker_trackloot = false
        this.account_name = ""
        this.client_txt = ""
        this.character = ""
        this.poesessid = ""
        this.league = "Crucible"
        this.screen_name="Path of Exile"
        this.dump_location = ""
        this.use_pricer = true
        this.pricer_shortcut = "Ctrl+U"
        this.price_interval = 3600
        this.dump_image = false
        this.enable_remote = false
        this.pricer_ontop = true
    }
    set(key : keyof HeistressSettings, value : HeistressSettingsType) {
        if (key == 'use_tracker') {
            this.use_tracker = value as boolean
        }
        if (key == 'tracker_ontop') {
            this.tracker_ontop = value as boolean
        }
        if (key == 'tracker_height') {
            this.tracker_height = value as number
        }
        if (key == 'tracker_width') {
            this.tracker_width = value as number
        }
        if (key == 'tracker_trackloot') {
            this.tracker_trackloot = value as boolean
        }
        if (key == 'account_name') {
            this.account_name = value as string
        }
        if (key == 'client_txt') {
            this.client_txt = value as string
        }
        if (key == 'character') {
            this.character = value as string
        }
        if (key == 'poesessid') {
            this.poesessid = value as string
        }
        if (key == 'league') {
            this.league = value as string
        }
        if (key == 'screen_name') {
            this.screen_name = value as string
        }
        if (key == 'dump_location') {
            this.dump_location = value as string
        }
        if (key == 'use_pricer') {
            this.use_pricer = value as boolean
        }
        if (key == 'pricer_shortcut') {
            this.pricer_shortcut = value as string
        }
        if (key == 'price_interval') {
            this.price_interval = value as number
        }
        if (key == 'dump_image') {
            this.dump_image = value as boolean
        }
        if (key == 'pricer_ontop') {
            this.pricer_ontop = value as boolean
        }
    }
    dejson(input : object) : HeistressSettings {
        this.use_tracker = getProperty(input, 'use_tracker', false) as boolean
        this.tracker_ontop = getProperty(input, 'tracker_ontop', true) as boolean
        this.tracker_height = getProperty(input, 'tracker_height', 80) as number
        this.tracker_width = getProperty(input, 'tracker_width', 500) as number
        this.tracker_trackloot = getProperty(input, 'tracker_trackloot', false) as boolean
        this.account_name = getProperty(input, 'account_name', "") as string
        this.client_txt = getProperty(input, 'client_txt', "") as string
        this.character = getProperty(input, 'character', "") as string
        this.poesessid = getProperty(input, 'poesessid', "") as string
        this.league = getProperty(input, 'league', "Crucible") as string
        this.screen_name=getProperty(input, 'screen_name', "Path of Exile") as string
        this.dump_location = getProperty(input, 'dump_location', "") as string
        this.use_pricer = getProperty(input, 'use_pricer', true) as boolean
        this.pricer_shortcut = getProperty(input, 'pricer_shortcut', "Ctrl+U") as string
        this.price_interval = getProperty(input, 'price_interval', 3600) as number
        this.dump_image = getProperty(input, 'dump_image', false) as boolean
        this.enable_remote = getProperty(input, 'enable_remote', false) as boolean
        this.pricer_ontop = getProperty(input, 'enable_remote', false) as boolean
        return this
    }
    rejson() : object {
        return {
          use_tracker : this.use_tracker,
          tracker_ontop : this.tracker_ontop,
          tracker_height : this.tracker_height,
          tracker_width : this.tracker_width,
          tracker_trackloot : this.tracker_trackloot,
          account_name : this.account_name,
          client_txt : this.client_txt,
          character : this.character,
          poesessid : this.poesessid,
          league : this.league,
          screen_name : this.screen_name,
          dump_location : this.dump_location,
          use_pricer : this.use_pricer,
          pricer_shortcut : this.pricer_shortcut,
          price_interval : this.price_interval,
          dump_image : this.dump_image,
          enable_remote : this.enable_remote,
          pricer_ontop : this.pricer_ontop,
        }
    }
}