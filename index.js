const { Logger: SplunkLogger } = require("splunk-logging");

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
   * @param {string} config.splunk.url - url to splunk cloud
   * @param {string} [config.splunk.index = 'main'] - splunk index
   * @param {EventEmitter} eventEmiter from artillery
   * @param eventEmiter
   */
  constructor (config, eventEmiter) {
    this.eventEmiter = eventEmiter
    this.config = (config && config.plugins && config.plugins.splunk) || {}
    Splunk.validateConfig(this.config)
  }

  /**
   * validate config
   * @param {Object} config - splunk plugin configuration
   * @param {string} config.token - token for splunk HEC instance
   * @param {string} config.url - url to splunk cloud
   * @param {string} [config.index = 'main'] - splunk index
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
