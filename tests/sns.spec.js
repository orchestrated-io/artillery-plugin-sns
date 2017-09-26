'use strict';

var AWS_SDK = 'aws-sdk',
    SNS_PLUGIN = __dirname + '/../lib/sns.js',
    aws = require(AWS_SDK),
    expect = require('chai').expect,
    sns,
    script = {
        config: {
            plugins: {
                sns: {
                    topicArn: 'MY_TOPIC_ARN'
                }
            }
        }
    };
aws.config.credentials.accessKeyId = '12345678901234567890';
aws.config.credentials.secretAccessKey = '1234567890123456789012345678901234567890';
aws.config.credentials.sessionToken = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234==';
aws.config.credentials.region = 'my-region';

sns = require(SNS_PLUGIN);

describe('SNS Plugin Tests', function() {
    before(function() {
        console.log('Running SNS Plugin Tests');
    });
    after(function() {
        console.log('Completed SNS Plugin Tests');
    });
    describe('Validate the configuration of the plugin', function() {
        it('Expects configuration to be provided', function () {
            expect(function () {
                sns.impl.validateConfig(null);
            }).to.throw(sns.messages.pluginConfigRequired);
            expect(function () {
                sns.impl.validateConfig({});
            }).to.throw(sns.messages.pluginConfigRequired);
            expect(function () {
                sns.impl.validateConfig({ plugins: {} });
            }).to.throw(sns.messages.pluginConfigRequired);
        });
        it('Expects configuration to include the attribute `topicArn` with a string value', function () {
            expect(function () {
                sns.impl.validateConfig({ plugins: { sns: {} } });
            }).to.throw(sns.messages.pluginParamTopicArnRequired);
            expect(function () {
                sns.impl.validateConfig({ plugins: { sns: { topicArn: {} } } });
            }).to.throw(sns.messages.pluginParamTopicArnMustBeString);
            expect(function () {
                sns.impl.validateConfig({ plugins: { sns: { topicArn: true } } });
            }).to.throw(sns.messages.pluginParamTopicArnMustBeString);
            expect(function () {
                sns.impl.validateConfig({ plugins: { sns: { topicArn: 1 } } });
            }).to.throw(sns.messages.pluginParamTopicArnMustBeString);
            expect(function() {
                sns.impl.validateConfig({ plugins: { sns: { topicArn: '' } } });
            }).to.throw(sns.messages.pluginParamTopicArnMustHaveALengthOfAtLeastOne);
        });
        it('Expects valid aws-sdk configuration credentials', function() {
            // delete require.cache[require.resolve('aws-sdk')];
            // delete require.cache[require.resolve('aws-sdk')];
        });
        it('Expects a valid aws-sdk configuration region', function() {
            // delete require.cache[require.resolve('aws-sdk')];
            // delete require.cache[require.resolve('aws-sdk')];
        });
        it('Expects valid configuration produce a usable plugin', function () {
            expect(function() {
                sns.impl.validateConfig(script.config);
            }).to.not.throw('config is valid');
        });
    });
});
