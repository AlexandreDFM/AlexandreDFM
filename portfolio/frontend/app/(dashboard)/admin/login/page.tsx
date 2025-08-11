/**
 * File Name: login.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: login.tsx
 * Copyright (c) 2024 Tux Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
"use client";

import { FormEvent } from "react";
import getConfig from "next/config";
import { useRouter } from "next/navigation";
import cookieCutter from "@boiseitguru/cookie-cutter";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";

const { publicRuntimeConfig } = getConfig();

export default function AdminLoginPage() {
    const router = useRouter();
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData: FormData = new FormData(event.currentTarget);
        const json: string = JSON.stringify(Object.fromEntries(formData));
        const response: Response = await fetch(
            `${publicRuntimeConfig.apiURL}/auth/sign-in/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json,
            },
        );
        if (response.ok) {
            const tokenObject = await response.json();
            cookieCutter.set("token", tokenObject.access_token);
            router.push("/admin");
        } else {
            console.log("Error");
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <div className="h-full w-full flex items-center justify-center">
                <Card className="py-4 bg-zinc-600/20 rounded-2xl">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        <span className="text-tiny uppercase font-bold text-white">
                            Login
                        </span>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <form
                            className="flex flex-col items-center justify-center"
                            onSubmit={onSubmit}
                        >
                            <input
                                className="p-2 m-2 rounded-lg bg-zinc-600/20 text-white"
                                type={"email"}
                                name={"email"}
                                placeholder="admin@example.com"
                            />
                            <input
                                className="p-2 m-2 rounded-lg bg-zinc-600/20 text-white"
                                type={"password"}
                                name={"password"}
                                placeholder="********"
                            />
                            <Button
                                color={"primary"}
                                type={"submit"}
                                size={"md"}
                            >
                                Login
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
