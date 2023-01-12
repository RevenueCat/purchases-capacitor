const bumpFiles = [
  {
    filename: "./package.json",
    type: "json",
  },
  {
    filename:
      "./android/src/main/java/ee/forgr/plugin/capacitor_purchases/CapacitorPurchasesPlugin.java",
    updater: {
      readVersion: (contents) => {
        const marketingVersionString = contents.match(
          /String PLUGIN_VERSION = "(.*)";/
        );
        const version = marketingVersionString.toString();
        return version;
      },
      writeVersion: (contents, version) => {
        const newContent = contents.replace(
          /String PLUGIN_VERSION = ".*";/g,
          `String PLUGIN_VERSION = "${version}";`
        );
        return newContent;
      },
    },
  },
  {
    filename: "./ios/Plugin/CapacitorPurchasesPlugin.swift",
    updater: {
      readVersion: (contents) => {
        const marketingVersionString = contents.match(
          /let PLUGIN_VERSION = "(.*)"/
        );
        const version = marketingVersionString.toString();
        return version;
      },
      writeVersion: (contents, version) => {
        const newContent = contents.replace(
          /let PLUGIN_VERSION = ".*"/g,
          `let PLUGIN_VERSION = "${version}"`
        );
        return newContent;
      },
    },
  },
];

module.exports = {
  noVerify: true,
  tagPrefix: "",
  bumpFiles: bumpFiles,
  packageFiles: [
    {
      filename: "./package.json",
      type: "json",
    },
  ],
};
