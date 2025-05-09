// --- Test Runner ---
function runAllAddTaskTests() {
    Logger.log("======== RUNNING ADDTASK TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    // Basic task creation tests
    // └── Tests creating tasks with and without parents
    if (!testAddTask_Success_Basic_WithParent()) allTestsPassed = false;
    if (!testAddTask_Success_Basic_NoParent()) allTestsPassed = false;
    if (!testAddTask_Success_AllFields_WithParent()) allTestsPassed = false;
    if (!testAddTask_Success_SpecificStatusAndTime_WithParent()) allTestsPassed = false;

    // Input validation tests
    // └── Tests handling of invalid inputs
    if (!testAddTask_Failure_MissingName()) allTestsPassed = false;
    if (!testAddTask_Failure_MissingName_NoParent()) allTestsPassed = false;
    if (!testAddTask_Failure_MissingExpectTime()) allTestsPassed = false;
    if (!testAddTask_Failure_NegativeExpectTime()) allTestsPassed = false;
    if (!testAddTask_Failure_InvalidParentIdType()) allTestsPassed = false;
    if (!testAddTask_Failure_EmptyParentIdString()) allTestsPassed = false;
    if (!testAddTask_Failure_NonexistentParentId()) allTestsPassed = false;

    // Warning handling tests
    // └── Tests handling of invalid but recoverable inputs
    if (!testAddTask_Warning_InvalidDescriptionType()) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidStatus()) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidTotalTimeType()) allTestsPassed = false;
    if (!testAddTask_Warning_NegativeTotalTime()) allTestsPassed = false;

    // Special case tests
    // └── Tests edge cases and special scenarios
    if (!testAddTask_Success_ZeroTimes()) allTestsPassed = false;
    if (!testAddTask_Success_TaskWithTaskParent()) allTestsPassed = false;

    Logger.log("======== ADDTASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDTASK TESTS PASSED! 🎉🎉🎉");
        cleanupTestData();
    } else {
        Logger.log("❌❌❌ SOME ADDTASK TESTS FAILED. Check logs above. ❌❌❌");
        Logger.log("⚠️ Test data cleanup skipped to preserve failed test context");
    }
    return allTestsPassed;
}

function runAllGetTaskTests() {
    Logger.log("======== RUNNING GETTASK TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testGetAllTasks_Success_Basic()) allTestsPassed = false;
    
    if (!testGetTaskById_Success_Basic()) allTestsPassed = false;
    if (!testGetTaskById_Failure_NotFound()) allTestsPassed = false;
    if (!testGetTaskById_Failure_InvalidId()) allTestsPassed = false;
    
    if (!testGetTasksByParentId_Success_Basic()) allTestsPassed = false;
    if (!testGetTasksByParentId_Success_NoChildren()) allTestsPassed = false;
    
    if (!testGetTasksByStatus_Success_Basic()) allTestsPassed = false;
    if (!testGetTasksByStatus_Success_NoMatches()) allTestsPassed = false;
    if (!testGetTasksByStatus_Failure_InvalidStatus()) allTestsPassed = false;

    Logger.log("======== GETTASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL GETTASK TESTS PASSED! 🎉🎉🎉");
        cleanupTestData();
    } else {
        Logger.log("❌❌❌ SOME GETTASK TESTS FAILED. Check logs above. ❌❌❌");
        Logger.log("⚠️ Test data cleanup skipped to preserve failed test context");
    }
    return allTestsPassed;
}

function runAllUpdateTaskTests() {
    Logger.log("======== RUNNING UPDATETASK TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testUpdateTask_Success_Basic()) allTestsPassed = false;
    if (!testUpdateTask_Success_AllFields()) allTestsPassed = false;
    if (!testUpdateTask_Success_PartialUpdate()) allTestsPassed = false;
    if (!testUpdateTask_Success_UpdateParentId()) allTestsPassed = false;
    if (!testUpdateTask_Success_ZeroTimes()) allTestsPassed = false;

    if (!testUpdateTask_Failure_InvalidTaskId()) allTestsPassed = false;
    if (!testUpdateTask_Failure_NotFound()) allTestsPassed = false;
    if (!testUpdateTask_Failure_InvalidUpdateData()) allTestsPassed = false;
    if (!testUpdateTask_Failure_NegativeExpectTime()) allTestsPassed = false;
    if (!testUpdateTask_Failure_NegativeTotalTime()) allTestsPassed = false;
    if (!testUpdateTask_Failure_InvalidParentId()) allTestsPassed = false;
    if (!testUpdateTask_Failure_NonexistentParentId()) allTestsPassed = false;
    if (!testUpdateTask_Failure_CircularReference()) allTestsPassed = false;
    if (!testUpdateTask_Failure_CircularReference_WithProject()) allTestsPassed = false;

    Logger.log("======== UPDATETASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL UPDATETASK TESTS PASSED! 🎉🎉🎉");
        cleanupTestData();
    } else {
        Logger.log("❌❌❌ SOME UPDATETASK TESTS FAILED. Check logs above. ❌❌❌");
        Logger.log("⚠️ Test data cleanup skipped to preserve failed test context");
    }
    return allTestsPassed;
}

function runAllDeleteTaskTests() {
    Logger.log("======== RUNNING DELETETASK TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    // Basic deletion tests
    // └── Tests simple task deletion
    if (!testDeleteTask_Success_Basic()) allTestsPassed = false;
    if (!testDeleteTask_Failure_InvalidTaskId()) allTestsPassed = false;
    if (!testDeleteTask_Failure_NotFound()) allTestsPassed = false;

    // Parent-child relationship tests
    // └── Tests cascade deletion of tasks and their children
    //              parentTask
    //         ↓                ↓
    //     childTask1       childTask2
    if (!testDeleteTask_Success_WithChildren()) allTestsPassed = false;

    // Tests for removing tasks while preserving children
    // └── Tests non-cascade deletion with child preservation
    //                                      parentTask (removed)
    //         ↓                                                            ↓
    //     childTask1 (preserved, parentId set to null)        childTask2 (preserved, parentId set to null)   

    if (!testRemoveTask_Success_Basic()) allTestsPassed = false;
    if (!testRemoveTask_Success_WithChildren()) allTestsPassed = false;
    if (!testRemoveTask_Failure_InvalidTaskId()) allTestsPassed = false;
    if (!testRemoveTask_Failure_NotFound()) allTestsPassed = false;

    // Tests for removing tasks with their events
    // └── Tests deletion of tasks and their associated calendar events
    //                              parentTask (removed)
    //         ↓                                  ↓                          ↓
    //     childTask1 (preserved)        childTask2 (preserved)           events (removed)
    if (!testRemoveTaskWithEvents_Success_Basic()) allTestsPassed = false;
    if (!testRemoveTaskWithEvents_Success_WithChildren()) allTestsPassed = false;
    if (!testRemoveTaskWithEvents_Failure_InvalidTaskId()) allTestsPassed = false;
    if (!testRemoveTaskWithEvents_Failure_NotFound()) allTestsPassed = false;

    Logger.log("======== DELETETASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL DELETETASK TESTS PASSED! 🎉🎉🎉");
        cleanupTestData();
    } else {
        Logger.log("❌❌❌ SOME DELETETASK TESTS FAILED. Check logs above. ❌❌❌");
        Logger.log("⚠️ Test data cleanup skipped to preserve failed test context");
    }
    return allTestsPassed;
}

// ---------------------------------------------------------------------------------------
// --- Test Cases for addTask functions ---
// ---------------------------------------------------------------------------------------


function testAddTask_Success_Basic_WithParent() {
    Logger.log("\n--- Test: AddTask - Success Basic with ParentId ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Basic Task", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = {
        name: "Basic Task with Parent",
        expectTimeSpent: 5,
        parentId: parentProject.projectId
    };
    const result = registerTestTask(addTask(input));
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.taskId && result.taskId.startsWith('T-'), "Result should have a taskId starting with 'T-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, "", "Description should default to empty string") && pass;
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default to 'Not yet started'") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, input.expectTimeSpent, "expectTimeSpent should match input") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0") && pass;
    }
    return pass;
}

function testAddTask_Success_Basic_NoParent() {
    Logger.log("\n--- Test: AddTask - Success Basic without ParentId (should default to null) ---");
    const input = {
        name: "Basic Task No Parent",
        expectTimeSpent: 7
        // parentId is intentionally omitted
    };
    const result = registerTestTask(addTask(input));
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.taskId && result.taskId.startsWith('T-'), "Result should have a taskId starting with 'T-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.parentId, null, "ParentId should default to null when not provided") && pass; // Key check
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default to 'Not yet started'") && pass;
    }
    return pass;
}


function testAddTask_Success_AllFields_WithParent() {
    Logger.log("\n--- Test: AddTask - Success All Fields with ParentId ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Complete Task", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = {
        name: "Complete Task with Parent",
        description: "This task has all fields",
        parentId: parentProject.projectId,
        status: "On track",
        expectTimeSpent: 15,
        totalTimeSpent: 2.5
    };
    const result = registerTestTask(addTask(input));
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.taskId && result.taskId.startsWith('T-'), "Result should have a taskId starting with 'T-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, input.description, "Description should match input") && pass;
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
        pass = assertStrictEquals(result.status, input.status, "Status should match input") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, input.expectTimeSpent, "expectTimeSpent should match input") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, input.totalTimeSpent, "totalTimeSpent should match input") && pass;
    }
    return pass;
}

function testAddTask_Success_SpecificStatusAndTime_WithParent() {
    Logger.log("\n--- Test: AddTask - Success Specific Status & Time with ParentId ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Status Task", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = {
        name: "Task On Hold with Parent",
        expectTimeSpent: 8,
        parentId: parentProject.projectId,
        status: "Paused", // Using 'Paused' from your updated status list
        totalTimeSpent: 1
    };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.status, input.status, "Status should match input") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, input.totalTimeSpent, "totalTimeSpent should match input") && pass;
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
    }
    return pass;
}

function testAddTask_Failure_MissingName() {
    Logger.log("\n--- Test: AddTask - Failure Missing Name (with ParentId provided) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Missing Name", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { expectTimeSpent: 10, parentId: parentProject.projectId };
    const result = registerTestTask(addTask(input));
    return assertNull(result, "Function should return null when name is missing");
}

function testAddTask_Failure_MissingName_NoParent() {
    Logger.log("\n--- Test: AddTask - Failure Missing Name (without ParentId) ---");
    const input = { expectTimeSpent: 10 }; // No parentId, no name
    const result = registerTestTask(addTask(input));
    return assertNull(result, "Function should return null when name is missing (no parentId case)");
}


function testAddTask_Failure_MissingExpectTime() {
    Logger.log("\n--- Test: AddTask - Failure Missing expectTimeSpent (with ParentId provided) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Missing Time", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Task No Time", parentId: parentProject.projectId };
    const result = registerTestTask(addTask(input));
    return assertNull(result, "Function should return null when expectTimeSpent is missing");
}

function testAddTask_Failure_NegativeExpectTime() {
    Logger.log("\n--- Test: AddTask - Failure Negative expectTimeSpent (with ParentId provided) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Negative Time", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Bad Time Task", expectTimeSpent: -2, parentId: parentProject.projectId };
    const result = registerTestTask(addTask(input));
    return assertNull(result, "Function should return null for negative expectTimeSpent");
}

function testAddTask_Failure_InvalidParentIdType() {
    Logger.log("\n--- Test: AddTask - Failure Invalid ParentId Type (if provided) ---");
    const input = { name: "Bad ParentId Task", expectTimeSpent: 5, parentId: 12345 }; // parentId is a number
    const result = registerTestTask(addTask(input));
    // This test expects addTask to fail if parentId IS PROVIDED and is not a string
    return assertNull(result, "Function should return null for non-string parentId if provided");
}

function testAddTask_Failure_EmptyParentIdString() {
    Logger.log("\n--- Test: AddTask - Failure Empty ParentId String (if provided) ---");
    const input = { name: "Empty ParentId Task", expectTimeSpent: 5, parentId: "  " }; // parentId is an empty/whitespace string
    const result = registerTestTask(addTask(input));
    // This test expects addTask to fail if parentId IS PROVIDED and is an empty string
    return assertNull(result, "Function should return null for empty string parentId if provided");
}

function testAddTask_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: AddTask - Failure Nonexistent ParentId ---");
    const input = { 
        name: "Nonexistent Parent Task", 
        expectTimeSpent: 5, 
        parentId: "P-DOES-NOT-EXIST-" + Utilities.getUuid() 
    };
    const result = registerTestTask(addTask(input));
    // This test expects addTask to fail if parentId doesn't exist in the database
    return assertNull(result, "Function should return null for nonexistent parentId");
}


function testAddTask_Warning_InvalidDescriptionType() {
    Logger.log("\n--- Test: AddTask - Warning Invalid Description Type (should default, with ParentId) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Invalid Desc", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Desc Type Task", expectTimeSpent: 5, parentId: parentProject.projectId, description: 123 };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.description, "", "Description should default to empty string for invalid type") && pass;
    }
    return pass;
}

function testAddTask_Warning_InvalidStatus() {
    Logger.log("\n--- Test: AddTask - Warning Invalid Status (should default, with ParentId) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Invalid Status", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Status Test Task", expectTimeSpent: 5, parentId: parentProject.projectId, status: "Way Too Cool" };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default for invalid input") && pass;
    }
    return pass;
}

function testAddTask_Warning_InvalidTotalTimeType() {
    Logger.log("\n--- Test: AddTask - Warning Invalid totalTimeSpent Type (should default, with ParentId) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Invalid Time Type", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Total Time Type Task", expectTimeSpent: 5, parentId: parentProject.projectId, totalTimeSpent: "one hour" };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for invalid type") && pass;
    }
    return pass;
}

function testAddTask_Warning_NegativeTotalTime() {
    Logger.log("\n--- Test: AddTask - Warning Negative totalTimeSpent (should default, with ParentId) ---");
    // Create a parent project for this test
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent Project for Negative Total Time", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Negative Total Time Task", expectTimeSpent: 5, parentId: parentProject.projectId, totalTimeSpent: -3 };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for negative input") && pass;
    }
    return pass;
}

function testAddTask_Success_ZeroTimes() {
    Logger.log("\n--- Test: AddTask - Success Zero Times ---");
    const input = { name: "Zero Time Task", expectTimeSpent: 0, totalTimeSpent: 0 };
    const result = registerTestTask(addTask(input));
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.expectTimeSpent, 0, "expectTimeSpent should be 0") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should be 0") && pass;
    }
    return pass;
}

function testAddTask_Success_TaskWithTaskParent() {
    Logger.log("\n--- Test: AddTask - Success Task with Task Parent ---");
    
    // First create a parent task
    const parentTask = registerTestTask(addTask({ name: "Parent Task", expectTimeSpent: 10 }));
    
    // Then create a child task referencing the parent task
    const input = { name: "Child of Task", expectTimeSpent: 5, parentId: parentTask.taskId };
    const result = registerTestTask(addTask(input));
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
        // Verify it's a task ID (starts with T-)
        pass = assertTruthy(result.parentId.startsWith('T-'), "Parent ID should be a task ID") && pass;
    }
    return pass;
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for getTask functions ---
// ---------------------------------------------------------------------------------------

function testGetAllTasks_Success_Basic() {
    Logger.log("\n--- Test: GetAllTasks - Success Basic ---");
    const result = getAllTasks();
    let pass = true;
    
    pass = assertArray(result, "Function should return an array of tasks") && pass;
    // We don't test the exact length as it may vary, but we can check structure if there are items
    if (result.length > 0) {
        const firstTask = result[0];
        pass = assertTruthy(firstTask.taskId && firstTask.taskId.startsWith('T-'), "Task should have a taskId starting with 'T-'") && pass;
        pass = assertTruthy('name' in firstTask, "Task should have a name property") && pass;
        pass = assertTruthy('status' in firstTask, "Task should have a status property") && pass;
        pass = assertTruthy('expectTimeSpent' in firstTask, "Task should have an expectTimeSpent property") && pass;
    }
    
    return pass;
}

function testGetTaskById_Success_Basic() {
    Logger.log("\n--- Test: GetTaskById - Success Basic ---");
    // First, create a task to ensure we have one to retrieve
    const taskData = {
        name: "Task for GetById Test",
        expectTimeSpent: 3
    };
    const createdTask = registerTestTask(addTask(taskData));
    
    if (!createdTask) {
        Logger.log("  ❌ FAIL: Could not create test task for GetTaskById test");
        return false;
    }
    
    // Now try to retrieve it
    const result = getTaskById(createdTask.taskId);
    let pass = true;
    
    pass = assertTruthy(result, "Function should return a task object") && pass;
    if (result) {
        pass = assertStrictEquals(result.taskId, createdTask.taskId, "TaskId should match") && pass;
        pass = assertStrictEquals(result.name, createdTask.name, "Name should match") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, createdTask.expectTimeSpent, "ExpectTimeSpent should match") && pass;
    }
    
    return pass;
}

function testGetTaskById_Failure_NotFound() {
    Logger.log("\n--- Test: GetTaskById - Failure Not Found ---");
    const nonExistentId = 'T-nonexistent-task-id';
    const result = getTaskById(nonExistentId);
    
    return assertNull(result, "Function should return null for non-existent task ID");
}

function testGetTaskById_Failure_InvalidId() {
    Logger.log("\n--- Test: GetTaskById - Failure Invalid ID ---");
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = getTaskById(invalidId);
        pass = assertNull(result, `Function should return null for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testGetTasksByParentId_Success_Basic() {
    Logger.log("\n--- Test: GetTasksByParentId - Success Basic ---");
    // First, create a parent project/task
    const parentProject = registerTestProject(addProject({ 
        name: "Test Parent for Tasks", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Could not create test parent project for GetTasksByParentId test");
        return false;
    }
    
    // Create a few tasks with this parent
    const taskData1 = {
        name: "Child Task 1",
        expectTimeSpent: 2,
        parentId: parentProject.projectId
    };
    const taskData2 = {
        name: "Child Task 2",
        expectTimeSpent: 3,
        parentId: parentProject.projectId
    };
    
    const createdTask1 = registerTestTask(addTask(taskData1));
    const createdTask2 = registerTestTask(addTask(taskData2));
    
    if (!createdTask1 || !createdTask2) {
        Logger.log("  ❌ FAIL: Could not create test tasks for GetTasksByParentId test");
        return false;
    }
    
    // Now get tasks by parent ID
    const result = getTasksByParentId(parentProject.projectId);
    let pass = true;
    
    pass = assertArray(result, "Function should return an array of tasks") && pass;
    pass = assertTruthy(result.length >= 2, "Should find at least the 2 tasks we just created") && pass;
    
    // Check if our created tasks are in the results
    const foundTask1 = result.some(task => task.taskId === createdTask1.taskId);
    const foundTask2 = result.some(task => task.taskId === createdTask2.taskId);
    
    pass = assertTruthy(foundTask1, "Should find the first created task") && pass;
    pass = assertTruthy(foundTask2, "Should find the second created task") && pass;
    
    return pass;
}

function testGetTasksByParentId_Success_NoChildren() {
    Logger.log("\n--- Test: GetTasksByParentId - Success No Children ---");
    // Use a parent ID that shouldn't have any children
    const unusedParentId = 'P-no-children-tasks-test';
    
    const result = getTasksByParentId(unusedParentId);
    let pass = true;
    
    pass = assertArray(result, "Function should return an array") && pass;
    pass = assertStrictEquals(result.length, 0, "Array should be empty for parent with no children") && pass;
    
    return pass;
}

function testGetTasksByStatus_Success_Basic() {
    Logger.log("\n--- Test: GetTasksByStatus - Success Basic ---");
    // Create a task with a specific status
    const testStatus = "On track";
    const taskData = {
        name: "Status Test Task",
        expectTimeSpent: 4,
        status: testStatus
    };
    
    const createdTask = registerTestTask(addTask(taskData));
    
    if (!createdTask) {
        Logger.log("  ❌ FAIL: Could not create test task for GetTasksByStatus test");
        return false;
    }
    
    // Now get tasks by status
    const result = getTasksByStatus(testStatus);
    let pass = true;
    
    pass = assertArray(result, "Function should return an array of tasks") && pass;
    pass = assertTruthy(result.length > 0, "Should find at least one task with the status") && pass;
    
    // Check if all returned tasks have the correct status
    const allHaveCorrectStatus = result.every(task => task.status === testStatus);
    pass = assertTruthy(allHaveCorrectStatus, "All returned tasks should have the requested status") && pass;
    
    // Check if our created task is in the results
    const foundCreatedTask = result.some(task => task.taskId === createdTask.taskId);
    pass = assertTruthy(foundCreatedTask, "Should find the task we just created") && pass;
    
    return pass;
}

function testGetTasksByStatus_Success_NoMatches() {
    Logger.log("\n--- Test: GetTasksByStatus - Success No Matches ---");
    // Use a valid but unlikely status
    const unusedStatus = "Completed"; // Assuming there are no completed tasks for this test
    
    const result = getTasksByStatus(unusedStatus);
    let pass = true;
    
    pass = assertArray(result, "Function should return an array") && pass;
    // We can't guarantee there are no tasks with this status, but we can check the array type
    
    return pass;
}

function testGetTasksByStatus_Failure_InvalidStatus() {
    Logger.log("\n--- Test: GetTasksByStatus - Failure Invalid Status ---");
    const invalidStatus = "Not a valid status";
    
    const result = getTasksByStatus(invalidStatus);
    let pass = true;
    
    pass = assertArray(result, "Function should return an empty array for invalid status") && pass;
    pass = assertStrictEquals(result.length, 0, "Array should be empty for invalid status") && pass;
    
    return pass;
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for updateTask functions ---
// ---------------------------------------------------------------------------------------

function testUpdateTask_Success_Basic() {
    Logger.log("\n--- Test: UpdateTask - Success Basic ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Update",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Update the task
    const updateData = {
        name: "Updated Task Name"
    };
    const result = updateTask(testTask.taskId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.taskId, testTask.taskId, "Task ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, testTask.expectTimeSpent, "ExpectTimeSpent should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateTask_Success_AllFields() {
    Logger.log("\n--- Test: UpdateTask - Success All Fields ---");
    
    // Create a parent task for this test
    const parentTask = registerTestTask(addTask({
        name: "Parent for Task Update",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Full Update",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Update all fields
    const updateData = {
        name: "Fully Updated Task",
        description: "Updated description",
        status: "On track",
        expectTimeSpent: 15,
        totalTimeSpent: 5,
        parentId: parentTask.taskId
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.taskId, testTask.taskId, "Task ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.status, updateData.status, "Status should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, updateData.expectTimeSpent, "ExpectTimeSpent should be updated") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, updateData.totalTimeSpent, "TotalTimeSpent should be updated") && pass;
        pass = assertStrictEquals(result.parentId, updateData.parentId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateTask_Success_PartialUpdate() {
    Logger.log("\n--- Test: UpdateTask - Success Partial Update ---");
    
    // Create a test task with all fields
    const testTask = registerTestTask(addTask({
        name: "Test Task for Partial Update",
        description: "Original description",
        expectTimeSpent: 10,
        status: "Not yet started"
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Update only description and status
    const updateData = {
        description: "Updated description only",
        status: "On track"
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.taskId, testTask.taskId, "Task ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, testTask.name, "Name should remain unchanged") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.status, updateData.status, "Status should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, testTask.expectTimeSpent, "ExpectTimeSpent should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateTask_Success_UpdateParentId() {
    Logger.log("\n--- Test: UpdateTask - Success Update ParentId ---");
    
    // Create two parent tasks
    const parent1 = registerTestTask(addTask({
        name: "Parent 1 for Task",
        expectTimeSpent: 20
    }));
    const parent2 = registerTestTask(addTask({
        name: "Parent 2 for Task",
        expectTimeSpent: 25
    }));
    
    if (!parent1 || !parent2) {
        Logger.log("❌ Failed to create parent tasks");
        return false;
    }
    
    // Create a test task with first parent
    const testTask = registerTestTask(addTask({
        name: "Test Task for Parent Update",
        expectTimeSpent: 10,
        parentId: parent1.taskId
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Update parent ID
    const updateData = {
        parentId: parent2.taskId
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.taskId, testTask.taskId, "Task ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.parentId, parent2.taskId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateTask_Success_ZeroTimes() {
    Logger.log("\n--- Test: UpdateTask - Success Zero Times ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Zero Times",
        expectTimeSpent: 10,
        totalTimeSpent: 5
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Update to zero times
    const updateData = {
        expectTimeSpent: 0,
        totalTimeSpent: 0
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.expectTimeSpent, 0, "ExpectTimeSpent should be updated to 0") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "TotalTimeSpent should be updated to 0") && pass;
    }
    return pass;
}

function testUpdateTask_Failure_InvalidTaskId() {
    Logger.log("\n--- Test: UpdateTask - Failure Invalid TaskId ---");
    
    const updateData = { name: "New Name" };
    const result = updateTask(null, updateData);
    
    return assertNull(result, "Function should return null for invalid task ID");
}

function testUpdateTask_Failure_NotFound() {
    Logger.log("\n--- Test: UpdateTask - Failure Not Found ---");
    
    const nonExistentId = "T-DOES-NOT-EXIST-" + Utilities.getUuid();
    const updateData = { name: "New Name" };
    const result = updateTask(nonExistentId, updateData);
    
    return assertNull(result, "Function should return null for non-existent task ID");
}

function testUpdateTask_Failure_InvalidUpdateData() {
    Logger.log("\n--- Test: UpdateTask - Failure Invalid UpdateData ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Invalid Update",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    const result = updateTask(testTask.taskId, null);
    
    return assertNull(result, "Function should return null for invalid update data");
}

function testUpdateTask_Failure_NegativeExpectTime() {
    Logger.log("\n--- Test: UpdateTask - Failure Negative ExpectTimeSpent ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Negative Time",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    const updateData = {
        expectTimeSpent: -5
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for negative expectTimeSpent");
}

function testUpdateTask_Failure_NegativeTotalTime() {
    Logger.log("\n--- Test: UpdateTask - Failure Negative TotalTimeSpent ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Negative Total Time",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    const updateData = {
        totalTimeSpent: -3
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for negative totalTimeSpent");
}

function testUpdateTask_Failure_InvalidParentId() {
    Logger.log("\n--- Test: UpdateTask - Failure Invalid ParentId ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Invalid Parent",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    const updateData = {
        parentId: 12345 // Invalid type
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for invalid parent ID type");
}

function testUpdateTask_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: UpdateTask - Failure Nonexistent ParentId ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Nonexistent Parent",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    const updateData = {
        parentId: "T-DOES-NOT-EXIST-" + Utilities.getUuid()
    };
    
    const result = updateTask(testTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for non-existent parent ID");
}

function testUpdateTask_Failure_CircularReference() {
    Logger.log("\n--- Test: UpdateTask - Failure Circular Reference ---");
    
    // Create a parent task
    const parentTask = registerTestTask(addTask({
        name: "Parent Task for Circular Test",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create a child task
    const childTask = registerTestTask(addTask({
        name: "Child Task for Circular Test",
        expectTimeSpent: 10,
        parentId: parentTask.taskId
    }));
    
    if (!childTask) {
        Logger.log("❌ Failed to create child task");
        return false;
    }
    
    // Try to make parent task a child of its child (circular reference)
    const updateData = {
        parentId: childTask.taskId
    };
    
    const result = updateTask(parentTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for circular reference");
}

function testUpdateTask_Failure_CircularReference_WithProject() {
    Logger.log("\n--- Test: UpdateTask - Failure Circular Reference With Project ---");
    
    // Create a parent task
    const parentTask = registerTestTask(addTask({
        name: "Parent Task for Project Circular Test",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create a project under the task
    const project = registerTestProject(addProject({
        name: "Project for Circular Test",
        expectTimeSpent: 10,
        parentId: parentTask.taskId
    }));
    
    if (!project) {
        Logger.log("❌ Failed to create project");
        return false;
    }
    
    // Create a child task under the project
    const childTask = registerTestTask(addTask({
        name: "Child Task for Project Circular Test",
        expectTimeSpent: 5,
        parentId: project.projectId
    }));
    
    if (!childTask) {
        Logger.log("❌ Failed to create child task");
        return false;
    }
    
    // Try to make parent task a child of the child task (circular reference)
    const updateData = {
        parentId: childTask.taskId
    };
    
    const result = updateTask(parentTask.taskId, updateData);
    
    return assertNull(result, "Function should return null for circular reference through project");
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for deleteTask functions ---
// ---------------------------------------------------------------------------------------

function testDeleteTask_Success_Basic() {
    Logger.log("\n--- Test: DeleteTask - Success Basic ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Delete",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Delete the task
    const result = deleteTask(testTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful deletion") && pass;
    
    // Verify the task is actually deleted
    const deletedTask = getTaskById(testTask.taskId);
    pass = assertNull(deletedTask, "Task should no longer exist in the database") && pass;
    
    return pass;
}

function testDeleteTask_Success_WithChildren() {
    Logger.log("\n--- Test: DeleteTask - Success With Children ---");
    
    // Create a parent task
    const parentTask = registerTestTask(addTask({
        name: "Parent Task for Delete",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create two direct child tasks under the parent
    const childTask1 = registerTestTask(addTask({
        name: "Child Task 1",
        expectTimeSpent: 10,
        parentId: parentTask.taskId
    }));
    
    const childTask2 = registerTestTask(addTask({
        name: "Child Task 2",
        expectTimeSpent: 15,
        parentId: parentTask.taskId
    }));
    
    // Create events for the parent and children
    const parentEvent = registerTestCalendarEvent(addCalendarEvent({
        name: "Parent Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: parentTask.taskId
    }));
    
    const childEvent1 = registerTestCalendarEvent(addCalendarEvent({
        name: "Child Event 1",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: childTask1.taskId
    }));
    
    const childEvent2 = registerTestCalendarEvent(addCalendarEvent({
        name: "Child Event 2",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: childTask2.taskId
    }));
    
    // Delete the parent task
    const result = deleteTask(parentTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful deletion") && pass;
    
    // Verify everything is deleted
    pass = assertNull(getTaskById(parentTask.taskId), "Parent task should be deleted") && pass;
    pass = assertNull(getTaskById(childTask1.taskId), "Child task 1 should be deleted") && pass;
    pass = assertNull(getTaskById(childTask2.taskId), "Child task 2 should be deleted") && pass;
    pass = assertNull(getEventById(parentEvent.eventId), "Parent event should be deleted") && pass;
    pass = assertNull(getEventById(childEvent1.eventId), "Child event 1 should be deleted") && pass;
    pass = assertNull(getEventById(childEvent2.eventId), "Child event 2 should be deleted") && pass;
    
    return pass;
}

function testDeleteTask_Failure_InvalidTaskId() {
    Logger.log("\n--- Test: DeleteTask - Failure Invalid TaskId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = deleteTask(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testDeleteTask_Failure_NotFound() {
    Logger.log("\n--- Test: DeleteTask - Failure Not Found ---");
    
    const nonExistentId = "T-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = deleteTask(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent task ID");
}

function testRemoveTask_Success_Basic() {
    Logger.log("\n--- Test: RemoveTask - Success Basic ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Remove",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Remove the task
    const result = removeTask(testTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify the task is actually removed
    const removedTask = getTaskById(testTask.taskId);
    pass = assertNull(removedTask, "Task should no longer exist in the database") && pass;
    
    return pass;
}

function testRemoveTask_Success_WithChildren() {
    Logger.log("\n--- Test: RemoveTask - Success With Children ---");
    
    // Create a parent task
    const parentTask = registerTestTask(addTask({
        name: "Parent Task for Remove",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create child tasks
    const childTask1 = registerTestTask(addTask({
        name: "Child Task 1",
        expectTimeSpent: 10,
        parentId: parentTask.taskId
    }));
    
    const childTask2 = registerTestTask(addTask({
        name: "Child Task 2",
        expectTimeSpent: 15,
        parentId: parentTask.taskId
    }));
    
    // Remove the parent task
    const result = removeTask(parentTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify parent is removed but children are preserved
    pass = assertNull(getTaskById(parentTask.taskId), "Parent task should be removed") && pass;
    
    // Verify children still exist but have no parent
    const updatedChild1 = getTaskById(childTask1.taskId);
    const updatedChild2 = getTaskById(childTask2.taskId);
    
    pass = assertTruthy(updatedChild1, "Child task 1 should still exist") && pass;
    pass = assertTruthy(updatedChild2, "Child task 2 should still exist") && pass;
    
    if (updatedChild1) pass = assertNull(updatedChild1.parentId, "Child task 1 should have no parent") && pass;
    if (updatedChild2) pass = assertNull(updatedChild2.parentId, "Child task 2 should have no parent") && pass;
    
    return pass;
}

function testRemoveTask_Failure_InvalidTaskId() {
    Logger.log("\n--- Test: RemoveTask - Failure Invalid TaskId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = removeTask(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testRemoveTask_Failure_NotFound() {
    Logger.log("\n--- Test: RemoveTask - Failure Not Found ---");
    
    const nonExistentId = "T-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = removeTask(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent task ID");
}

function testRemoveTaskWithEvents_Success_Basic() {
    Logger.log("\n--- Test: RemoveTaskWithEvents - Success Basic ---");
    
    // Create a test task
    const testTask = registerTestTask(addTask({
        name: "Test Task for Remove With Events",
        expectTimeSpent: 10
    }));
    
    if (!testTask) {
        Logger.log("❌ Failed to create test task");
        return false;
    }
    
    // Create events for the task
    const event1 = registerTestCalendarEvent(addCalendarEvent({
        name: "Event 1",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: testTask.taskId
    }));
    
    const event2 = registerTestCalendarEvent(addCalendarEvent({
        name: "Event 2",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 7200000),
        parentId: testTask.taskId
    }));
    
    // Remove the task with its events
    const result = removeTaskWithEvents(testTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify task and its events are removed
    pass = assertNull(getTaskById(testTask.taskId), "Task should be removed") && pass;
    pass = assertNull(getEventById(event1.eventId), "Event 1 should be removed") && pass;
    pass = assertNull(getEventById(event2.eventId), "Event 2 should be removed") && pass;
    
    return pass;
}

function testRemoveTaskWithEvents_Success_WithChildren() {
    Logger.log("\n--- Test: RemoveTaskWithEvents - Success With Children ---");
    
    // Create a parent task
    const parentTask = registerTestTask(addTask({
        name: "Parent Task for Remove With Events",
        expectTimeSpent: 20
    }));
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task");
        return false;
    }
    
    // Create child task
    const childTask = registerTestTask(addTask({
        name: "Child Task",
        expectTimeSpent: 10,
        parentId: parentTask.taskId
    }));
    
    // Create events for parent and child
    const parentEvent = registerTestCalendarEvent(addCalendarEvent({
        name: "Parent Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: parentTask.taskId
    }));
    
    const childEvent = registerTestCalendarEvent(addCalendarEvent({
        name: "Child Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: childTask.taskId
    }));
    
    // Remove the parent task with its events
    const result = removeTaskWithEvents(parentTask.taskId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify parent and its events are removed, but child and its events remain
    pass = assertNull(getTaskById(parentTask.taskId), "Parent task should be removed") && pass;
    pass = assertNull(getEventById(parentEvent.eventId), "Parent event should be removed") && pass;
    
    // Verify child task and its event still exist
    const updatedChild = getTaskById(childTask.taskId);
    const updatedChildEvent = getEventById(childEvent.eventId);
    
    pass = assertTruthy(updatedChild, "Child task should still exist") && pass;
    pass = assertTruthy(updatedChildEvent, "Child event should still exist") && pass;
    
    if (updatedChild) pass = assertNull(updatedChild.parentId, "Child task should have no parent") && pass;
    
    return pass;
}

function testRemoveTaskWithEvents_Failure_InvalidTaskId() {
    Logger.log("\n--- Test: RemoveTaskWithEvents - Failure Invalid TaskId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = removeTaskWithEvents(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testRemoveTaskWithEvents_Failure_NotFound() {
    Logger.log("\n--- Test: RemoveTaskWithEvents - Failure Not Found ---");
    
    const nonExistentId = "T-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = removeTaskWithEvents(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent task ID");
}






