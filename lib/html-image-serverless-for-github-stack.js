const { Stack, Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda-nodejs');
const {Runtime, Code, LayerVersion } = require('aws-cdk-lib/aws-lambda');
const s3 = require('aws-cdk-lib/aws-s3');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { Construct } = require('constructs');

class HtmlImageServerlessForGithubStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // S3 bucket for storing images
    const bucket = new s3.Bucket(this, 'MyGardenStudyHoursImageS3Bucket');

    // Lambda Layer for Chromium
    const chromeAwsLambdaLayer = new LayerVersion(this, 'ChromeAWSLambdaLayer', {
      layerVersionName: 'ChromeAWSLambdaLayer',
      compatibleRuntimes: [Runtime.NODEJS_18_X],
      code: Code.fromAsset('chromium-v110.0.0-layer.zip')
    });

    // Lambda function for generating image from HTML
    const htmlToImageLambda = new lambda.NodejsFunction(this, 'HtmlToImageLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: 'lambdas/html-image-lambda/index.js', // Entry point to your Lambda function
      layers: [chromeAwsLambdaLayer],
      environment: {
        S3_IMAGE_BUCKET: bucket.bucketName
      },
      bundling: {
        externalModules: ['aws-sdk'],
        nodeModules: ['@sparticuz/chromium'],
      },
      timeout: Duration.seconds(30),
      memorySize: 1024
    });

    // Grant the Lambda function write permissions to the bucket
    bucket.grantWrite(htmlToImageLambda);

    // API Gateway to trigger the Lambda function
    const htmlToImageApi = new apigateway.RestApi(this, 'htmlToImageApi', {
      restApiName: 'HTML To Image Service',
      description: 'Converts HTML to Image'
    });

    // Integrate the Lambda function with the API Gateway
    const integration = new apigateway.LambdaIntegration(htmlToImageLambda);
    htmlToImageApi.root.addMethod('GET', integration);

    //================================================================================================

    // Lambda 함수 정의
    const healthcheckLambda = new lambda.NodejsFunction(this, 'HealthcheckLambda', {
      runtime: Runtime.NODEJS_18_X, // 런타임 지정
      handler: 'index.handler', // 파일명과 함수명 지정
      entry: 'lambdas/healthcheck-lambda/index.js', // Entry point for the health check function
    });

    // API Gateway 정의
    const healthCheckApi = new apigateway.RestApi(this, 'HealthCheckApi', {
      restApiName: 'Health Check API',
    });

    // Lambda와 API Gateway 통합
    const healthCheckIntegration = new apigateway.LambdaIntegration(healthcheckLambda);
    healthCheckApi.root.addMethod('GET', healthCheckIntegration); // 루트 경로에 GET 메소드 추가
  }
}

module.exports = { HtmlImageServerlessForGithubStack }
