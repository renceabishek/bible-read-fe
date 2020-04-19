import { picsModel } from '../admin/youthmeetings/youthmeetings.component'

export class Meeting {
    uniqueId: string
    date: string
    moc: [string]
    arrangements: [string]
    worshipers: [string]
    musicians: [string]
    singers: [string]
    songs: string
    testimony: [string]
    wog: string[]
    aboutWog: string
    others: string[]
    picsUrl: string[]
    picsModel:picsModel[]
    othersAbout: string
    remarks: string
}