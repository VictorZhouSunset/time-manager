// --- Test Runner ---
function runAllAddProjectTests() {
    Logger.log("======== RUNNING ADDPROJECT TESTS ========");
    let allTestsPassed = true;

    // --- Helper: Clean up sheet for fresh testing (Optional, use with caution) ---
    // clearSheetData(PROJECTS_SHEET_NAME); // Make sure PROJECTS_SHEET_NAME is defined

    // --- Individual Test Cases ---
    if (!testAddProject_Success_Basic()) allTestsPassed = false;
    if (!testAddProject_Success_AllFields()) allTestsPassed = false;
    if (!testAddProject_Success_WithParentId()) allTestsPassed = false;
    if (!testAddProject_Success_SpecificStatusAndTime()) allTestsPassed = false;
    if (!testAddProject_Success_ZeroTimes()) allTestsPassed = false;

    if (!testAddProject_Failure_MissingName()) allTestsPassed = false;
    if (!testAddProject_Failure_MissingExpectTime()) allTestsPassed = false;
    if (!testAddProject_Failure_NegativeExpectTime()) allTestsPassed = false;
    if (!testAddProject_Warning_InvalidDescriptionType()) allTestsPassed = false; // Expects default
    if (!testAddProject_Warning_InvalidStatus()) allTestsPassed = false;         // Expects default
    if (!testAddProject_Warning_InvalidTotalTimeType()) allTestsPassed = false;   // Expects default
    if (!testAddProject_Warning_NegativeTotalTime()) allTestsPassed = false;      // Expects default (or error depending on strictness)
    if (!testAddProject_Failure_InvalidParentIdType()) allTestsPassed = false;

    Logger.log("======== ADDPROJECT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDPROJECT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDPROJECT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}



// ---------------------------------------------------------------------------------------
// --- Test Cases for addProject ---
// ---------------------------------------------------------------------------------------

function testAddProject_Success_Basic() {
    Logger.log("\n--- Test: AddProject - Success Basic ---");
    const input = { name: "Basic Project", expectTimeSpent: 10 };
    const result = addProject(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.projectId, "Result should have a projectId") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, "", "Description should default to empty string") && pass;
        pass = assertStrictEquals(result.parentId, null, "ParentId should default to null") && pass;
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default to 'Not yet started'") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, input.expectTimeSpent, "expectTimeSpent should match input") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0") && pass;
    }
    return pass;
}

function testAddProject_Success_AllFields() {
    Logger.log("\n--- Test: AddProject - Success All Fields ---");
    const input = {
        name: "Complete Project",
        description: "This has all fields",
        parentId: "P-DUMMY-PARENT-123", // Assume this ID is valid for testing (no existence check yet)
        status: "On track",
        expectTimeSpent: 25,
        totalTimeSpent: 5.5
    };
    const result = addProject(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.projectId, "Result should have a projectId") && pass;
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

function testAddProject_Success_WithParentId() {
    Logger.log("\n--- Test: AddProject - Success With ParentId ---");
    const input = { name: "Child Project", expectTimeSpent: 5, parentId: "P-ANOTHER-DUMMY" };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
    }
    return pass;
}

function testAddProject_Success_SpecificStatusAndTime() {
    Logger.log("\n--- Test: AddProject - Success Specific Status & Time ---");
    const input = { name: "Ongoing Task", expectTimeSpent: 12, status: "Paused", totalTimeSpent: 3 };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.status, input.status, "Status should match input") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, input.totalTimeSpent, "totalTimeSpent should match input") && pass;
    }
    return pass;
}

function testAddProject_Success_ZeroTimes() {
    Logger.log("\n--- Test: AddProject - Success Zero Times ---");
    const input = { name: "Zero Time Project", expectTimeSpent: 0, totalTimeSpent: 0 };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.expectTimeSpent, 0, "expectTimeSpent should be 0") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should be 0") && pass;
    }
    return pass;
}


function testAddProject_Failure_MissingName() {
    Logger.log("\n--- Test: AddProject - Failure Missing Name ---");
    const input = { expectTimeSpent: 10 };
    const result = addProject(input);
    return assertNull(result, "Function should return null when name is missing");
}

function testAddProject_Failure_MissingExpectTime() {
    Logger.log("\n--- Test: AddProject - Failure Missing expectTimeSpent ---");
    const input = { name: "Project No Time" };
    const result = addProject(input);
    return assertNull(result, "Function should return null when expectTimeSpent is missing");
}

function testAddProject_Failure_NegativeExpectTime() {
    Logger.log("\n--- Test: AddProject - Failure Negative expectTimeSpent ---");
    const input = { name: "Bad Time Project", expectTimeSpent: -5 };
    const result = addProject(input);
    return assertNull(result, "Function should return null for negative expectTimeSpent");
}

function testAddProject_Warning_InvalidDescriptionType() {
    Logger.log("\n--- Test: AddProject - Warning Invalid Description Type (should default) ---");
    const input = { name: "Desc Type Test", expectTimeSpent: 5, description: 123 };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create project") && pass;
    if (result) {
        // Your addProject logs a warning and uses default.
        pass = assertStrictEquals(result.description, "", "Description should default to empty string for invalid type") && pass;
    }
    return pass;
}

function testAddProject_Warning_InvalidStatus() {
    Logger.log("\n--- Test: AddProject - Warning Invalid Status (should default) ---");
    const input = { name: "Status Test", expectTimeSpent: 5, status: "Super Fun Status" };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create project") && pass;
    if (result) {
        // Your addProject logs a warning and uses default.
        pass = assertStrictEquals(result.status, "Not yet started", "Status should default for invalid input") && pass;
    }
    return pass;
}

function testAddProject_Warning_InvalidTotalTimeType() {
    Logger.log("\n--- Test: AddProject - Warning Invalid totalTimeSpent Type (should default) ---");
    const input = { name: "Total Time Type Test", expectTimeSpent: 5, totalTimeSpent: "five hours" };
    const result = addProject(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create project") && pass;
    if (result) {
        // Your addProject logs a warning and uses default.
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for invalid type") && pass;
    }
    return pass;
}

function testAddProject_Warning_NegativeTotalTime() {
    Logger.log("\n--- Test: AddProject - Warning Negative totalTimeSpent (should default or error) ---");
    const input = { name: "Negative Total Time", expectTimeSpent: 5, totalTimeSpent: -10 };
    const result = addProject(input); // Your current code defaults this to 0 after logging a warning.
                                     // If you change addProject to return null for this, this test needs to change.
    let pass = true;
    pass = assertTruthy(result, "Function should still create project (or fail if you made it stricter)") && pass;
    if (result) {
        pass = assertStrictEquals(result.totalTimeSpent, 0, "totalTimeSpent should default to 0 for negative input") && pass;
    }
    return pass;
}

function testAddProject_Failure_InvalidParentIdType() {
    Logger.log("\n--- Test: AddProject - Failure Invalid ParentId Type ---");
    const input = { name: "ParentId Type Test", expectTimeSpent: 5, parentId: 12345 };
    const result = addProject(input);
    // Your addProject function (from previous context) returns null if parentId is provided but not a string.
    return assertNull(result, "Function should return null for non-string parentId");
}

function testAddProject_Failure_EmptyParentIdString() {
    Logger.log("\n--- Test: AddProject - Failure Empty ParentId String (if provided) ---");
    const input = { name: "Empty ParentId Project", expectTimeSpent: 5, parentId: "  " }; // parentId is an empty/whitespace string
    const result = addProject(input);
    // This test expects addProject to fail if parentId IS PROVIDED and is an empty string
    return assertNull(result, "Function should return null for empty string parentId if provided");
}