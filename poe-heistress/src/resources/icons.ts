import icons from './icons.json'

export const Icons = icons;

/*
Object.keys(Icons).forEach((key : keyof typeof Icons) => {
    const sub_icons = Icons[key]
    Object.keys(sub_icons).forEach((icon : keyof typeof sub_icons) => {
        require('../static/' + sub_icons[icon])
    })
})
*/