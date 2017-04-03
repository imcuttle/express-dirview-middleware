'use strict';

/**
 * Created by moyu on 2017/4/1.
 */
var path = require('path');
var url = require('url');
var fs = require('fs');
var helper = require('./helpers');
var TemplateWithLayout = require('./helpers/TemplateWithLayout');
var Template = require('./helpers/Template');

var getFilesStatPromise = function getFilesStatPromise(dirname) {
    return helper.readDirPromise(dirname).then(function (files) {
        return Promise.all(files.map(function (name) {
            return helper.statPromise(path.join(dirname, name)).then(function (stat) {
                return {
                    type: stat.isFile() ? "File" : "Directory",
                    size: stat.isFile() ? stat.size.toSize() : "-",
                    name: name,
                    mtime: new Date(stat.mtime).format(),
                    ctime: new Date(stat.ctime).format()
                };
            });
        }));
    });
};

var trHtml = '<tr>' + '<th scope="row">${i}</th>' + '<td>${type}</td>' + '<td><a href="${nameLink}">${name}</a></td>' + '<td>${mtime}</td>' + '<td>${size}</td>' + '</tr>';

var tableHtml = '<table class="table table-responsive table-hover">' + '<thead>' + '<tr>' + '<th>#</th>' + '<th>Type</th>' + '<th>Filename</th>' + '<th>Modified Time</th>' + '<th>Size</th>' + '</tr>' + '</thead>' + '<tbody>' + '${tbody}' + '</tbody>';

var tableTpl = new Template();
// tableTpl.set("table", tableHtml);
tableTpl.set("tr", trHtml);

var template = new TemplateWithLayout();
template.set("directory", tableHtml);

module.exports = function (options) {
    var _options$root = options.root,
        dir = _options$root === undefined ? "." : _options$root,
        _options$redirect = options.redirect,
        redirect = _options$redirect === undefined ? false : _options$redirect;

    return function (req, res, next) {
        var error = function error(_error) {
            return res.send(_error);
        };

        var renderDirPage = function renderDirPage(pathname, files) {
            fs.readFile(path.join(__dirname, "static/css/entry.css"), function (err, data) {
                if (err) {
                    error(err);
                } else {
                    pathname = pathname == '' ? '/' : pathname;
                    var renderTr = function renderTr(a, i) {
                        return tableTpl.render("tr", {
                            i: i,
                            nameLink: route + pathname + (pathname.endsWith('/') ? '' : '/') + a.name,
                            name: a.name,
                            type: a.type,
                            mtime: a.mtime,
                            size: a.size
                        });
                    };
                    var tbody = files.reduce(function (a, b, i) {
                        return a + renderTr(b, i + 1);
                    }, '');

                    var html = template.render("directory", {
                        style: data.toString(),
                        title: pathname,
                        tbody: tbody
                    });

                    res.type('html');
                    res.send(html);
                    // res.render('directory', {title: pathname, path: pathname, files, route, style: data.toString()});
                }
            });
        };
        var route = req.baseUrl;

        /*if (!app.__file_flag__) {
         app.set('views', path.join(__dirname, 'views'));
         app.set('view engine', 'pug');
         app.__file_flag__ = true;
         }*/
        if (!req.originalUrl.startsWith(route)) {
            next();
            return;
        }
        var absolutePath = path.resolve(dir);
        // const relativePath = path.resolve(root);

        var _url$parse = url.parse(req.url),
            pathname = _url$parse.pathname;

        pathname = pathname.replace(new RegExp('^' + route), '').trim();
        pathname = pathname == '' ? '/' : pathname;
        var filename = path.join(absolutePath, pathname);
        // console.log(pathname);
        switch (pathname) {
            case '/':
                {
                    // root
                    getFilesStatPromise(filename).then(function (list) {
                        renderDirPage(pathname, list);
                    }).catch(error);
                    break;
                }
            default:
                {
                    helper.statPromise(filename).then(function (stat) {
                        if (stat.isDirectory()) {
                            return getFilesStatPromise(filename).then(function (list) {
                                var parent = path.dirname(filename);
                                var parentStat = fs.statSync(parent);
                                list.unshift({
                                    type: "Directory",
                                    size: "-",
                                    name: "..",
                                    mtime: new Date(parentStat.mtime).format(),
                                    ctime: new Date(parentStat.ctime).format()
                                });

                                renderDirPage(pathname, list);
                            }).catch(error);
                        } else {
                            if (redirect) {
                                res.redirect(pathname);
                            } else {
                                res.sendFile(filename);
                            }
                        }
                    }).catch(error);
                }
        }
    };
};