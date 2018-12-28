const { expect } = require('chai')
const SplunkPlugin = require('../index')
const events = require('events')
const ee = new events.EventEmitter()

describe('Splunk', function () {
  describe('constructor', function () {
    it('should create instance without throwing error when arguments are valid', function () {
      expect(() => new SplunkPlugin({
        plugins: {
          splunk: {
            token: '123',
            url: 'http://127.0.0.1/'
          }
        }
      }, ee)).to.not.throw()
    })

    it('should throw error if token parameter is wrong', function () {
      expect(() => new SplunkPlugin({
        plugins: {
          splunk: {
            token: null,
            url: 'http://127.0.0.1/'
          }
        }
      })).to.throw()
    })

    it('should throw error if url parameter is wrong', function () {
      expect(() => new SplunkPlugin({
        plugins: {
          splunk: {
            token: '123',
            url: null
          }
        }
      })).to.throw()
    })

    it('should throw error if all parameters is wrong', function () {
      expect(() => new SplunkPlugin({
        plugins: {
          splunk: {
            token: null,
            url: null
          }
        }
      })).to.throw()
    })

    it('should throw error if all parameters is wrong case', function () {
      expect(() => new SplunkPlugin({
        plugins: {}
      })).to.throw()
    })

    it('should throw error if all parameters is wrong case', function () {
      expect(() => new SplunkPlugin({})).to.throw()
    })
  })

  describe('validateConfig', function () {
    it('Should not throw errors when params are all right', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: 'http://127.0.0.1/'
      })).to.not.throw()
    })

    it('Should throw error when token is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: 123,
        url: 'http://127.0.0.1/'
      })).to.throw()
    })

    it('Should throw error when token is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: null,
        url: 'http://127.0.0.1/'
      })).to.throw()
    })

    it('Should throw error when url is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: 123
      })).to.throw()
    })

    it('Should throw error when url is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: {}
      })).to.throw()
    })
  })
})
