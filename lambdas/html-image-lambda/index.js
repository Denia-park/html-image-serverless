// index.js
const {S3Client} = require('@aws-sdk/client-s3');
const { generateImage } = require('./generateImage');
const {Upload} = require("@aws-sdk/lib-storage");

const s3Client = new S3Client([{ region: 'ap-northeast-2' }]);
const BUCKET_NAME = process.env.S3_IMAGE_BUCKET;

exports.handler = async (event) => {
    try {
        // 쿼리 파라미터에서 확인할 memberEmail을 받아온다. (해당 memberEmail은 UrlSafeBase64로 인코딩되어 있으므로 원래 값을 보려면 디코딩이 필요합니다.)
        const urlSafeBase64MemberEmail = event.queryStringParameters.memberEmail;
        const objectKey = `${urlSafeBase64MemberEmail}.png`; // Key for the S3 object

        // Generate the image from the URL
        const targetUrl = `https://sample.example.com/study-hours-calander-heatmap/${urlSafeBase64MemberEmail}`;
        const imageBuffer = await generateImage(targetUrl);

        if(!imageBuffer) {
            throw new Error('Failed to created Image buffer from HTML')
        }

        // Upload the image to S3
        const s3Upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: objectKey,
                Body: imageBuffer,
                ContentType: 'image/png',
            }
        });

        // Upload progress
        s3Upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });
        await s3Upload.done();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image uploaded successfully" })
        };
    } catch (error) {
        console.log("Error converting HTML to image");
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        };
    }
};
