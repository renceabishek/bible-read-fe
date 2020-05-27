import { picsModel } from '../admin/activity/activity.component'
import { NameModel } from '../admin/model/NameModel'

export class Activity {
    uniqueId:string
    title: string
    date: string
    organizedBy: [string]
    organizedByModel: NameModel[]
    participatedBy: [string]
    participatedByModel: NameModel[]
    helpedBy: [string]
    helpedByModel: NameModel[]
    content: string
    picsUrl: string[]
    picsModel:picsModel[]
}