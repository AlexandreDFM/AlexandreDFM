/**
 * File Name: page.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 2024
 * Description: page.tsx
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

import {
    Card,
    CardBody,
    CardHeader,
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import getConfig from "next/config";
import { useRouter } from "next/navigation";
import cookieCutter from "@boiseitguru/cookie-cutter";
import { FormEvent, useEffect, useState } from "react";

const { publicRuntimeConfig } = getConfig();

export default function AdminPage() {
    const [projects, setProjects] = useState([]);
    const [token, setToken] = useState("");
    useEffect(() => {
        const token = cookieCutter.get("token");
        setToken(token || "");
    }, []);

    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData: FormData = new FormData(event.currentTarget);
        const json: string = JSON.stringify(Object.fromEntries(formData));
        const response: Response = await fetch(
            `${publicRuntimeConfig.apiURL}/projects/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: json,
            },
        );
        if (response.ok) {
            console.log("Success");
            onOpenChange();
        } else {
            console.log("Error");
        }
    }

    async function deleteProject(id: number) {
        const response: Response = await fetch(
            `${publicRuntimeConfig.apiURL}/projects/${id}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (response.ok) {
            console.log("Success");
        } else {
            console.log("Error");
        }
    }
    function logout() {
        router.push("/admin/login");
    }
    useEffect(() => {
        async function fetchProjects() {
            const response = await fetch(
                `${publicRuntimeConfig.apiURL}/projects/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const projects = await response.json();
            setProjects(projects);
        }
        fetchProjects();
    }, [deleteProject, onSubmit, token]);
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <div className="absolute top-0 p-4 text-sm text-white flex flex-row justify-between items-center w-full">
                <div>
                    Hello, <span className="font-bold">AlexandreDFM</span>
                </div>
                <div className="flex flex-row gap-2">
                    <Button color="primary" size="md" onPress={onOpen}>
                        Add a project
                    </Button>
                    <Button color="danger" size="md" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
            {"Voici tout vos projets :"}
            <div className="text-sm text-white flex flex-col gap-2 mt-2">
                {projects.map((project: any) => (
                    <Card
                        key={project.id}
                        className="bg-black rounded-2xl p-4 flex flex-col gap-2 items-center justify-start"
                    >
                        <CardHeader
                            className={"text-white flex flex-col gap-2 w-full"}
                        >
                            <div
                                className={
                                    "flex flex-row w-full justify-between items-center"
                                }
                            >
                                <span className={"text-2xl font-bold"}>
                                    {project.title}
                                </span>
                                <Button
                                    color={"danger"}
                                    size={"sm"}
                                    onClick={() => deleteProject(project.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                            <span className={"text-lg italic"}>
                                {project.description}
                            </span>
                        </CardHeader>
                        <CardBody className={"w-full"}>
                            <p className={"truncate line-clamp-1 text-white"}>
                                {project.body}
                            </p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className={"bg-black"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white w-full">
                                New project
                            </ModalHeader>
                            <ModalBody className={"text-white"}>
                                <form
                                    className="flex flex-col items-end justify-end gap-2"
                                    onSubmit={onSubmit}
                                >
                                    <input
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        type={"text"}
                                        name={"title"}
                                        placeholder="Title"
                                    />
                                    <input
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        type={"text"}
                                        name={"description"}
                                        placeholder="Description"
                                    />
                                    <input
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        type={"text"}
                                        name={"link"}
                                        placeholder="Link"
                                    />
                                    <input
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        type={"text"}
                                        name={"github"}
                                        placeholder="Github"
                                    />
                                    <textarea
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        name={"body"}
                                        placeholder="Body"
                                    />
                                    <input
                                        className="p-2 rounded-lg bg-zinc-600/20 text-white w-full"
                                        type={"date"}
                                        name={"date"}
                                        placeholder="Date"
                                    />
                                    <Button
                                        color={"primary"}
                                        type={"submit"}
                                        size={"md"}
                                    >
                                        Create
                                    </Button>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
