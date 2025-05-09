// ------------------------------------------------------------------------------------------------
// --- Assertion Helpers ---

/**
 * Asserts that two values are strictly equal.
 * @param {*} actual The actual value.
 * @param {*} expected The expected value.
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertStrictEquals(actual, expected, message) {
    if (actual === expected) {
        Logger.log(`  ✅ PASS: ${message} (Expected: ${expected}, Got: ${actual})`);
        return true;
    } else {
        Logger.log(`  ❌ FAIL: ${message} (Expected: ${expected}, Got: ${actual})`);
        return false;
    }
}

/**
 * Asserts that a value is truthy (not null, undefined, false, 0, '', NaN).
 * @param {*} actual The actual value.
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertTruthy(actual, message) {
    if (actual) {
        Logger.log(`  ✅ PASS: ${message} (Got: ${actual})`);
        return true;
    } else {
        Logger.log(`  ❌ FAIL: ${message} (Expected truthy, Got: ${actual})`);
        return false;
    }
}

/**
 * Asserts that a value is null.
 * @param {*} actual The actual value.
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertNull(actual, message) {
    if (actual === null) {
        Logger.log(`  ✅ PASS: ${message} (Got: null)`);
        return true;
    } else {
        Logger.log(`  ❌ FAIL: ${message} (Expected null, Got: ${actual})`);
        return false;
    }
}

/**
 * Asserts that a value is an instance of a specific type (e.g., Date).
 * @param {*} actual The actual value.
 * @param {Function} expectedType The expected constructor (e.g., Date, String, Number).
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertInstanceOf(actual, expectedType, message) {
    if (actual instanceof expectedType) {
        Logger.log(`  ✅ PASS: ${message} (Instance of ${expectedType.name})`);
        return true;
    } else {
        Logger.log(`  ❌ FAIL: ${message} (Expected instance of ${expectedType.name}, Got: ${typeof actual})`);
        return false;
    }
}

/**
 * Asserts that a value is an array.
 * @param {*} value The actual value.
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertArray(value, message) {
    if (!Array.isArray(value)) {
        Logger.log(`FAILURE: ${message}. Expected array, got ${typeof value}`);
        return false;
    }
    Logger.log(`SUCCESS: ${message}.`);
    return true;
}

/**
 * Asserts that a value is a function.
 * @param {*} value The actual value.
 * @param {string} message The message to log for this assertion.
 * @return {boolean} True if assertion passes, false otherwise.
 */
function assertFunction(value, message) {
    if (typeof value !== 'function') {
        Logger.log(`FAILURE: ${message}. Expected function, got ${typeof value}`);
        return false;
    }
    Logger.log(`SUCCESS: ${message}.`);
    return true;
}




// ------------------------------------------------------------------------------------------------
// --- Test Data Cleanup Functions ---
// ------------------------------------------------------------------------------------------------

/**
 * Tracks test objects created during tests for later cleanup
 * Stores arrays of IDs in the format: {projectIds: [], taskIds: [], eventIds: []}
 */
const _testDataRegistry = {
    projectIds: [],
    taskIds: [],
    eventIds: []
};

/**
 * Registers a test project for later cleanup
 * @param {object} project The project object returned from addProject
 * @return {object} The same project object for chaining
 */
function registerTestProject(project) {
    if (project && project.projectId) {
        _testDataRegistry.projectIds.push(project.projectId);
    }
    return project;
}

/**
 * Registers a test task for later cleanup
 * @param {object} task The task object returned from addTask
 * @return {object} The same task object for chaining
 */
function registerTestTask(task) {
    if (task && task.taskId) {
        _testDataRegistry.taskIds.push(task.taskId);
    }
    return task;
}

/**
 * Registers a test calendar event for later cleanup
 * @param {object} event The event object returned from addCalendarEvent
 * @return {object} The same event object for chaining
 */
function registerTestCalendarEvent(event) {
    if (event && event.eventId) {
        _testDataRegistry.eventIds.push(event.eventId);
    }
    return event;
}

/**
 * Cleans up all registered test data
 * @return {boolean} True if cleanup was successful
 */
function cleanupTestData() {
    Logger.log("\n--- Cleaning up test data ---");
    let success = true;
    
    // First: clean up calendar events
    Logger.log(`  Removing ${_testDataRegistry.eventIds.length} calendar events...`);
    let eventsRemoved = 0;
    
    for (const eventId of _testDataRegistry.eventIds) {
        try {
            // Check if event still exists 
            const event = getEventById(eventId);
            if (!event) {
                // Already removed somehow, skip
                continue;
            }
            
            if (deleteEvent(eventId)) {
                eventsRemoved++;
            } else {
                Logger.log(`  ⚠️ Warning: Failed to remove calendar event ${eventId}`);
                success = false;
            }
        } catch (error) {
            Logger.log(`  ⚠️ Warning: Error removing calendar event ${eventId}: ${error}`);
            success = false;
        }
    }
    
    // Second: remove all tasks using removeTask (preserves children)
    Logger.log(`  Removing ${_testDataRegistry.taskIds.length} tasks...`);
    let tasksRemoved = 0;
    
    for (const taskId of _testDataRegistry.taskIds) {
        try {
            // Check if task still exists
            const task = getTaskById(taskId);
            if (!task) {
                // Already removed somehow, skip
                continue;
            }
            
            if (removeTask(taskId)) {
                tasksRemoved++;
            } else {
                Logger.log(`  ⚠️ Warning: Failed to remove task ${taskId}`);
                success = false;
            }
        } catch (error) {
            Logger.log(`  ⚠️ Warning: Error removing task ${taskId}: ${error}`);
            success = false;
        }
    }
    
    // Third: remove all projects using removeProject (preserves children)
    Logger.log(`  Removing ${_testDataRegistry.projectIds.length} projects...`);
    let projectsRemoved = 0;
    
    for (const projectId of _testDataRegistry.projectIds) {
        try {
            // Check if project still exists
            const project = getProjectById(projectId);
            if (!project) {
                // Already removed somehow, skip
                continue;
            }
            
            if (removeProject(projectId)) {
                projectsRemoved++;
            } else {
                Logger.log(`  ⚠️ Warning: Failed to remove project ${projectId}`);
                success = false;
            }
        } catch (error) {
            Logger.log(`  ⚠️ Warning: Error removing project ${projectId}: ${error}`);
            success = false;
        }
    }
    
    // Clear the registry
    _testDataRegistry.eventIds = [];
    _testDataRegistry.taskIds = [];
    _testDataRegistry.projectIds = [];
    
    Logger.log(`  ✅ Removed ${eventsRemoved} calendar events, ${tasksRemoved} tasks, and ${projectsRemoved} projects`);
    Logger.log(`  ${success ? '✅ All test data cleaned up successfully' : '⚠️ Some cleanup operations failed'}`);
    return success;
}