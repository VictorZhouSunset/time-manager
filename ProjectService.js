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