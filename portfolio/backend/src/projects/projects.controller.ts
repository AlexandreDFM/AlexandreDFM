/*
File Name: project.controller.ts
Author: Alexandre Kévin De Freitas Martins
Creation Date: 2023
Description: This file is the controller of the project.
Copyright (c) 2023 Tux Inc.

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
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { Project } from "./entities/project.entity";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async getAllProjects(): Promise<Project[]> {
        return await this.projectsService.getAllProjects();
    }

    @Get(":id")
    async findOne(@Param("id") id: number): Promise<Project> {
        return await this.projectsService.findOne(id);
    }

    @Post()
    async createProject(@Body() project: Project): Promise<void> {
        console.log(project);
        await this.projectsService.createProject(project);
    }

    @Delete("/:id")
    async deleteOneprojectById(@Param("id") id: string): Promise<void> {
        await this.projectsService.deleteOneProjectById(id);
    }

    @Delete("")
    async deleteAllprojects(): Promise<void> {
        await this.projectsService.deleteAllProjects();
    }

    @Put(":id")
    async editOneprojectById(
        @Param("id") id: number,
        @Body() project: Project,
    ): Promise<Project> {
        return await this.projectsService.editOneProjectById(id, project);
    }
}
