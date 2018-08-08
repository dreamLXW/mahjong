#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
src=$DIR"/../build/jsb-default/res/raw-assets/Texture/mahjong/"
dst=$DIR"/../build/jsb-default/res/raw-assets/Texture1/mahjong/"
secret="e9d6ef8f-dff4-4a"

$DIR'/pack_files.sh' -i $src -o $dst -es XXTEA -ek $secret
rm -rf $src
mv $dst $src

src=$DIR"/../build/jsb-default/res/raw-assets/resources/mahjong/png/"
dst=$DIR"/../build/jsb-default/res/raw-assets/resources/mahjong/png1/"
secret="e9d6ef8f-dff4-4a"

$DIR'/pack_files.sh' -i $src -o $dst -es XXTEA -ek $secret
rm -rf $src
mv $dst $src