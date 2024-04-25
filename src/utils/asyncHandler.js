// every time when we req data from db there is always async used to ease this process we use utility function to avoid all the bulky code

// it takes function as parameter hence higher order function


// promise method

const asyncHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((error)=>(next(error)));
}





// try catch method

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message,
//         })
//     }
// }
export {asyncHandler} ;