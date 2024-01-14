/*
File Name: project.service.ts
Author: Alexandre Kévin De Freitas Martins
Creation Date: 2023
Description: This file is the service of the project.
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

import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) {}

    async getAllProjects(): Promise<Project[]> {
        return await this.projectsRepository.find();
    }

    async findOne(id: number): Promise<Project> {
        return await this.projectsRepository.findOneBy({ id });
    }

    async createProject(project: Project, user_id: number): Promise<Project> {
        project.user_id = user_id;
        return await this.projectsRepository.save(project);
    }

    async deleteOneProjectById(id: string): Promise<void> {
        await this.projectsRepository.delete(id);
    }

    async deleteAllProjects(): Promise<void> {
        await this.projectsRepository.clear();
    }

    async editOneProjectById(id: number, project: Project): Promise<Project> {
        const editedProject = await this.projectsRepository.findOneBy({ id });
        if (!editedProject) {
            throw new Error("Project not found");
        }
        editedProject.title = project.title;
        editedProject.description = project.description;
        await this.projectsRepository.save(editedProject);
        return editedProject;
    }
}
