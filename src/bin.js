#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const readDir = require('recursive-readdir')
const koppa = require('./index')
const mkdirp = require('mkdirp')

const source = path.join(process.cwd(), process.argv[2])
const dest = path.join(process.cwd(), process.argv[3])
const sourceRegExp = /\.kpp$/

;(async () => {
  // If a source file is provided then just compile that file
  // Otherwise find all the source files in the target directory
  const sourceFilePaths = sourceRegExp.test(source)
    ? [ source ]
    : await findSourceFiles(source, sourceRegExp)

  try {
    const processedFiles = sourceFilePaths.map(filePath => {
      return {
        input: filePath,
        output: filePath.replace(source, dest).replace(sourceRegExp, '.js'),
        content: koppa.compile(fs.readFileSync(filePath, { encoding: 'utf8' }))
      }
    })

    processedFiles.forEach(file => {
      mkdirp(path.dirname(file.output), err => {
        fs.writeFileSync(file.output, file.content)
      })
    })
  } catch (e) {
    console.log(e)
  }
})()

// Find all the source files in the directory
async function findSourceFiles (dir, matchPattern) {
  const files = await readDir(dir)

  return files.filter(filePath =>
    matchPattern.test(filePath) && fs.statSync(filePath).isFile())
}
