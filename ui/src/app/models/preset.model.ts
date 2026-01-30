import { Sample } from "./sample.model";

export class Preset {
    _id!: string;
    category!: string;
    samples!: Sample[];
}