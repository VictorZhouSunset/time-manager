function runAllAddTaskTests() {
    Logger.log("======== RUNNING ADDTASK TESTS ========");
    let allTestsPassed = true;

    // --- Helper: Clean up sheet for fresh testing (Optional, use with caution) ---
    // clearSheetData(TASKS_SHEET_NAME); // Make sure TASKS_SHEET_NAME is defined

    // --- Individual Test Cases ---
    const DUMMY_VALID_PROJECT_ID = 'P-dummy-for-task-tests'; // For tests that DO provide a parentId

    if (!testAddTask_Success_Basic_WithParent(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;
    if (!testAddTask_Success_Basic_NoParent()) allTestsPassed = false; // New test for optional parentId
    if (!testAddTask_Success_AllFields_WithParent(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;
    if (!testAddTask_Success_SpecificStatusAndTime_WithParent(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;

    if (!testAddTask_Failure_MissingName(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false; // Still needs parentId for this specific failure test
    if (!testAddTask_Failure_MissingName_NoParent()) allTestsPassed = false; // Test missing name without parent
    if (!testAddTask_Failure_MissingExpectTime(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false; // Still needs parentId
    if (!testAddTask_Failure_NegativeExpectTime(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false; // Still needs parentId
    // parentId is optional, so these failure tests for *missing* parentId are removed or changed
    if (!testAddTask_Failure_InvalidParentIdType()) allTestsPassed = false; // If parentId IS provided, it must be a string
    if (!testAddTask_Failure_EmptyParentIdString()) allTestsPassed = false; // If parentId IS provided, it must not be an empty string


    if (!testAddTask_Warning_InvalidDescriptionType(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidStatus(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;
    if (!testAddTask_Warning_InvalidTotalTimeType(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;
    if (!testAddTask_Warning_NegativeTotalTime(DUMMY_VALID_PROJECT_ID)) allTestsPassed = false;


    Logger.log("======== ADDTASK TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDTASK TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDTASK TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

// ---------------------------------------------------------------------------------------
// --- Test Cases for addTask ---
// ---------------------------------------------------------------------------------------


function testAddTask_Success_Basic_WithParent(parentId) {
    Logger.log("\n--- Test: AddTask - Success Basic with ParentId ---");
    const input = {
        name: "Basic Task with Parent",
        expectTimeSpent: 5,
        parentId: parentId
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


function testAddTask_Success_AllFields_WithParent(parentId) {
    Logger.log("\n--- Test: AddTask - Success All Fields with ParentId ---");
    const input = {
        name: "Complete Task with Parent",
        description: "This task has all fields",
        parentId: parentId,
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

function testAddTask_Success_SpecificStatusAndTime_WithParent(parentId) {
    Logger.log("\n--- Test: AddTask - Success Specific Status & Time with ParentId ---");
    const input = {
        name: "Task On Hold with Parent",
        expectTimeSpent: 8,
        parentId: parentId,
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

function testAddTask_Failure_MissingName(parentId) { // This test still needs a parentId to isolate the name failure
    Logger.log("\n--- Test: AddTask - Failure Missing Name (with ParentId provided) ---");
    const input = { expectTimeSpent: 10, parentId: parentId };
    const result = addTask(input);
    return assertNull(result, "Function should return null when name is missing");
}

function testAddTask_Failure_MissingName_NoParent() {
    Logger.log("\n--- Test: AddTask - Failure Missing Name (without ParentId) ---");
    const input = { expectTimeSpent: 10 }; // No parentId, no name
    const result = addTask(input);
    return assertNull(result, "Function should return null when name is missing (no parentId case)");
}


function testAddTask_Failure_MissingExpectTime(parentId) { // Needs parentId to isolate expectTimeSpent failure
    Logger.log("\n--- Test: AddTask - Failure Missing expectTimeSpent (with ParentId provided) ---");
    const input = { name: "Task No Time", parentId: parentId };
    const result = addTask(input);
    return assertNull(result, "Function should return null when expectTimeSpent is missing");
}

function testAddTask_Failure_NegativeExpectTime(parentId) { // Needs parentId to isolate expectTimeSpent failure
    Logger.log("\n--- Test: AddTask - Failure Negative expectTimeSpent (with ParentId provided) ---");
    const input = { name: "Bad Time Task", expectTimeSpent: -2, parentId: parentId };
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


function testAddTask_Warning_InvalidDescriptionType(parentId) {
    Logger.log("\n--- Test: AddTask - Warning Invalid Description Type (should default, with ParentId) ---");
    const input = { name: "Desc Type Task", expectTimeSpent: 5, parentId: parentId, description: 123 };
    const result = addTask(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.description, "", "Description should default to empty string for invalid type") && pass;
    }
    return pass;
}

function testAddTask_Warning_InvalidStatus(parentId) {
    Logger.log("\n--- Test: AddTask - Warning Invalid Status (should default, with ParentId) ---");
    const input = { name: "Status Test Task", expectTimeSpent: 5, parentId: parentId, status: "Way Too Cool" };
    const result = addTask(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default for invalid input") && pass;
    }
    return pass;
}

function testAddTask_Warning_InvalidTotalTimeType(parentId) {
    Logger.log("\n--- Test: AddTask - Warning Invalid totalTimeSpent Type (should default, with ParentId) ---");
    const input = { name: "Total Time Type Task", expectTimeSpent: 5, parentId: parentId, totalTimeSpent: "one hour" };
    const result = addTask(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for invalid type") && pass;
    }
    return pass;
}

function testAddTask_Warning_NegativeTotalTime(parentId) {
    Logger.log("\n--- Test: AddTask - Warning Negative totalTimeSpent (should default, with ParentId) ---");
    const input = { name: "Negative Total Time Task", expectTimeSpent: 5, parentId: parentId, totalTimeSpent: -3 };
    const result = addTask(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create task") && pass;
    if (result) {
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for negative input") && pass;
    }
    return pass;
}