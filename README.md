# HTML to Image Serverless 프로젝트 (With AWS)
## 프로젝트 설명
- 해당 프로젝트는 `HTML`을 `이미지`로 변환해주는 서버리스 프로젝트입니다.
  - 제 [MyGarden 프로젝트](https://github.com/Denia-park/myGarden)에서 사용하기 위해 제작되었습니다.
  - 해당 [블로그 글](https://velog.io/@as9587/%EA%B3%B5%EB%B6%80-%EC%8B%9C%EA%B0%84-%EC%9E%94%EB%94%94%EB%A5%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A1%9C-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0-With-AWS-CDK-API-Gateway-Lambda-S3-aka.-Html-to-Image)을 보시면, 자세하게 설명이 되어 있습니다.
- 해당 프로젝트는 `Node.js + JavaScript`를 사용하였습니다.
- 해당 프로젝트는 `AWS`를 이용하였고 자세한 스택은 다음과 같습니다.
  - `AWS CDK`를 사용하여 배포되었습니다.
  - `AWS API Gateway`를 사용하여 `REST API`를 구축하였고, `AWS Lambda`를 통해 `HTML`을 `이미지`로 변환하고 `AWS S3`에 저장합니다.
- `Lambda`에서 `Headless Browser`를 사용하기 위해 `puppeteer-core`를 사용하였습니다.

## 사용 Command

* `cdk deploy` : 기본으로 설정된 `AWS 계정/리전`에 해당 스택을 배포합니다.

