#### setup instructions

1. cd into the root of the example project, then:

```bash
sh bin/setup.sh
```

2. api key

Edit the api key in index.js

```bash
sed -i .bck s/api_key/<your_api_key>/ www/js/index.js
```


2. iOS

Edit the project settings in Xcode: 
Add a Run Script Build Phase, name it "Refresh Javascript Sources"
Add the following code: 

```bash
sh ../../bin/refresh_javascript_sources_ios.sh
```

You're ready to go! 

#### when making changes: 

##### In Obj-C code:

You can just make the edits straight from Xcode or AppCode, then build and you're good. 

#### In Javascript code, but not the javascript code for the plugin: 

You can just make the edits straight from Xcode or AppCode, then build and you're good. 

#### In the plugin's javascript code:

Unfortunately, the only way to reflect the changes at the time of this writing seems to be to remove the plugin and re-add it. 

The build step will transpile the typescript files into js, however. So you can make the updates from Xcode, but you'll have to remove and add the plugin manually after any changes. 
