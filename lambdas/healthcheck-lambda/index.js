exports.handler = async (event) => {
    //for health check
    return {
        statusCode: 200,
        body: "Ok"
    };
};
