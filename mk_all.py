#!/usr/bin/env python3

import os
import sys
from typing import List

search_for = ["export class", "export abstract class", "export type", "export interface",
              "export enum", "export const", "export function"]


def get_exported(line: str) -> str:
    for searching in search_for:
        if line.startswith(searching):
            delimiter = line.find("=", len(searching))
            if delimiter == -1:
                delimiter = line.find("(", len(searching))
            if delimiter == -1:
                delimiter = line.find("<", len(searching))
            if delimiter == -1:
                delimiter = line.find("{", len(searching))
            if delimiter == -1:
                delimiter = len(line)
            return line[len(searching):delimiter].strip()
    return ""


def get_all(source: str) -> List[str]:
    results: List[str] = []
    with open("src/" + source, "r") as file:
        for line in file.readlines():
            exported = get_exported(line)
            if exported:
                link = "./" + os.path.splitext(source)[0]
                results.append(
                    'export { ' + exported + ' } from "' + link + '";')
    return results


def mk_all():
    if not os.path.exists('src/all.ts'):
        print("Does not need to make an all.ts source.")
        return
    print("Making 'src/all.ts'...")
    founds: List[str] = []
    for source in os.listdir("src"):
        if source.endswith(".ts"):
            founds.extend(get_all(source))
    founds.sort()
    with open("src/all.ts", "w") as file:
        for found in founds:
            file.write(found)
            file.write("\n")


if __name__ == "__main__":
    mk_all()


sys.modules[__name__] = mk_all
