import { isValidObjectId } from "mongoose";


function checkId(req, res, next) {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        res.status(404)
        throw new Error(`Invalid Object of: ${id}`);
    }
    next();
}

export default checkId;