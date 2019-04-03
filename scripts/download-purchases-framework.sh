#!/bin/sh
VERSION=2.0.0
CURRENT_VERSION=$(cat node_modules/cordova-plugin-purchases/src/ios/.framework_version)

if [ "$VERSION" == "$CURRENT_VERSION" ]; then
  echo "The newest version is already installed. Exiting."
  exit 0
fi

pwd

URL=https://github.com/RevenueCat/purchases-ios/releases/download/$VERSION/Purchases.framework.zip

echo "Downloading Purchases iOS $VERSION from $URL, this may take a minute."

if ! which curl > /dev/null; then echo "curl command not found. Please install curl"; exit 1; fi;
if ! which unzip > /dev/null; then echo "unzip command not found. Please install unzip"; exit 1; fi;

if [ -d node_modules/cordova-plugin-purchases/src/ios/Purchases.framework ]; then
    echo "Old Purchases.framework found. Removing it and installing a $VERSION"
    rm -rf node_modules/cordova-plugin-purchases/src/ios/Purchases.framework
    rm -rf plugins/cordova-plugin-purchases/src/ios/Purchases.framework
fi

curl -sSL $URL > cordova-purchases-plugin-temp.zip
# In some cases the temp folder can not be created by unzip, https://github.com/RevenueCat/react-native-purchases/issues/26
mkdir -p cordova-purchases-plugin-temp
unzip -o cordova-purchases-plugin-temp.zip -d cordova-purchases-plugin-temp
mv cordova-purchases-plugin-temp/Purchases.framework .
rm -r cordova-purchases-plugin-temp
rm cordova-purchases-plugin-temp.zip

if ! [ -d ./Purchases.framework ]; then
  echo "Purchases.framework not found. Please reinstall cordova-plugin-purchases"; exit 1;
fi;

echo "$VERSION" > .framework_version

cp -R ./Purchases.framework plugins/cordova-plugin-purchases/src/ios/
cp -R ./Purchases.framework node_modules/cordova-plugin-purchases/src/ios/
cp ./.framework_version plugins/cordova-plugin-purchases/src/ios/
cp ./.framework_version node_modules/cordova-plugin-purchases/src/ios/

rm -rf ./Purchases.framework
rm ./.framework_version