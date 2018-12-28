const { Logger: SplunkLogger } = require('splunk-logging')

/**
 * Plugin for artillery.io
 *
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
    this.splunkLogger = new SplunkLogger({
      token: this.config.token,
      url: this.config.url,
      index: this.config.index || 'main'
    })
    this.attachListeners()
  }

  /**
   *
   * @param {Object} stats - stats from artilery
   * @param {Array<Array<[number, string, number, number]>>} stats._entries - Array of entries
   * @param {Array<number>} stats._latencies - latencies
   */
  logStatsToSplunk (stats = {}) {
    const { _entries = [] } = stats
    for (let i = 0; i < _entries.length; i++) {
      const [ timeStamp, ruid, latency, statusCode ] = _entries[i]
      this.splunkLogger.send({
        message: {
          from: 'artillery-plugin-splunk',
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
   * Attach listeners
   * @return {Void}
   */
  attachListeners () {
    this.eventEmiter.on('stats', this.logStatsToSplunk.bind(this))
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
