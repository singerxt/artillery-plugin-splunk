[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![codeshipbuild](https://codeship.com/projects/f43b6740-ed04-0136-2ba6-6e2c9c91f302/status?branch=master)](https://codeship.com/projects/f43b6740-ed04-0136-2ba6-6e2c9c91f302/status?branch=master)
[![codecov](https://codecov.io/gh/singerxt/artillery-plugin-splunk/branch/master/graph/badge.svg)](https://codecov.io/gh/singerxt/artillery-plugin-splunk)
# artillery-plugin-splunk


# Debbuging

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
$ artillery run script.yml
```
