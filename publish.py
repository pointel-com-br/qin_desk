#!/usr/bin/env python3

import os
import sys


def publish(mode: str):
    print("Publishing...")
    for public_file in os.listdir("public"):
        if public_file.endswith(".build-js"):
            named = public_file.replace(".build-js", ".js")
            builded = "./build/" + named
            if os.path.exists(builded):
                os.system(
                    f"npx webpack build --stats verbose --mode {mode} --entry {builded} --output-path ./public --output-filename {named}")


if __name__ == "__main__":
    publish("development")


sys.modules[__name__] = publish
