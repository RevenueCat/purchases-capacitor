#! /bin/sh
cordova platform remove ios
cordova platform remove android

cordova platform add ios
cordova platform add android

cordova plugin remove purchases
cordova plugin add ../../../../cordova-plugin-purchases --link --save

cd ../../../../cordova-plugin-purchases
npm install
