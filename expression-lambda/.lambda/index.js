'use strict';
const aws = require('aws-sdk');
const s3Bucket = 'markf-uploads';

/**
 * Handle API calls.  The "action" 
 */
exports.handler = (event, context, callback) => {
    try {
        console.log(JSON.stringify(event, null, 4));
        if ((typeof event.queryStringParameters != `undefined`) && (event.queryStringParameters != null) && 
          (typeof event.queryStringParameters.action != `undefined`) && (event.queryStringParameters.action != null)) {
            switch (event.queryStringParameters.action) {
                case 'analyzeImage':
                    if ((typeof event.queryStringParameters.uuid != `undefined`) && (event.queryStringParameters.uuid != null)) {
                        analyzeImage(event.queryStringParameters.uuid, callback);
                    }
                    break;
            }
        }
    } catch (err) {
        callback(err);
    }
};

function analyzeImage(uuid, callback) {
    aws.region = "us-east-1";
    var rekognition = new aws.Rekognition();
    var params = {
        Image: {
            "S3Object": {
                "Bucket": s3Bucket,
                "Name": `expression-ai/${uuid}.jpg`
            }
        },
        "Attributes": [
            "ALL"
        ]
    };
    console.log(params);
    rekognition.detectFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            const response = {
                "isBase64Encoded": false,
                "statusCode": 200,
                "headers": {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": JSON.stringify(data)
            };
            callback(null, response);
        }
    });
}
