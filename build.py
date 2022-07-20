#!/usr/bin/env python3

import os
import sys

import mk_all


def build():
    mk_all()
    print("Building...")
    os.system("npx tsc --build --verbose")


if __name__ == "__main__":
    build()


sys.modules[__name__] = build
