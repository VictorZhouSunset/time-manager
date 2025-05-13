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

        // Check if the parentId exists in the database (could be either a project or a task)
        const parentProject = getProjectById(taskData.parentId);
        const parentTask = getTaskById(taskData.parentId);
        
        if (!parentProject && !parentTask) {
            Logger.log(`Error: Parent with ID '${taskData.parentId}' does not exist in either projects or tasks.`);
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
// Update functions
// ------------------------------------------------------------------------------------------------

/**
 * Updates an existing task in the Tasks worksheet.
 * @param {string} taskId The ID of the task to update
 * @param {object} updateData The data to update. Can include:
 * {
 *   name?: string,           // Optional: New task name
 *   description?: string,    // Optional: New task description
 *   status?: string,         // Optional: New task status
 *   expectTimeSpent?: number,// Optional: New expected time spent
 *   totalTimeSpent?: number, // Optional: New total time spent
 *   parentId?: string        // Optional: New parent project/task ID
 * }
 * @return {object | null} The updated task object, or null if failed
 */
function updateTask(taskId, updateData) {
    // Input validation
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        Logger.log('Error: Invalid taskId provided. It must be a non-empty string.');
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
    if (updateData.hasOwnProperty('status') && !VALID_TASK_STATUSES.has(updateData.status)) {
        Logger.log(`Error: Invalid status provided. Must be one of: ${Array.from(VALID_TASK_STATUSES).join(', ')}`);
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
        if (updateData.parentId === taskId) {
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
                if (currentParent.parentId === taskId) {
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
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const taskRowIndex = data.slice(1).findIndex(row => row[0] === taskId);
        
        if (taskRowIndex === -1) {
            Logger.log(`Error: Task with ID '${taskId}' not found.`);
            return null;
        }

        // Get the current task data
        const currentTask = rowToTask(data[taskRowIndex + 1]);

        // Update only the provided fields
        const updatedTask = {
            ...currentTask,
            name: updateData.hasOwnProperty('name') ? updateData.name : currentTask.name,
            description: updateData.hasOwnProperty('description') ? updateData.description : currentTask.description,
            status: updateData.hasOwnProperty('status') ? updateData.status : currentTask.status,
            expectTimeSpent: updateData.hasOwnProperty('expectTimeSpent') ? updateData.expectTimeSpent : currentTask.expectTimeSpent,
            totalTimeSpent: updateData.hasOwnProperty('totalTimeSpent') ? updateData.totalTimeSpent : currentTask.totalTimeSpent,
            parentId: updateData.hasOwnProperty('parentId') ? updateData.parentId : currentTask.parentId
        };

        // Prepare the updated row data
        const updatedRow = [
            updatedTask.taskId,
            updatedTask.parentId,
            updatedTask.name,
            updatedTask.description,
            updatedTask.status,
            updatedTask.expectTimeSpent,
            updatedTask.totalTimeSpent,
            new Date(updatedTask.createdAt)
        ];

        // Update the row in the sheet
        sheet.getRange(taskRowIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);

        Logger.log(`Task updated: ID = ${taskId}`);
        return updatedTask;

    } catch (error) {
        Logger.log(`Failed to update task: ${error}`);
        return null;
    }
}


// ------------------------------------------------------------------------------------------------
// Delete functions
// ------------------------------------------------------------------------------------------------

/**
 * Deletes a task and all its child tasks (cascade deletion).
 * Also deletes all associated calendar events.
 * @param {string} taskId The ID of the task to delete
 * @return {boolean} True if deletion was successful, false otherwise
 */
function deleteTask(taskId) {
    // Input validation
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        Logger.log('Error: Invalid taskId provided. It must be a non-empty string.');
        return false;
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        // Get all tasks and events to find children
        const allTasks = getAllTasks();
        const allEvents = getAllEvents();

        // Find all child tasks
        const childTasks = allTasks.filter(t => t.parentId === taskId);

        // Recursively delete all child tasks
        for (const childTask of childTasks) {
            deleteTask(childTask.taskId);
        }

        // Delete all associated calendar events
        const associatedEvents = allEvents.filter(e => e.parentId === taskId);
        for (const event of associatedEvents) {
            deleteEvent(event.eventId);
        }

        // Find and delete the task itself
        const data = sheet.getDataRange().getValues();
        const taskRowIndex = data.slice(1).findIndex(row => row[0] === taskId);
        
        if (taskRowIndex === -1) {
            Logger.log(`Error: Task with ID '${taskId}' not found.`);
            return false;
        }

        // Delete the row
        sheet.deleteRow(taskRowIndex + 2);

        Logger.log(`Task and all its children deleted: ID = ${taskId}`);
        return true;

    } catch (error) {
        Logger.log(`Failed to delete task: ${error}`);
        return false;
    }
}

/**
 * Removes a task while preserving its child tasks.
 * Updates the parentId of all children to null.
 * Also removes the parentId from associated calendar events.
 * @param {string} taskId The ID of the task to remove
 * @return {boolean} True if removal was successful, false otherwise
 */
function removeTask(taskId) {
    // Input validation
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        Logger.log('Error: Invalid taskId provided. It must be a non-empty string.');
        return false;
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        // Get all tasks and events to find children
        const allTasks = getAllTasks();
        const allEvents = getAllEvents();

        // Find all child tasks
        const childTasks = allTasks.filter(t => t.parentId === taskId);

        // Update parentId to null for all child tasks
        for (const childTask of childTasks) {
            updateTask(childTask.taskId, { parentId: null });
        }

        // Update parentId to null for all associated calendar events
        const associatedEvents = allEvents.filter(e => e.parentId === taskId);
        for (const event of associatedEvents) {
            updateCalendarEvent(event.eventId, { parentId: null });
        }

        // Find and delete the task itself
        const data = sheet.getDataRange().getValues();
        const taskRowIndex = data.slice(1).findIndex(row => row[0] === taskId);
        
        if (taskRowIndex === -1) {
            Logger.log(`Error: Task with ID '${taskId}' not found.`);
            return false;
        }

        // Delete the row
        sheet.deleteRow(taskRowIndex + 2);

        Logger.log(`Task removed (children preserved): ID = ${taskId}`);
        return true;

    } catch (error) {
        Logger.log(`Failed to remove task: ${error}`);
        return false;
    }
}

/**
 * Removes a task and its associated calendar events, while preserving its child tasks.
 * Children and their events remain untouched.
 * @param {string} taskId The ID of the task to remove
 * @return {boolean} True if removal was successful, false otherwise
 */
function removeTaskWithEvents(taskId) {
    // Input validation
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        Logger.log('Error: Invalid taskId provided. It must be a non-empty string.');
        return false;
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(TASKS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${TASKS_SHEET_NAME}" not found!`);
        }

        // Get all tasks and events to find related items
        const allTasks = getAllTasks();
        const allEvents = getAllEvents();

        // Find all child tasks
        const childTasks = allTasks.filter(t => t.parentId === taskId);

        // Update parentId to null for all child tasks
        for (const childTask of childTasks) {
            updateTask(childTask.taskId, { parentId: null });
        }

        // Delete all associated calendar events
        const associatedEvents = allEvents.filter(e => e.parentId === taskId);
        for (const event of associatedEvents) {
            deleteEvent(event.eventId);
        }

        // Find and delete the task itself
        const data = sheet.getDataRange().getValues();
        const taskRowIndex = data.slice(1).findIndex(row => row[0] === taskId);
        
        if (taskRowIndex === -1) {
            Logger.log(`Error: Task with ID '${taskId}' not found.`);
            return false;
        }

        // Delete the row
        sheet.deleteRow(taskRowIndex + 2);

        Logger.log(`Task and its events removed (children preserved with parentId set to null): ID = ${taskId}`);
        return true;

    } catch (error) {
        Logger.log(`Failed to remove task with events: ${error}`);
        return false;
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
        parentId: row[1] === "" ? null : row[1],
        name: row[2],
        description: row[3],
        status: row[4],
        expectTimeSpent: row[5],
        totalTimeSpent: row[6],
        createdAt: new Date(row[7])
    };
}