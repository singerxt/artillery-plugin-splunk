[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![codeshipbuild](https://codeship.com/projects/f43b6740-ed04-0136-2ba6-6e2c9c91f302/status?branch=master)](https://codeship.com/projects/f43b6740-ed04-0136-2ba6-6e2c9c91f302/status?branch=master)
[![codecov](https://codecov.io/gh/singerxt/artillery-plugin-splunk/branch/master/graph/badge.svg)](https://codecov.io/gh/singerxt/artillery-plugin-splunk)
[![Known Vulnerabilities](https://snyk.io/test/github/singerxt/artillery-plugin-splunk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/singerxt/artillery-plugin-splunk?targetFile=package.json)
[![npm version](https://badge.fury.io/js/artillery-plugin-splunk.svg)](https://badge.fury.io/js/artillery-plugin-splunk)
# artillery-plugin-splunk

A plugin for artillery.io that records _stats_ and _reports_ into HTTP Event Collector in Splunk

## Setup
You need to setup HTTP event collector in splunk. [instructions](https://docs.splunk.com/Documentation/SplunkCloud/7.1.3/Data/UsetheHTTPEventCollector)

1. Install
```
$ npm install --save artillery-plugin-splunk
```
2. Add artillery-plugin-splunk to config
```
config:
  target: "https://staging.example.com"
  plugins:
    splunk:
      url: 'XXX', # url to splunk cloud in this format https://input-prd-p-XXXXXXX.cloud.splunk.com:8088/services/collector)
      token: 'XXX' # token for HEC
      index: 'XXX' (optional) # splunk index
```




## Debbuging

1. Clone repo
```
$ git clone git@github.com:singerxt/artillery-plugin-splunk.git
```

2. Link package
```
$ npm link artillery-plugin-splunk
```

3. Create artillery script

```yml
config:
  target: "https://staging.example.com"
  plugins:
    splunk:
      url: 'XXX',
      token: 'XXX'
  phases:
    - duration: 300
      arrivalRate: 50

```

4. run it
```
$ DEBUG=plugin:splunk artillery run script.yml
```
