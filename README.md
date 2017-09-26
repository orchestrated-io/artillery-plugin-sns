# artillery-plugin-sns
A plugin for artillery.io that published response data to an SNS topic.

Based on [artillery-plugin-cloudwatch](https://github.com/Nordstrom/artillery-plugin-cloudwatch)

To use:

1. `npm install -g artillery`
2. `npm install artillery-plugin-sns` (add `-g` if you like)
3. Add `cloudwatch` plugin config to your "`hello.json`" Artillery script

    ```json
    {
      "config": {
        "plugins": {
          "sns": {
              "topicArn": "[INSERT_TOPIC_ARN]",
              "subject": "[INSERT_SUBJECT]"
          }
        }
      }
    }
    ```

4. `artillery run hello.json`

This will cause every latency to be published to the given SNS topic

This plugin assumes that the `aws-sdk` has been pre-configured, before it is loaded, with credentials and any other
setting that may be required to successfully `Publish` to the SNS topic.  This activity
requires at least the rights given by the following IAM statement to the CloudWatch API in order to report latencies:

```json
{
    "Effect": "Allow",
    "Action": [
        "SNS:Publish"
    ],
    "Resource": ["arn:aws:sns:`region`:`account-id`:`topic`"]
}
```

For more information, see:

* https://github.com/shoreditch-ops/artillery
* http://docs.aws.amazon.com/sns/latest/dg/welcome.html

Enjoy!
