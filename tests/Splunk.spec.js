const { expect } = require('chai')
const SplunkPlugin = require('../index')
const events = require('events')
const ee = new events.EventEmitter()
const sinon = require('sinon')

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

  describe('attachListeners', function () {
    it('should attach logStatsToSplunk to eventEmitter', function () {
      const splunkPlugin = new SplunkPlugin({
        plugins: {
          splunk: {
            token: '123',
            url: 'http://127.0.0.1/'
          }
        }
      }, ee)

      splunkPlugin.logStatsToSplunk = sinon.spy()
      splunkPlugin.attachListeners()
      ee.emit('stats')
      expect(splunkPlugin.logStatsToSplunk.calledOnce).to.be.eql(true)
    })
  })

  describe('logStatsToSplunk', function () {
    it('should map results and send logs to splunk', function () {
      const splunkPlugin = new SplunkPlugin({
        plugins: {
          splunk: {
            token: '123',
            url: 'http://127.0.0.1/'
          }
        }
      }, ee)

      splunkPlugin.splunkLogger.send = sinon.spy()
      splunkPlugin.logStatsToSplunk({
        _entries: [[1, 1, 1, 1]]
      })
      expect(splunkPlugin.splunkLogger.send.args[0][0]).to.be.eql({
        message: {
          from: 'artillery-plugin-splunk',
          timeStamp: 1,
          ruid: 1,
          latency: 1,
          statusCode: 1
        },
        metadata: {
          index: 'main'
        }
      })
    })

    it('should map results and send logs to splunk and should respect index from config', function () {
      const splunkPlugin = new SplunkPlugin({
        plugins: {
          splunk: {
            token: '123',
            url: 'http://127.0.0.1/',
            index: 'test'
          }
        }
      }, ee)

      splunkPlugin.splunkLogger.send = sinon.spy()
      splunkPlugin.logStatsToSplunk({
        _entries: [[1, 1, 1, 1]]
      })
      expect(splunkPlugin.splunkLogger.send.args[0][0]).to.be.eql({
        message: {
          from: 'artillery-plugin-splunk',
          timeStamp: 1,
          ruid: 1,
          latency: 1,
          statusCode: 1
        },
        metadata: {
          index: 'test'
        }
      })
    })
  })

  describe('validateConfig', function () {
    it('should not throw errors when params are all right', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: 'http://127.0.0.1/'
      })).to.not.throw()
    })

    it('should throw error when token is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: 123,
        url: 'http://127.0.0.1/'
      })).to.throw()
    })

    it('should throw error when token is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: null,
        url: 'http://127.0.0.1/'
      })).to.throw()
    })

    it('should throw error when url is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: 123
      })).to.throw()
    })

    it('should throw error when url is not an string', function () {
      expect(() => SplunkPlugin.validateConfig({
        token: '123',
        url: {}
      })).to.throw()
    })
  })
})
