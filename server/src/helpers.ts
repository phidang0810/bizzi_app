import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import request from 'request';
import { User } from './entities/User';

export const formatResponse = ({code = 200, ...rest} : 
    {   code?: number,
        rest?: any
    }) => {

    let response = {
        code,
        success: code >= 400 ? false : true,
        ...rest
    }

    return response;
}

export const createAccessToken = (user: User) : string => {
    console.log({userId: user.id, email: user.email, name:user.name});
    const token = sign({userId: user.id, email: user.email, name:user.name}, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "7d"
    });

    return `Bearer ${token}`;
}

export const createRefreshToken = (user: User) : string => {
    return sign(
      { userId: user.id}, process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "15d"
      }
    );
  };
export const sendRefreshToken = (res: Response, token: string) => {
res.cookie("jid", token, {
    httpOnly: true
});
};  

export const callRequest = (url: string) => {
    return new Promise(function(resolve, reject) {
       request(url, function(error, res, body) {
          if (!error && res.statusCode == 200) {
             resolve(body);
          } else {
             reject(error);
          }
       });
    });
 }

export const convertToSlug = (text: string) =>  {
    return text.toLowerCase()
               .replace(/ /g, '-')
               .replace(/[^\w-]+/g, '');
}