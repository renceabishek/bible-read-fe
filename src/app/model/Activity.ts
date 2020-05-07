import { picsModel } from '../admin/activity/activity.component'

export class Activity {
    uniqueId:string
    title: string
    date: string
    organizedBy: [string]
    participatedBy: [string]
    helpedBy: [string]
    content: string
    picsUrl: string[]
    picsModel:picsModel[]
}