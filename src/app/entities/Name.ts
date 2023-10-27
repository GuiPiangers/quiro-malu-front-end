'use client'

import { Name } from "@quiromalu/core/src/models/shared/Name";

export default class newName extends Name {
    constructor(public value: string) {
        super(value)
    }
}