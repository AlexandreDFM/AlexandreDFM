/*
File Name: auth.service.ts
Author: Alexandre Kévin De Freitas Martins
Creation Date: 2024
Description: This file is the service of the auth.
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

import { Repository, SelectQueryBuilder } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Auth } from "./entities/auth.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth) private authRepository: Repository<Auth>,
    ) {}

    async create(account: Auth): Promise<void> {
        if (!account.name || !account.email || !account.password) {
            throw new BadRequestException("Missing fields");
        } else if (account.password.length < 8) {
            throw new BadRequestException("Password too short");
        } else if (await this.findOneByEmail(account.email)) {
            throw new BadRequestException("Email already in use");
        }
        await this.authRepository.save(account);
    }

    async getAll(): Promise<Auth[]> {
        return await this.authRepository.find();
    }

    async findOneByEmailWithPassword(email: string): Promise<Auth> {
        const queryBuilder: SelectQueryBuilder<Auth> =
            this.authRepository.createQueryBuilder("auth");
        queryBuilder.select("auth.password");
        queryBuilder.where("auth.email = :email", { email });
        return await queryBuilder.getOne();
    }

    async findOneByEmail(email: string): Promise<Auth> {
        return await this.authRepository.findOneBy({ email });
    }

    async update(id: number, account: Auth): Promise<void> {
        await this.authRepository.update(id, account);
    }

    async deleteOneAuthById(id: string): Promise<void> {
        await this.authRepository.delete(id);
    }
}
