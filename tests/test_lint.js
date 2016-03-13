var lint = require('mocha-eslint');

var filePaths = [
  'app/**/*.js',
  'tests/**/*.js',
  'package.json'
];

var options = {
  formatter: 'compact',
  alwaysWarn: false,
  timeout: 5000
};

lint(filePaths, options);
