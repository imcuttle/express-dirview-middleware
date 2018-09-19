/**
 * Created by moyu on 2017/4/1.
 */
const path = require('path')
const url = require('url')
const fs = require('fs')
const helper = require('./helpers')
const TemplateWithLayout = require('./helpers/TemplateWithLayout')
const Template = require('./helpers/Template')

const getFilesStatPromise = (dirname, filter) => {
  return helper.readDirPromise(dirname, filter).then(files =>
    Promise.all(
      files.map(name =>
        helper.statPromise(path.join(dirname, name)).then(stat => ({
          type: stat.isFile() ? 'File' : 'Directory',
          size: stat.isFile() ? stat.size.toSize() : '-',
          name,
          mtime: new Date(stat.mtime).format(),
          ctime: new Date(stat.ctime).format()
        }))
      )
    )
  )
}

const trHtml =
  '<tr>' +
  '<th scope="row">${i}</th>' +
  '<td>${type}</td>' +
  '<td><a href="${nameLink}">${name}</a></td>' +
  '<td>${mtime}</td>' +
  '<td>${size}</td>' +
  '</tr>'

const tableHtml =
  '<table class="table table-responsive table-hover">' +
  '<thead>' +
  '<tr>' +
  '<th>#</th>' +
  '<th>Type</th>' +
  '<th>Filename</th>' +
  '<th>Modified Time</th>' +
  '<th>Size</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody>' +
  '${tbody}' +
  '</tbody>'

const tableTpl = new Template()
// tableTpl.set("table", tableHtml);
tableTpl.set('tr', trHtml)

const template = new TemplateWithLayout()
template.set('directory', tableHtml)

module.exports = function(options) {
  const { root: dir = '.', redirect = false, filter = () => true } = options
  return function(req, res, next) {
    const error = error => res.send(error)

    const renderDirPage = (pathname, files) => {
      fs.readFile(path.join(__dirname, 'static/css/entry.css'), (err, data) => {
        if (err) {
          error(err)
        } else {
          pathname = pathname == '' ? '/' : pathname
          const renderTr = (a, i) => {
            return tableTpl.render('tr', {
              i: i,
              nameLink:
                route + pathname + (pathname.endsWith('/') ? '' : '/') + a.name,
              name: a.name,
              type: a.type,
              mtime: a.mtime,
              size: a.size
            })
          }
          const tbody = files.reduce((a, b, i) => {
            return a + renderTr(b, i + 1)
          }, '')

          const html = template.render('directory', {
            style: data.toString(),
            title: pathname,
            tbody
          })

          res.type('html')
          res.send(html)
          // res.render('directory', {title: pathname, path: pathname, files, route, style: data.toString()});
        }
      })
    }
    let route = req.baseUrl

    /*if (!app.__file_flag__) {
         app.set('views', path.join(__dirname, 'views'));
         app.set('view engine', 'pug');
         app.__file_flag__ = true;
         }*/
    if (!req.originalUrl.startsWith(route)) {
      next()
      return
    }
    const absolutePath = path.resolve(dir)
    // const relativePath = path.resolve(root);
    let { pathname } = url.parse(req.url)
    pathname = pathname.replace(new RegExp(`^${route}`), '').trim()
    pathname = pathname == '' ? '/' : pathname
    pathname = decodeURI(pathname)
    const filename = path.join(absolutePath, pathname)
    // console.log(pathname);
    switch (pathname) {
      case '/': {
        // root
        getFilesStatPromise(filename, filter)
          .then(list => {
            renderDirPage(pathname, list)
          })
          .catch(error)
        break
      }
      default: {
        helper
          .statPromise(filename)
          .then(stat => {
            if (stat.isDirectory()) {
              return getFilesStatPromise(filename)
                .then(list => {
                  let parent = path.dirname(filename)
                  let parentStat = fs.statSync(parent)
                  list.unshift({
                    type: 'Directory',
                    size: '-',
                    name: '..',
                    mtime: new Date(parentStat.mtime).format(),
                    ctime: new Date(parentStat.ctime).format()
                  })

                  renderDirPage(pathname, list)
                })
                .catch(error)
            } else {
              if (redirect) {
                res.redirect(pathname)
              } else {
                res.sendFile(filename)
              }
            }
          })
          .catch(error)
      }
    }
  }
}
