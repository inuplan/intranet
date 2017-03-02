# HOWTO

## Compilation  
### Development  
From the command prompt type:

```bash
    $: npm run bundle
```

The typescripts files will be assembled and then compiled to `/dist/` folder, in 2 variants:

1. app.js  -- The main application file, which contains the routing and the pages  
2. lib.js  -- The library files, such as React and Redux etc.

After compilation the files will be moved to `./wwwroot/js` and `./wwwroot/lib` folders.

### Production  
From the command prompt type:

```bash
    $: npm run bundle:release
```

The typescripts files will be assembled and then compiled to `/dist/` folder, in 2 variants:

1. app.min.js  -- The main application file, which contains the routing and the pages  
2. lib.min.js  -- The library files, such as React and Redux etc.

After compilation the files will be moved to `./wwwroot/js` and `./wwwroot/lib` folders.


## Add external dependencies
### Bundle vendor, setup & config
From the command prompt type:

```bash
    $: npm install [package]
```

Then add the [package] name to the string array in `webpack.config.js` called `lib`.  
Do the same for the production config: `webpack.config.release.js`.  


[insert example]

### Add typescript declaration
TBA


## Run server
Ensure that the `web.config` file has the following line uncommented:

    `<aspNetCore processPath="dotnet" arguments="bin\Debug\netcoreapp1.0\Inuplan.Intranet.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" forwardWindowsAuthToken="true" />`

From the command prompt type, and run the bat-script file.

```bash
    $: site.bat
```

Located in the root folder.

## Important miscellaneous
- Do not delete or re-download the bootstrap.css file. It is a custom skin.
- Main application is not split (chunked)


Author: Johnny  
-- revision date: 17-02-2017