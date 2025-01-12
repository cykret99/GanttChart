// @ts-check

import { BaseEntity } from "./BaseEntity";

export class GroupEntity extends BaseEntity{
    public uuid:string;
    public parentUuid:string;
    public level:string;
    public groupCode:string;
    public groupName:string;
}

export default GroupEntity;
