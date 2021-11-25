import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { createAccessToken } from "../helpers";
import { User } from "../entities/User";
import { createRefreshToken, sendRefreshToken } from "../helpers";

exports.refreshToken = async function(req: Request, res: Response) {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
};