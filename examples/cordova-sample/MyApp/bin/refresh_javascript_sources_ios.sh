# in case this script is run from another directory, cd into the directory of the script
SCRIPT_DIRECTORY="$(dirname "$(realpath "$0")")"

# run the transpiling step
cd $SCRIPT_DIRECTORY/../plugins/cordova-plugin-purchases
npm run build
