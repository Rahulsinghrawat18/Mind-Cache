import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config";

interface JwtPayload {
  id: string;
}

export const userMiddleware = (req: Request, res: Response,
next: NextFunction) => {
  const header = req.headers["authorization"];
  const decoded = jwt.verify(header as string, SECRET_KEY);
  if(decoded){
    req.userId = (decoded as JwtPayload).id;
    next()
  }
  else{
    res.status(403).json({
      message:"You are not logged in"
    })
  }
}
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { SECRET_KEY } from "./config";

// export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const header = req.headers["authorization"];
//   if (header) {
//     try {
//       const decoded = jwt.verify(header as string, SECRET_KEY) as { id: string };
//       req.userId = decoded.id;  // Use 'userId' to match the type definition
//       next();
//     } catch (error) {
//       res.status(403).json({
//         message: "You are not logged in"
//       });
//     }
//   } else {
//     res.status(403).json({
//       message: "Authorization header is missing"
//     });
//   }
// };
