import { MenuDto } from "./MenuDto";

export class BarDto{
    id: number;
    title: string;
    isClicked:boolean=false;
    hasChild:boolean
    menusDto: MenuDto[];
} 