/*
File Name: auth.controller.ts
Author: Alexandre Kévin De Freitas Martins
Creation Date: 2024
Description: This file is the controller of the auth.

Copyright (c) 2024 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService,
    ) {}

    @Post("/sign-up")
    async createAuth(@Body() account: Auth): Promise<void> {
        return await this.authService.create(account);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<Auth[]> {
        return this.authService.getAll();
    }

    @Post("/sign-in")
    async signIn(
        @Body("email") email: string,
        @Body("password") password: string,
    ): Promise<{ access_token: string }> {
        const user: Auth =
            await this.authService.findOneByEmailWithPassword(email);
        if (user?.password !== password) throw new UnauthorizedException();
        const payload: { sub: number; username: string } = {
            sub: user.id,
            username: user.email,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() account: Auth) {
        account.updated_at = new Date();
        return this.authService.update(+id, account);
    }
}
