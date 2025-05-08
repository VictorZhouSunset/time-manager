/**
 * Gets all direct child items (both projects and tasks) of a specific parent ID
 * @param {string} parentId The parent project/task ID
 * @return {object} Object containing arrays of child projects and tasks
 */
function getChildrenByParentId(parentId) {
    try {
        const childProjects = getProjectsByParentId(parentId);
        const childTasks = getTasksByParentId(parentId);

        return {
            projects: childProjects,
            tasks: childTasks,
            // Helper methods for the returned object
            getAllChildren() {
                return [...this.projects, ...this.tasks].sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            },
            // Get total count of direct children
            getChildCount() {
                return this.projects.length + this.tasks.length;
            }
        };
    } catch (error) {
        Logger.log(`Failed to get children by parent ID: ${error}`);
        return {
            projects: [],
            tasks: [],
            getAllChildren() { return []; },
            getChildCount() { return 0; }
        };
    }
}

/**
 * Gets all descendants (recursive children) of a specific parent ID
 * Warning: There is no detection for circular dependencies now
 * Warning: This function can be resource-intensive for deep hierarchies
 * @param {string} parentId The parent project/task ID
 * @return {object} Object containing arrays of all descendant projects and tasks
 */
function getAllDescendantsByParentId(parentId) {
    try {
        const result = {
            projects: [],
            tasks: []
        };

        // Get direct children first
        const directChildren = getChildrenByParentId(parentId);
        result.projects.push(...directChildren.projects);
        result.tasks.push(...directChildren.tasks);

        // Recursively get children of projects
        for (const project of directChildren.projects) {
            const descendants = getAllDescendantsByParentId(project.projectId);
            result.projects.push(...descendants.projects);
            result.tasks.push(...descendants.tasks);
        }

        // Recursively get children of tasks
        for (const task of directChildren.tasks) {
            const descendants = getAllDescendantsByParentId(task.taskId);
            result.projects.push(...descendants.projects);
            result.tasks.push(...descendants.tasks);
        }

        return {
            ...result,
            // Helper methods
            getAllDescendants() {
                return [...this.projects, ...this.tasks].sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            },
            getDescendantCount() {
                return this.projects.length + this.tasks.length;
            }
        };

    } catch (error) {
        Logger.log(`Failed to get all descendants by parent ID: ${error}`);
        return {
            projects: [],
            tasks: [],
            getAllDescendants() { return []; },
            getDescendantCount() { return 0; }
        };
    }
}