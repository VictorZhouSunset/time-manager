// ------------------------------------------------------------------------------------------------
// Create functions
// ------------------------------------------------------------------------------------------------


// JSDoc Comments:
/**
 * Adds a new project to the Projects worksheet.
 * @param {object} projectData The project data object.
 * {
 * name: string,               // Required: Project name
 * expectTimeSpent: number,    // Required: Estimated time required (hours)
 * description?: string,      // Optional: Project description
 * parentId?: string,         // Optional: Parent project/task ID
 * status?: string,           // Optional: Initial status (defaults to 'Not yet started')
 * totalTimeSpent?: number    // Optional: Initial total time spent (defaults to 0)
 * }
 * @return {object | null} The created project object (including all fields), or null if failed.
 */
function addProject(projectData) {
    // Input validation
    if (!projectData || typeof projectData.name !== 'string' || projectData.name.trim() === '' || typeof projectData.expectTimeSpent !== 'number' || projectData.expectTimeSpent < 0) {
        Logger.log('Failed to add project: Required projectData fields (name, expectTimeSpent) are missing or invalid.');
        return null;
    }
    if (projectData.hasOwnProperty('parentId') && projectData.parentId !== null && projectData.parentId !== undefined) {
        // parentId is provided, now validate it
        if (typeof projectData.parentId !== 'string' || projectData.parentId.trim() === '') {
            Logger.log('Error: Invalid parentId provided. If provided, it must be a non-empty string.');
            return null;
        }
        
        // Check if the parentId exists in the database (could be either a project or a task)
        const parentProject = getProjectById(projectData.parentId);
        const parentTask = getTaskById(projectData.parentId);
        
        if (!parentProject && !parentTask) {
            Logger.log(`Error: Parent with ID '${projectData.parentId}' does not exist in either projects or tasks.`);
            return null;
        }
    }
  
    try {
        // Get the active spreadsheet and the 'Projects' worksheet
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
    
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }
  
        // Generate unique ID and creation timestamp
        const projectId = 'P-' + Utilities.getUuid();
        const createdAt = new Date();
    
        // Get project description, user-provided status and totalTimeSpent, or use default values
        let projectDescription = '';
        if (projectData.hasOwnProperty('description')) {
            if (typeof projectData.description === 'string') {
                projectDescription = projectData.description;
            } else {
                Logger.log('Warning: Invalid description provided. It should be a string. Using empty string as default.');
            }
        }

        let initialStatus = 'Not yet started';
        if (projectData.hasOwnProperty('status')) {
            if (VALID_PROJECT_STATUSES.has(projectData.status)) {
                initialStatus = projectData.status;
            } else {
                Logger.log(`Warning: Invalid status provided ('${projectData.status}'). Using default 'Not yet started'.`);
            }
        }

        let initialTotalTimeSpent = 0;
        if (projectData.hasOwnProperty('totalTimeSpent')) {
            if (typeof projectData.totalTimeSpent === 'number' && projectData.totalTimeSpent >= 0) {
                initialTotalTimeSpent = projectData.totalTimeSpent;
            } else {
                Logger.log('Warning: Invalid totalTimeSpent provided. It should be a nonnegative number. Using 0 as default.');
            }
        }

        // Prepare the new row data, ensuring the order matches the header row
        // Header: projectId, parentId, name, description, status, expectTimeSpent, totalTimeSpent, createdAt
        const newRow = [
            projectId,
            projectData.parentId || null, // Use null if parentId is not provided
            projectData.name,
            projectDescription,
            initialStatus,
            projectData.expectTimeSpent,
            initialTotalTimeSpent,
            createdAt
        ];
  
        // Append the new row to the end of the worksheet
        sheet.appendRow(newRow);
    
        // Log success message with details
        Logger.log(`Project added at ${createdAt}: ID = ${projectId}, Name = ${projectData.name}, Status = ${initialStatus}, Time Spent = ${initialTotalTimeSpent}`);
    
        // Return the complete information of the created project
        return {
            projectId: projectId,
            parentId: projectData.parentId || null,
            name: projectData.name,
            description: projectDescription,
            status: initialStatus,
            expectTimeSpent: projectData.expectTimeSpent,
            totalTimeSpent: initialTotalTimeSpent,
            createdAt: createdAt
        };
    
    } catch (error) {
    Logger.log(`Failed to add project: ${error}`);
    // If any error occurs, return null
    // May also consider re-throwing the error or returning an error indicator later
    return null;
    }
}

// ------------------------------------------------------------------------------------------------
// Read-only functions
// ------------------------------------------------------------------------------------------------


/**
 * Gets all projects from the Projects worksheet
 * @return {Array<object>} Array of project objects, or empty array if none found
 */
function getAllProjects() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        // Remove header row and convert remaining rows to project objects
        return data.slice(1).map(row => rowToProject(row));
        
    } catch (error) {
        Logger.log(`Failed to get all projects: ${error}`);
        return [];
    }
}


/**
 * Gets a project by its ID
 * @param {string} projectId The project ID to find
 * @return {object | null} The project object if found, null otherwise
 */
function getProjectById(projectId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const projectRow = data.slice(1).find(row => row[0] === projectId);
        
        return projectRow ? rowToProject(projectRow) : null;
        
    } catch (error) {
        Logger.log(`Failed to get project by ID: ${error}`);
        return null;
    }
}


/**
 * Gets all projects that are direct children of a specific parent ID
 * @param {string} parentId The parent project ID
 * @return {Array<object>} Array of project objects with the specified parent ID
 */
function getProjectsByParentId(parentId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1)
            .filter(row => row[1] === parentId)
            .map(row => rowToProject(row));
        
    } catch (error) {
        Logger.log(`Failed to get projects by parent ID: ${error}`);
        return [];
    }
}


/**
 * Gets all projects with a specific status
 * @param {string} status The status to filter by
 * @return {Array<object>} Array of project objects with the specified status
 */
function getProjectsByStatus(status) {
    if (!VALID_PROJECT_STATUSES.has(status)) {
        Logger.log(`Error: Invalid status provided: ${status}`);
        return [];
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1)
            .filter(row => row[4] === status)
            .map(row => rowToProject(row));
        
    } catch (error) {
        Logger.log(`Failed to get projects by status: ${error}`);
        return [];
    }
}



// ------------------------------------------------------------------------------------------------
// Update functions
// ------------------------------------------------------------------------------------------------

/**
 * Updates an existing project in the Projects worksheet.
 * @param {string} projectId The ID of the project to update
 * @param {object} updateData The data to update. Can include:
 * {
 *   name?: string,           // Optional: New project name
 *   description?: string,    // Optional: New project description
 *   status?: string,         // Optional: New project status
 *   expectTimeSpent?: number,// Optional: New expected time spent
 *   totalTimeSpent?: number, // Optional: New total time spent
 *   parentId?: string        // Optional: New parent project/task ID
 * }
 * @return {object | null} The updated project object, or null if failed
 */
function updateProject(projectId, updateData) {
    // Input validation
    if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
        Logger.log('Error: Invalid projectId provided. It must be a non-empty string.');
        return null;
    }

    if (!updateData || typeof updateData !== 'object') {
        Logger.log('Error: Invalid updateData provided. It must be an object.');
        return null;
    }

    // Validate name if provided
    if (updateData.hasOwnProperty('name') && (typeof updateData.name !== 'string' || updateData.name.trim() === '')) {
        Logger.log('Error: Invalid name provided. It must be a non-empty string.');
        return null;
    }

    // Validate status if provided
    if (updateData.hasOwnProperty('status') && !VALID_PROJECT_STATUSES.has(updateData.status)) {
        Logger.log(`Error: Invalid status provided. Must be one of: ${Array.from(VALID_PROJECT_STATUSES).join(', ')}`);
        return null;
    }

    // Validate expectTimeSpent if provided
    if (updateData.hasOwnProperty('expectTimeSpent') && 
        (typeof updateData.expectTimeSpent !== 'number' || updateData.expectTimeSpent < 0)) {
        Logger.log('Error: Invalid expectTimeSpent provided. It must be a non-negative number.');
        return null;
    }

    // Validate totalTimeSpent if provided
    if (updateData.hasOwnProperty('totalTimeSpent') && 
        (typeof updateData.totalTimeSpent !== 'number' || updateData.totalTimeSpent < 0)) {
        Logger.log('Error: Invalid totalTimeSpent provided. It must be a non-negative number.');
        return null;
    }

    // Validate parentId if provided
    if (updateData.hasOwnProperty('parentId') && updateData.parentId !== null && updateData.parentId !== undefined) {
        if (typeof updateData.parentId !== 'string' || updateData.parentId.trim() === '') {
            Logger.log('Error: Invalid parentId provided. If provided, it must be a non-empty string.');
            return null;
        }

        // Prevent setting a project as its own parent
        if (updateData.parentId === projectId) {
            Logger.log('Error: A project cannot be its own parent.');
            return null;
        }

        // Check if the parentId exists in the database
        const parentProject = getProjectById(updateData.parentId);
        const parentTask = getTaskById(updateData.parentId);
        
        if (!parentProject && !parentTask) {
            Logger.log(`Error: Parent with ID '${updateData.parentId}' does not exist in either projects or tasks.`);
            return null;
        }

        // Check for circular references
        const parent = parentProject || parentTask;
        if (parent) {
            let currentParent = parent;
            while (currentParent.parentId) {
                if (currentParent.parentId === projectId) {
                    Logger.log('Error: Circular reference detected. Cannot set this parent as it would create a cycle.');
                    return null;
                }
                // Get next parent - could be either a project or task
                currentParent = getProjectById(currentParent.parentId) || getTaskById(currentParent.parentId);
                if (!currentParent) break;
            }
        }
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(PROJECTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${PROJECTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const projectRowIndex = data.slice(1).findIndex(row => row[0] === projectId);
        
        if (projectRowIndex === -1) {
            Logger.log(`Error: Project with ID '${projectId}' not found.`);
            return null;
        }

        // Get the current project data
        const currentProject = rowToProject(data[projectRowIndex + 1]);

        // Update only the provided fields
        const updatedProject = {
            ...currentProject,
            name: updateData.hasOwnProperty('name') ? updateData.name : currentProject.name,
            description: updateData.hasOwnProperty('description') ? updateData.description : currentProject.description,
            status: updateData.hasOwnProperty('status') ? updateData.status : currentProject.status,
            expectTimeSpent: updateData.hasOwnProperty('expectTimeSpent') ? updateData.expectTimeSpent : currentProject.expectTimeSpent,
            totalTimeSpent: updateData.hasOwnProperty('totalTimeSpent') ? updateData.totalTimeSpent : currentProject.totalTimeSpent,
            parentId: updateData.hasOwnProperty('parentId') ? updateData.parentId : currentProject.parentId
        };

        // Prepare the updated row data
        const updatedRow = [
            updatedProject.projectId,
            updatedProject.parentId,
            updatedProject.name,
            updatedProject.description,
            updatedProject.status,
            updatedProject.expectTimeSpent,
            updatedProject.totalTimeSpent,
            updatedProject.createdAt
        ];

        // Update the row in the sheet
        sheet.getRange(projectRowIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);

        Logger.log(`Project updated: ID = ${projectId}`);
        return updatedProject;

    } catch (error) {
        Logger.log(`Failed to update project: ${error}`);
        return null;
    }
}

// ------------------------------------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------------------------------------



/**
 * Converts a row of data into a project object
 * @param {Array} row The row data array
 * @return {object} The project object
 */
function rowToProject(row) {
    return {
        projectId: row[0],
        parentId: row[1],
        name: row[2],
        description: row[3],
        status: row[4],
        expectTimeSpent: row[5],
        totalTimeSpent: row[6],
        createdAt: new Date(row[7])
    };
}