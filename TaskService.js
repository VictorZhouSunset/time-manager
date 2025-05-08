// ------------------------------------------------------------------------------------------------
// Create functions
// ------------------------------------------------------------------------------------------------


// JSDoc Comments:
/**
 * Adds a new task to the Tasks worksheet.
 * @param {object} taskData The task data object.
 * {
 * name: string,               // Required: Task name
 * expectTimeSpent: number,    // Required: Estimated time required (hours)
 * description?: string,      // Optional: Task description
 * parentId?: string,         // Optional: Parent project/task ID
 * status?: string,           // Optional: Initial status (defaults to 'Not yet started')
 * totalTimeSpent?: number    // Optional: Initial total time spent (defaults to 0)
 * }
 * @return {object | null} The created task object (including all fields), or null if failed.
 */
function addTask(taskData) {
    // Input validation
    if (!taskData || typeof taskData.name !== 'string' || taskData.name.trim() === '' || typeof taskData.expectTimeSpent !== 'number' || taskData.expectTimeSpent < 0) {
        Logger.log('Failed to add task: Required taskData fields (name, expectTimeSpent) are missing or invalid.');
        return null;
    }
    if (taskData.hasOwnProperty('parentId') && taskData.parentId !== null && taskData.parentId !== undefined) {
        // parentId is provided, now validate it
        if (typeof taskData.parentId !== 'string' || taskData.parentId.trim() === '') {
            Logger.log('Error: Invalid parentId provided. If provided, it must be a non-empty string.');
            return null;
        }
    }
  
    try {
        // Get the active spreadsheet and the 'Tasks' worksheet
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
    
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }
  
        // Generate unique ID and creation timestamp
        const taskId = 'T-' + Utilities.getUuid();
        const createdAt = new Date();
    
        // Get task description, user-provided status and totalTimeSpent, or use default values
        let taskDescription = '';
        if (taskData.hasOwnProperty('description')) {
            if (typeof taskData.description === 'string') {
                taskDescription = taskData.description;
            } else {
                Logger.log('Warning: Invalid description provided. It should be a string. Using empty string as default.');
            }
        }

        let initialStatus = 'Not yet started';
        if (taskData.hasOwnProperty('status')) {
            if (VALID_TASK_STATUSES.has(taskData.status)) {
                initialStatus = taskData.status;
            } else {
                Logger.log(`Warning: Invalid status provided ('${taskData.status}'). Using default 'Not yet started'.`);
            }
        }

        let initialTotalTimeSpent = 0;
        if (taskData.hasOwnProperty('totalTimeSpent')) {
            if (typeof taskData.totalTimeSpent === 'number' && taskData.totalTimeSpent >= 0) {
                initialTotalTimeSpent = taskData.totalTimeSpent;
            } else {
                Logger.log('Warning: Invalid totalTimeSpent provided. It should be a nonnegative number. Using 0 as default.');
            }
        }

        // Prepare the new row data, ensuring the order matches the header row
        // Header: taskId, parentId, name, description, status, expectTimeSpent, totalTimeSpent, createdAt
        const newRow = [
            taskId,
            taskData.parentId || null, // Use null if parentId is not provided
            taskData.name,
            taskDescription,
            initialStatus,
            taskData.expectTimeSpent,
            initialTotalTimeSpent,
            createdAt
        ];
  
        // Append the new row to the end of the worksheet
        sheet.appendRow(newRow);
    
        // Log success message with details
        Logger.log(`Task added at ${createdAt}: ID = ${taskId}, Name = ${taskData.name}, Status = ${initialStatus}, Time Spent = ${initialTotalTimeSpent}`);
    
        // Return the complete information of the created task
        return {
            taskId: taskId,
            parentId: taskData.parentId || null,
            name: taskData.name,
            description: taskDescription,
            status: initialStatus,
            expectTimeSpent: taskData.expectTimeSpent,
            totalTimeSpent: initialTotalTimeSpent,
            createdAt: createdAt
        };
    
    } catch (error) {
    Logger.log(`Failed to add task: ${error}`);
    // If any error occurs, return null
    // May also consider re-throwing the error or returning an error indicator later
    return null;
    }
}


// ------------------------------------------------------------------------------------------------
// Read-only functions
// ------------------------------------------------------------------------------------------------



/**
 * Gets all tasks from the Tasks worksheet
 * @return {Array<object>} Array of task objects, or empty array if none found
 */
function getAllTasks() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1).map(row => rowToTask(row));
        
    } catch (error) {
        Logger.log(`Failed to get all tasks: ${error}`);
        return [];
    }
}



/**
 * Gets a task by its ID
 * @param {string} taskId The task ID to find
 * @return {object | null} The task object if found, null otherwise
 */
function getTaskById(taskId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const taskRow = data.slice(1).find(row => row[0] === taskId);
        
        return taskRow ? rowToTask(taskRow) : null;
        
    } catch (error) {
        Logger.log(`Failed to get task by ID: ${error}`);
        return null;
    }
}


/**
 * Gets all tasks that are direct children of a specific parent ID
 * @param {string} parentId The parent project/task ID
 * @return {Array<object>} Array of task objects with the specified parent ID
 */
function getTasksByParentId(parentId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1)
            .filter(row => row[1] === parentId)
            .map(row => rowToTask(row));
        
    } catch (error) {
        Logger.log(`Failed to get tasks by parent ID: ${error}`);
        return [];
    }
}



/**
 * Gets all tasks with a specific status
 * @param {string} status The status to filter by
 * @return {Array<object>} Array of task objects with the specified status
 */
function getTasksByStatus(status) {
    if (!VALID_TASK_STATUSES.has(status)) {
        Logger.log(`Invalid status provided: ${status}`);
        return [];
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1)
            .filter(row => row[4] === status)
            .map(row => rowToTask(row));
        
    } catch (error) {
        Logger.log(`Failed to get tasks by status: ${error}`);
        return [];
    }
}







// ------------------------------------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------------------------------------


/**
 * Converts a row of data into a task object
 * @param {Array} row The row data array
 * @return {object} The task object
 */
function rowToTask(row) {
    return {
        taskId: row[0],
        parentId: row[1],
        name: row[2],
        description: row[3],
        status: row[4],
        expectTimeSpent: row[5],
        totalTimeSpent: row[6],
        createdAt: new Date(row[7])
    };
}