import { Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  const formattedError = {
    message: err.message || "An error occurred",
    code: (err as any).statusCode || 500,
  };

  res.status(formattedError.code).json({
    success: false,
    data: null,
    error: formattedError,
  });
};
