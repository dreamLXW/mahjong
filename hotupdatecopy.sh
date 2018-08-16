#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
src=$DIR"/build/jsb-default/main.js"
dst=$DIR"/main.js"

rm -rf $src
cp $dst $src