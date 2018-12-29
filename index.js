const { Logger: SplunkLogger } = require('splunk-logging')
const debug = require('debug')('plugin:splunk')

/**
 * A plugin for artillery.io that records stats and reports into HTTP Event Collector in Splunk
 */
class Splunk {
  /**
   * For using this plugin you need to enable HEC and create token
   * {@link https://docs.splunk.com/Documentation/SplunkCloud/7.1.3/Data/UsetheHTTPEventCollector}
   * @param {Object} config - raw config
   * @param {Object} config.splunk - splunk plugin configuration
   * @param {string} config.splunk.token - token for splunk HEC instance
   * @param {string} config.splunk.url - url to splunk cloud (in this format https://input-prd-p-XXXXXXX.cloud.splunk.com:8088/services/collector)
   * @param {string} [config.splunk.index = 'main'] - splunk index
   * @param {EventEmitter} eventEmiter from artillery
   * @param eventEmiter
   */
  constructor (config, eventEmiter) {
    this.eventEmiter = eventEmiter
    this.config = (config && config.plugins && config.plugins.splunk) || {}
    Splunk.validateConfig(this.config)
    this.config.index = this.config.index || 'main'
    this.splunkLogger = new SplunkLogger({
      token: this.config.token,
      url: this.config.url,
      index: this.config.index
    })
    debug('Successfully initialized', this.config)
    this.attachListeners()
  }

  /**
   * Mapping stats event to latency event and send it to splunk
   * @param {Object} stats - stats from artillery
   * @param {Array<Array<[number, string, number, number]>>} stats._entries - Array of entries
   * @param {Array<number>} stats._latencies - latencies
   * @return {undefined}
   */
  logStatsToSplunk (stats = {}) {
    const { _entries = [] } = stats
    for (let i = 0; i < _entries.length; i++) {
      const [ timeStamp, ruid, latency, statusCode ] = _entries[i]
      this.splunkLogger.send({
        message: {
          from: 'artillery-plugin-splunk',
          type: 'latency',
          timeStamp,
          ruid,
          latency,
          statusCode
        },
        metadata: {
          index: this.config.index
        }
      })
    }
  }

  /**
   * Log final report from done event to splunk
   * @param {Object} message - stats from artillery
   * @return {undefined}
   */
  logDoneToSplunk (message = {}) {
    message.from = 'artillery-plugin-splunk'
    message.type = 'report'
    this.splunkLogger.send({
      message,
      metadata: {
        index: this.config.index
      }
    })
  }

  /**
   * Attach listeners
   * @return {undefined}
   */
  attachListeners () {
    this.eventEmiter.on('stats', this.logStatsToSplunk.bind(this))
    this.eventEmiter.on('done', this.logDoneToSplunk.bind(this))
  }

  /**
   * validate config
   * @param {Object} config - splunk plugin configuration
   * @param {string} config.token - token for splunk HEC instance
   * @param {string} config.url - url to splunk cloud
   */
  static validateConfig ({ token, url } = {}) {
    if (!token || typeof token !== 'string') {
      throw new Error('token is required')
    }

    if (!url || typeof url !== 'string') {
      throw new Error('url is required')
    }
  }
}

module.exports = Splunk
