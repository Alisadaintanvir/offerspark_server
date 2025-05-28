import {Request, Response, NextFunction} from "express";

import httpError from "http-errors";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = "Ali Sadain";

    if (!user) {
        return next(httpError(404, "User not found"));
    }

    res.status(200).json({user});
};