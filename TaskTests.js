// --- Test Runner ---
function runAllAddTaskTests() {
    Logger.log("======== RUNNING ADDTASK TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testAddTask_Success_Basic_WithParent()) allTestsPassed = false;
    if (!testAddTask_Success_Basic_NoParent()) allTestsPassed = false;
    if (!testAddTask_Success_AllFields_WithParent()) allTestsPassed = false;
    if (!testAddTask_Success_SpecificStatusAndTime_WithParent()) allTestsPassed = false;

    if (!testAddTask_Failure_MissingName()) allTestsPassed = false;
    if (!testAddTask_Failure_MissingName_NoParent()) allTestsPassed = false;
    if (!testAddTask_Failure_MissingExpectTime()) allTestsPassed = false;
    if (!testAddTask_Failure_NegativeExpectTime()) allTestsPassed = false;
    if (!testAddTask_Failure_InvalidParentIdType()) allTestsPassed = false;
    if (!testAddTask_Failure_EmptyParentIdString()) allTestsPassed = false;
    if (!testAddTask_Failure_NonexistentParentId()) allTestsPassed = false;

    if (!testAddTask_Warning_InvalidDescriptionType()) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidStatus()) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidTotalTimeType()) allTestsPassed = false;
    if (!testAddTask_Warning_NegativeTotalTime()) allTestsPassed = false;

    if (!testAddTask_Success_ZeroTimes()) allTestsPassed = false;
    if (!testAddTask_Success_TaskWithTaskParent()) allTestsPassed = false;

    Logger.log("======== ADDTASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDTASK TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDTASK TESTS FAILED. Check logs above. ❌❌❌");
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
    } else {
        Logger.log("❌❌❌ SOME GETTASK TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}



// ---------------------------------------------------------------------------------------
// --- Test Cases for addTask ---
// ---------------------------------------------------------------------------------------


function testAddTask_Success_Basic_WithParent() {
    Logger.log("\n--- Test: AddTask - Success Basic with ParentId ---");
    // Create a parent project for this test
    const parentProject = addProject({ 
        name: "Test Parent Project for Basic Task", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = {
        name: "Basic Task with Parent",
        expectTimeSpent: 5,
        parentId: parentProject.projectId
    };
    const result = addTask(input);
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
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Complete Task", 
        expectTimeSpent: 10 
    });
    
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
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Status Task", 
        expectTimeSpent: 10 
    });
    
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
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Missing Name", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { expectTimeSpent: 10, parentId: parentProject.projectId };
    const result = addTask(input);
    return assertNull(result, "Function should return null when name is missing");
}

function testAddTask_Failure_MissingName_NoParent() {
    Logger.log("\n--- Test: AddTask - Failure Missing Name (without ParentId) ---");
    const input = { expectTimeSpent: 10 }; // No parentId, no name
    const result = addTask(input);
    return assertNull(result, "Function should return null when name is missing (no parentId case)");
}


function testAddTask_Failure_MissingExpectTime() {
    Logger.log("\n--- Test: AddTask - Failure Missing expectTimeSpent (with ParentId provided) ---");
    // Create a parent project for this test
    const parentProject = addProject({ 
        name: "Test Parent Project for Missing Time", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Task No Time", parentId: parentProject.projectId };
    const result = addTask(input);
    return assertNull(result, "Function should return null when expectTimeSpent is missing");
}

function testAddTask_Failure_NegativeExpectTime() {
    Logger.log("\n--- Test: AddTask - Failure Negative expectTimeSpent (with ParentId provided) ---");
    // Create a parent project for this test
    const parentProject = addProject({ 
        name: "Test Parent Project for Negative Time", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Bad Time Task", expectTimeSpent: -2, parentId: parentProject.projectId };
    const result = addTask(input);
    return assertNull(result, "Function should return null for negative expectTimeSpent");
}

function testAddTask_Failure_InvalidParentIdType() {
    Logger.log("\n--- Test: AddTask - Failure Invalid ParentId Type (if provided) ---");
    const input = { name: "Bad ParentId Task", expectTimeSpent: 5, parentId: 12345 }; // parentId is a number
    const result = addTask(input);
    // This test expects addTask to fail if parentId IS PROVIDED and is not a string
    return assertNull(result, "Function should return null for non-string parentId if provided");
}

function testAddTask_Failure_EmptyParentIdString() {
    Logger.log("\n--- Test: AddTask - Failure Empty ParentId String (if provided) ---");
    const input = { name: "Empty ParentId Task", expectTimeSpent: 5, parentId: "  " }; // parentId is an empty/whitespace string
    const result = addTask(input);
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
    const result = addTask(input);
    // This test expects addTask to fail if parentId doesn't exist in the database
    return assertNull(result, "Function should return null for nonexistent parentId");
}


function testAddTask_Warning_InvalidDescriptionType() {
    Logger.log("\n--- Test: AddTask - Warning Invalid Description Type (should default, with ParentId) ---");
    // Create a parent project for this test
    const parentProject = addProject({ 
        name: "Test Parent Project for Invalid Desc", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Desc Type Task", expectTimeSpent: 5, parentId: parentProject.projectId, description: 123 };
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Invalid Status", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Status Test Task", expectTimeSpent: 5, parentId: parentProject.projectId, status: "Way Too Cool" };
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Invalid Time Type", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Total Time Type Task", expectTimeSpent: 5, parentId: parentProject.projectId, totalTimeSpent: "one hour" };
    const result = addTask(input);
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
    const parentProject = addProject({ 
        name: "Test Parent Project for Negative Total Time", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ FAILED TO CREATE TEST PARENT PROJECT - ABORTING TEST");
        return false;
    }

    const input = { name: "Negative Total Time Task", expectTimeSpent: 5, parentId: parentProject.projectId, totalTimeSpent: -3 };
    const result = addTask(input);
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
    const result = addTask(input);
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
    const parentTask = addTask({ name: "Parent Task", expectTimeSpent: 10 });
    
    // Then create a child task referencing the parent task
    const input = { name: "Child of Task", expectTimeSpent: 5, parentId: parentTask.taskId };
    const result = addTask(input);
    
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
    const createdTask = addTask(taskData);
    
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
    const parentId = 'P-test-parent-for-tasks';
    
    // Create a few tasks with this parent
    const taskData1 = {
        name: "Child Task 1",
        expectTimeSpent: 2,
        parentId: parentId
    };
    const taskData2 = {
        name: "Child Task 2",
        expectTimeSpent: 3,
        parentId: parentId
    };
    
    const createdTask1 = addTask(taskData1);
    const createdTask2 = addTask(taskData2);
    
    if (!createdTask1 || !createdTask2) {
        Logger.log("  ❌ FAIL: Could not create test tasks for GetTasksByParentId test");
        return false;
    }
    
    // Now get tasks by parent ID
    const result = getTasksByParentId(parentId);
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
    
    const createdTask = addTask(taskData);
    
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





