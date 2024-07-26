const { readFile, writeFile } = require('fs')
const fs = require('fs/promises')

const readData = async (filepath, isParsed = false) => {
    try {
        if (!filepath) return ''
        const data = await fs.readFile(filepath, 'utf-8')
        return isParsed ? JSON.parse(data) : data

    } catch (error) {
        console.log(error)
    }
}

const writeData = async (filepath, file) => {
    try {
        await fs.writeFile(filepath, JSON.stringify(file))
        console.log({ message: "Done" });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { readData, writeData }