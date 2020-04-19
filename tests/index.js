#!/usr/bin/env node

const readDir = require('recursive-readdir')
const path = require('path')
const fs = require('fs')
const koppa = require('../src/index')

const sourceRegExp = /\.kpp$/
const expectedRegExp = /\.expected\.js$/

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const ansiColor = {
  green: text => `\x1b[32m${text}\x1b[39m`,
  red: text => `\x1b[31m${text}\x1b[39m`
}

const source = path.join(process.cwd(), process.argv[2])

;(async () => {

  // Get the list of all files in the directory
  const testFiles = sourceRegExp.test(source)
    ? [ source, source.replace('.kpp', '.expected.js') ]
    : await readDir(source)

  // Get all the source files
  const sourceFiles = testFiles
    .filter(path => sourceRegExp.test(path)) // Filter the files with .kpp extension
    .map(path => ({
      path,
      content: koppa.compile(fs.readFileSync(path, { encoding: 'utf8' }))}
    )) // Get the content of the files and compile them

  // Get all the expected files
  const expectedFiles = testFiles
    .filter(path => expectedRegExp.test(path)) // Filter the files with .expected.js extension
    .map(path => ({
      path,
      content: fs.readFileSync(path, { encoding: 'utf8' })
    })) // Get the content of the files

  // Compare each one
  sourceFiles.forEach((source, i) => {
    const fileName = capitalize(path.basename(source.path, '.kpp'))

    if (source.content === expectedFiles[i].content) {
      console.log(ansiColor.green('⯈ OK:'), fileName)
    } else {
      console.log('\n\n▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾')
      console.log(ansiColor.red('Error:'), fileName)
      console.log('------------------------------')
      console.log(ansiColor.red(source.content))
      console.log('------------------------------')
      console.log(ansiColor.green(expectedFiles[i].content))
      console.log('▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴▴')
    }
  })

  console.log('\r')

})()


