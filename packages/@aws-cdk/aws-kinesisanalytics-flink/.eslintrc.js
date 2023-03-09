const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';

baseConfig.rules['import/no-extraneous-dependencies'] = ['error', { devDependencies: true, peerDependencies: true } ];
baseConfig.rules['import/order'] = 'off';

module.exports = baseConfig;
