const errorHandler = (err, req , res , next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message ||  "Internal server Error"

    res.status(statusCode).json({
        success : false,
        message : message ,
        errors : err.errors || []
    });
};

export default errorHandler
