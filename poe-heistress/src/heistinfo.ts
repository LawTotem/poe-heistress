
import BaseInfo from './heist.json'

export const HeistInfo = BaseInfo

export type ZoneInfo = {
    name: string,
    line: string,
    jobs: string[],
    damage: string[],
    target: string,
    contract_safes: boolean,
    blueprint_safes: boolean
}

export const RoomMap = new Map<string, ZoneInfo>()
HeistInfo.zones.forEach((element : ZoneInfo) => RoomMap.set(element.name, element))

export type RogueInfo = {
    name : string,
    jobs : string[],
    objective : string[],
    lines : string[],
    lockpicking? : string[],
    perception? : string[],
    agility? : string[],
    brute? : string[],
    demolition? : string[],
    engineering? : string[],
    trapdisarm? : string[],
    deception? : string[]
}

export type JobInfo = {
    name: string,
    rewards: string
}