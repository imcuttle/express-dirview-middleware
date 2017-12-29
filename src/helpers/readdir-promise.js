/**
 * Created by moyu on 2017/4/1.
 */
const fs = require('fs')
const nps = require('path')

module.exports = function (filename, filter = () => true) {
    return new Promise((resolve, reject) => {
        const dirname = nps.dirname(filename)
        fs.readdir(filename, (err, list) => {
            if (err) {
                reject(err);
            } else {
                list = list.filter(name =>
                   filter && filter(nps.join(dirname, name))
                )
                resolve(list);
            }
        })
    })
}