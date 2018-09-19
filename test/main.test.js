/**
 * @file main.test.js
 * @author Cuttle Cong
 * @date 2018/9/19
 *
 */
const dirMiddleware = require('../src')
const express = require('express')
const request = require('supertest')
const nps = require('path')

const app = express()
app.use('/file', dirMiddleware({ root: nps.join(__dirname, 'fixture') }))

it('should output content', function(done) {
  request(app)
    .get('/file/1')
    .expect(200)
    .then(res => {
      expect(res.body.toString()).toBe('222')
      done()
    })
})

it('should output content has chinese', function(done) {
  request(app)
    .get(encodeURI('/file/d/你好'))
    .expect(200)
    .then(res => {
      expect(res.body.toString()).toBe('你好')
      done()
    })
})

