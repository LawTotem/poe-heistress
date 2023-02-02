<script lang="ts">

declare interface SettingsInterface {
    get_setting : (n: string, v : string | number | boolean ) => Promise<string | number | boolean>,
    set_setting : (n: string, v : string | number | boolean ) => void,
    decrypt_string : (n : string) => Promise<string>,
    encrypt_string : (n : string) => Promise<string>
}

declare global {
    interface Window {
        settings_access : SettingsInterface
    }
}

export default {
    data() {
        return {
            use_tracker: true,
            tracker_ontop: true,
            tracker_trackloot: true,
            tracker_height: 380,
            tracker_width: 500,
            league: "",
            account_name: "",
            client_txt: "",
            character: "",
            poesessid: "",
            screen_name: "",
            dump_location: "",
            use_pricer: true,
            pricer_shortcut: "",
            price_interval: 60*60,
            dump_image: false
            
        }
    },
    created() {
        window.settings_access.get_setting("league", "").then((data : string) =>{
            this.league = data
        })
        window.settings_access.get_setting("use_tracker", true).then((data : boolean) =>{
            this.use_tracker = data
        })
        window.settings_access.get_setting("client_txt", "").then((data : string) =>{
            this.client_txt = data
        })
        window.settings_access.get_setting("tracker_trackloot", true).then((data : boolean) => {
            this.tracker_trackloot = data
        })
        window.settings_access.get_setting("account_name", "").then((data : string) =>{
            this.account_name = data
        })
        window.settings_access.get_setting("character", "").then((data : string) =>{
            this.character = data
        })
        window.settings_access.get_setting("poesessid", "").then((data : string) =>{
            window.settings_access.decrypt_string(data).then((ddata : string) => {
                this.poessid = ddata
            })
        })
        window.settings_access.get_setting("dump_location", "./").then((data : string) => {
            this.dump_location = data
        })
        window.settings_access.get_setting("tracker_ontop", true).then((data : boolean) => {
            this.tracker_ontop = data
        })
        window.settings_access.get_setting("tracker_height", 380).then((data : number) => {
            this.tracker_height = data
        })
        window.settings_access.get_setting("tracker_width", 500).then((data : number) => {
            this.tracker_width = data
        })
        window.settings_access.get_setting("use_pricer", true).then((data : boolean) => {
            this.use_pricer = data
        })
        window.settings_access.get_setting("pricer_shortcut", "Ctrl+U").then((data : string) => {
            this.pricer_shortcut = data
        })
        window.settings_access.get_setting("price_interval", 60*60).then((data : number) => {
            this.price_interval = data
        })
        window.settings_access.get_setting("screen_name", "Path of Exile").then((data : string) => {
            this.screen_name = data
        })
        window.settings_access.get_setting("dump_image", false).then((data : boolean) => {
            this.dump_image = data
        })
    },
    methods: {
        save() {
            window.settings_access.set_setting("league", this.league)
            window.settings_access.set_setting("use_tracker", this.use_tracker)
            window.settings_access.set_setting("client_txt", this.client_txt)
            window.settings_access.set_setting("tracker_trackloot", this.tracker_trackloot)
            window.settings_access.set_setting("account_name", this.account_name)
            window.settings_access.set_setting("character", this.character)
            window.settings_access.encrypt_string(this.poesessid).then((data : string) => {
                window.settings_access.set_setting("poesessid", data)
            })
            window.settings_access.set_setting("dump_location", this.dump_location)
            window.settings_access.set_setting("tracker_ontop", this.tracker_ontop)
            window.settings_access.set_setting("tracker_height", this.tracker_height)
            window.settings_access.set_setting("tracker_width", this.tracker_width)
            window.settings_access.set_setting("use_pricer", this.use_pricer)
            window.settings_access.set_setting("pricer_shortcut", this.pricer_shortcut)
            window.settings_access.set_setting("price_interval", this.price_interval)
            window.settings_access.set_setting("screen_name", this.screen_name)
            window.settings_access.set_setting("dump_image", this.dump_image)
        }
    }
}
</script>

<template>
    <div id="common_setting">
        <h2>{{ $t("common.common_settings")}}</h2>
        <p>{{ $t("common.league") }} <input v-model="league"/></p>
    </div>
    <div id="tracker_settings">
        <h2>{{ $t("common.tracker_settings") }}</h2>
        <p>{{ $t("common.use_tracker") }} <input type="checkbox" v-model="use_tracker"/></p>
        <p>{{ $t("common.clienttxt") }} <input v-model="client_txt"/></p>
        <p>{{ $t("common.tracker_trackloot") }} <input type="checkbox" v-model="tracker_trackloot"/></p>
        <p>{{ $t("common.accountname") }} <input v-model="account_name"/></p>
        <p>{{ $t("common.charactername") }} <input v-model="character"/></p>
        <p>{{ $t("common.poesessid") }} <input type="password" v-model="poesessid"/></p>
        <p>{{ $t("common.run_save_loc") }} <input v-model="dump_location"/></p>
        <p>{{ $t("common.tracker_height") }} <input v-model="tracker_height"/></p>
        <p>{{ $t("common.tracker_width") }} <input v-model="tracker_width"/></p>
        <p>{{ $t("common.tracker_ontop") }} <input type="checkbox" v-model="tracker_ontop"/></p>
    </div>
    <div id="pricer_settings">
        <h2>{{ $t("common.pricer_settings") }}</h2>
        <p>{{ $t("common.use_pricer") }} <input type="checkbox" v-model="use_pricer"/></p>
        <p>{{ $t("common.grab_screen_name")}} <input v-model="screen_name"/></p>
        <p>{{ $t("common.price_interval") }} <input v-model="price_interval"/></p>
        <p>{{ $t("common.pricer_shortcut") }} <input v-model="pricer_shortcut"/></p>
        <p>{{ $t("common.dump_image") }} <input type="checkbox" v-model="dump_image"/></p>
    </div>
    <button @click="save()">Save Settings</button>
</template>

<style lang="css">
</style>