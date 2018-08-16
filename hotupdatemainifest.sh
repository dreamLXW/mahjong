#!/bin/sh
VERSION=$1
node version_generator.js -v $VERSION -u http://gameres.ddpkcc.com/dingding/pro-2_0_0/ -s build/jsb-default -d assets/manifest/ --pmname project-pro.manifest --vmname version-pro.manifest
node version_generator.js -v $VERSION -u http://gameres.ddpkcc.com/dingding/test-2_0_0/ -s build/jsb-default -d assets/manifest/ --pmname project-test.manifest --vmname version-test.manifest