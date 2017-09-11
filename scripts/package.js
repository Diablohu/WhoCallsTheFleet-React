/*
 * copy all *.webp from /dist-web/public/app/_pics to pics
 */

const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
// const asar = require('asar')
const packager = require('electron-packager')
const npmRunScript = require('npm-run-script')

const run = async (src) => {
    console.log('')
    console.log('packaging app...')

    const dirPackage = 'electron'

    const pathRoot = path.resolve(__dirname, '../')
    const pathApp = path.resolve(pathRoot, './dist-app')
    const pathPics = path.resolve(pathRoot, './dist-web/public/app/_pics')
    const pathPackage = path.resolve(pathRoot, `../${dirPackage}`)

    const dest = path.resolve(pathRoot, 'app.asar')

    // determine src path
    // if (!src) src = path.resolve(pathPackage, './WhoCallsTheFleet')
    if (!src) src = pathPackage
    src = path.resolve(src)
    console.log(`> source: ${src}`)

    // make sure and empty package directory
    await fs.emptyDir(pathPackage)
    console.log(`> package directory make sure empty...`)

    // copy files to src directory
    console.log(`> copying files to source directory...`)
    await fs.copy(pathApp, src)
    console.log(`  > complete!`)

    // copy pics to src directory
    console.log(`> copying pics to source directory...`)
    await new Promise((resolve, rejct) => glob(
        path.resolve(pathPics, '**/*.webp'),
        {},
        (err, files) => {
            if (err) reject(err)
            resolve(files.map(file => file.substr(pathPics.length + 1)))
        }
    )).then(files => new Promise((resolve, reject) => {
        let chain = new Promise(resolve => resolve())
        files.forEach(file => {
            const source = path.resolve(pathPics, file)
            const target = path.resolve(src, 'pics/', file)
            chain = chain.then(() =>
                fs.copy(source, target)
            )
        })
        chain = chain.then(() => resolve(files.length))
            .catch(err => reject(err))
    })).then(count => {
        console.log(`  > copied ${count} files!`)
    })
    // console.log(pics)
    console.log(`  > complete!`)

    // copy startup js to src
    console.log(`> creating & copying other files`)
    await fs.copy(path.resolve(pathRoot, 'src/electron.js'), path.resolve(pathPackage, 'main.js'))
    await fs.writeJson(path.resolve(pathPackage, 'package.json'), {
        "name": "whocallsthefleet",
        "version": fs.readJSONSync(path.resolve(pathRoot, 'package.json')).version,
        "main": "main.js",
        "description": "Who Calls the Fleet (http://fleet.moe)",
        "author": {
            "name": "Diablohu",
            "email": "diablohudream@gmail.com",
            "url": "http://diablohu.com"
        },
        "license": "MIT",
        "repository": {
            "type": "git",
            "url": "https://github.com/Diablohu/WhoCallsTheFleet"
        },
        "scripts": {
            "start": "node ./main"
        },
        "dependencies": {
        },
        "devDependencies": {
            "electron": "1.7.6"
        }
    })
    console.log(`  > complete!`)

    // installing node packages
    // console.log(`> installing npm packages...`)
    // await new Promise((resolve, reject) => {
    //     const child = npmRunScript(
    //         `npm --prefix ./${dirPackage} install ./${dirPackage}`,
    //         // {
    //         //     stdio: 'ignore' // quiet
    //         // }
    //     );
    //     child.once('error', (error) => {
    //         process.exit(1);
    //         reject(error);
    //     });
    //     child.once('exit', (exitCode) => {
    //         // process.exit(exitCode);
    //         resolve();
    //     });
    // })
    // console.log(`  > complete!`)

    // packaging
    // console.log(`> packaging...`)
    // await new Promise((resolve, reject) => {
    //     asar.createPackage(src, dest, () => {
    //         console.log(`  > complete! ${dest}`)
    //         resolve()
    //     })
    // })

    // bundling
    // console.log(`> bundling...`)
    // const pathAssets = path.resolve(pathPackage, 'assets')
    // const packagerDefaults = {
    //     dir: pathPackage,
    //     name: "WhoCallsTheFleet",
    //     quiet: true,
    //     // asar: true,
    //     arch: "x64",
    //     // out: pathPackage
    // }
    // const packagerDo = async (options = {}) => {
    //     const settings = Object.assign({}, packagerDefaults, options)
    //     console.log(`  > building: ${settings.platform}-${settings.arch}`)
    //     // console.log(settings)
    //     await packager(settings)
    //         .catch(err => console.log(err))
    //     console.log(`    > built: ${settings.platform}-${settings.arch}`)
    // }
    // await packagerDo({
    //     platform: 'win32',
    //     icon: path.join(pathAssets, `appicon.ico`)
    // })
    // await packagerDo({
    //     platform: 'darwin',
    //     icon: path.join(pathAssets, `appicon.icns`)
    // })
    // console.log(`  > complete!`)

    console.log('> packaging app complete!')
    console.log('')
}

run()