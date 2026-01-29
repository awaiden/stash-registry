// @ts-nocheck

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import axios, { toFormData } from "axios";
import { Request } from "express";

@Injectable()
export class TurnstileGuard implements CanActivate {
  logger = new Logger(TurnstileGuard.name);
  private readonly secretKey = process.env.TURNSTILE_SECRET_KEY!;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.body["cf-turnstile-response"];

    if (!token) {
      throw new BadRequestException("Turnstile token is missing");
    }

    const isValid = await this.verifyToken(token, request.ip);

    if (!isValid) {
      throw new ForbiddenException("Invalid Turnstile token");
    }

    return true;
  }

  async verifyToken(token: string, remoteip?: string): Promise<boolean> {
    try {
      const response = await axios.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        toFormData({
          secret: this.secretKey,
          response: token,
          remoteip: remoteip,
        }),
      );

      return response.data.success === true;
    } catch (error) {
      this.logger.error("Error verifying Turnstile token", error);
      return false;
    }
  }
}
