import { picsModel } from '../admin/youthmeetings/youthmeetings.component'
import { NameModel } from '../admin/model/NameModel'

export class Meeting {
    uniqueId: string
    date: string
    moc: [string]
    mocModel: NameModel[]
    arrangements: [string]
    arrangementsModel: NameModel[]
    worshipers: [string]
    worshipersModel: NameModel[]
    musicians: [string]
    musiciansModel: NameModel[]
    singers: [string]
    singersModel: NameModel[]
    songs: string
    testimony: [string]
    testimonyModel: NameModel[]
    wog: [string]
    wogModel: NameModel[]
    aboutWog: string
    others: [string]
    othersModel: NameModel[]
    picsUrl: string[]
    picsModel:picsModel[]
    othersAbout: string
    remarks: string
}