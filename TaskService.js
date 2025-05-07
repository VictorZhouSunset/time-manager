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
