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
    Delete,
    BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/sign-up")
    async createAuth(@Body() account: Auth) {
        if (!account.name || !account.email || !account.password) {
            throw new BadRequestException("Missing fields");
        } else if (account.password.length < 8) {
            throw new BadRequestException("Password too short");
        } else if (await this.authService.findOneByEmail(account.email)) {
            throw new BadRequestException("Email already used");
        }
        return await this.authService.create(account);
    }

    @Get()
    findAll() {
        return this.authService.getAllAccounts();
    }

    @Post("/sign-in")
    findOne(@Body("email") email: string, @Body("password") password: string) {
        console.log(email, password);
        if (!email || !password) {
            throw new BadRequestException("Missing fields");
        } else if (password.length < 8) {
            throw new BadRequestException("Email or password invalid");
        } else if (!this.authService.findOneByEmail(email)) {
            throw new BadRequestException("Email or password invalid");
        }
        return this.authService.findOne(email, password);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() account: Auth) {
        account.updated_at = new Date();
        return this.authService.update(+id, account);
    }

    @Delete("/sign-rm/:id")
    remove(@Param("id") id: string) {
        return this.authService.deleteOneAuthById(id);
    }
}
