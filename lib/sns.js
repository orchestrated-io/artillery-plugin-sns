'use strict';

const zlib = require('zlib');
const debug = require('debug')('plugin:sns');

var aws = require('aws-sdk'),
    sns = new aws.SNS(),
    constants = {
        PLUGIN_NAME: 'sns',
        PLUGIN_PARAM_TOPICARN: 'topicArn',
        PLUGIN_PARAM_SUBJECT: 'subject',
        PLUGIN_PARAM_COMPRESSMESSAGE: 'compressMessage',
        THE: 'The "',
        CONFIG_REQUIRED: '" plugin requires configuration under <script>.config.plugins.',
        PARAM_REQUIRED: '" parameter is required',
        PARAM_MUST_BE_STRING: '" param must have a string value',
        PARAM_MUST_HAVE_LENGTH_OF_AT_LEAST_ONE: '" param must have a length of at least one',
        PARAM_MUST_BE_ARRAY: '" param must have an array value',
        // Report Array Positions
        TIMESTAMP: 0,
        REQUEST_ID: 1,
        LATENCY: 2,
        STATUS_CODE: 3
    },
    messages = {
        pluginConfigRequired: constants.THE + constants.PLUGIN_NAME + constants.CONFIG_REQUIRED + constants.PLUGIN_NAME,
        pluginParamTopicArnRequired: constants.THE + constants.PLUGIN_PARAM_TOPICARN + constants.PARAM_REQUIRED,
        pluginParamTopicArnMustBeString: constants.THE + constants.PLUGIN_PARAM_TOPICARN + constants.PARAM_MUST_BE_STRING,
        pluginParamTopicArnMustHaveALengthOfAtLeastOne: constants.THE + constants.PLUGIN_PARAM_NAMESPACE + constants.PARAM_MUST_HAVE_LENGTH_OF_AT_LEAST_ONE // ,
    },
    impl = {
        validateConfig: function(scriptConfig) {
            // Validate that plugin config exists
            if (!(scriptConfig && scriptConfig.plugins && constants.PLUGIN_NAME in scriptConfig.plugins)) {
                throw new Error(messages.pluginConfigRequired);
            }
            // Validate NAMESPACE
            if (!(constants.PLUGIN_PARAM_TOPICARN in scriptConfig.plugins[constants.PLUGIN_NAME])) {
                throw new Error(messages.pluginParamTopicArnRequired);
            } else if (!('string' === typeof scriptConfig.plugins[constants.PLUGIN_NAME][constants.PLUGIN_PARAM_TOPICARN] ||
                scriptConfig.plugins[constants.PLUGIN_NAME][constants.PLUGIN_PARAM_TOPICARN] instanceof String)) {
                throw new Error(messages.pluginParamTopicArnMustBeString);
            } else if (scriptConfig.plugins[constants.PLUGIN_NAME][constants.PLUGIN_PARAM_TOPICARN].length === 0) {
                throw new Error(messages.pluginParamTopicArnMustHaveALengthOfAtLeastOne);
            }
        },
        buildSNSParams: function(topicArn, subject, compressMessage, report) {
          let reportStr = report;
          if (typeof report !== "string") {
            reportStr = JSON.stringify(reportStr, null, 2);  
          }
          let message = reportStr;
          if (compressMessage) {
            message = zlib.deflateSync(message).toString('base64');
          }
          var snsParams = {
            TopicArn: topicArn,
            Subject: subject,
            Message: message
          };
          return snsParams;
        },
        SNSPlugin: function(scriptConfig, eventEmitter) {
           var self = this,
                reportError = function (err) {
                    if (err) {
                        debug('Error publishing to SNS topic:', err);
                    }
                };
            self.config = JSON.parse(JSON.stringify(scriptConfig.plugins[constants.PLUGIN_NAME]));
            eventEmitter.on('done', function (report) {
                var snsParams = impl.buildSNSParams(self.config[constants.PLUGIN_PARAM_TOPICARN], self.config[constants.PLUGIN_PARAM_SUBJECT] || "Artillery Report", self.config[constants.PLUGIN_PARAM_COMPRESSMESSAGE], report);
								sns.publish(snsParams, reportError);
                debug('Report published to SNS topic %s', self.config[constants.PLUGIN_PARAM_TOPICARN]);
            });
        }
    },
    api = {
        init: function (scriptConfig, eventEmitter) {
            impl.validateConfig(scriptConfig);
            return new impl.SNSPlugin(scriptConfig, eventEmitter);
        }
    };

/**
 * Configuration:
 *  {
 *      "config": {
 *          "plugins": {
 *              "sns": {
 *                  "topicArn": "[INSERT_TOPIC_ARN]",
 *                  "subject": "[INSERT_SUBJECT]"
 *              }
 *          }
 *      }
 *  }
 */
module.exports = api.init;

/* test-code */
module.exports.constants = constants;
module.exports.messages = messages;
module.exports.impl = impl;
module.exports.api = api;
/* end-test-code */
