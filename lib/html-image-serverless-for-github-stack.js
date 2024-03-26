const { Stack, Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
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

    // Lambda 함수 정의
    const healthcheckLambda = new lambda.Function(this, 'HealthcheckLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // 런타임 지정
      handler: 'index.handler', // 파일명과 함수명 지정
      code: lambda.Code.fromAsset('lambdas/healthcheck-lambda'), // Lambda 코드가 포함된 디렉토리
    });

    // API Gateway 정의
    const api = new apigateway.RestApi(this, 'HtmlToImageRestApi', {
      restApiName: 'HTML IMAGE API',
    });

    // Lambda와 API Gateway 통합
    const healthCheckIntegration = new apigateway.LambdaIntegration(healthcheckLambda);
    api.root.addMethod('GET', healthCheckIntegration); // 루트 경로에 GET 메소드 추가
  }
}

module.exports = { HtmlImageServerlessForGithubStack }
