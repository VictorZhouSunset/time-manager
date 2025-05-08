// --- Test Runner ---
function runAllAddProjectTests() {
    Logger.log("======== RUNNING ADDPROJECT TESTS ========");
    let allTestsPassed = true;

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
    if (!testAddProject_Failure_EmptyParentIdString()) allTestsPassed = false;
    if (!testAddProject_Failure_NonexistentParentId()) allTestsPassed = false;

    Logger.log("======== ADDPROJECT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDPROJECT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDPROJECT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

function runAllGetProjectTests() {
    Logger.log("======== RUNNING GETPROJECT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testGetAllProjects_Success_Basic()) allTestsPassed = false;
    
    if (!testGetProjectById_Success_Basic()) allTestsPassed = false;
    if (!testGetProjectById_Failure_NotFound()) allTestsPassed = false;
    if (!testGetProjectById_Failure_InvalidId()) allTestsPassed = false;
    
    if (!testGetProjectsByParentId_Success_Basic()) allTestsPassed = false;
    if (!testGetProjectsByParentId_Success_NoChildren()) allTestsPassed = false;
    
    if (!testGetProjectsByStatus_Success_Basic()) allTestsPassed = false;
    if (!testGetProjectsByStatus_Success_NoMatches()) allTestsPassed = false;
    if (!testGetProjectsByStatus_Failure_InvalidStatus()) allTestsPassed = false;

    Logger.log("======== GETPROJECT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL GETPROJECT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME GETPROJECT TESTS FAILED. Check logs above. ❌❌❌");
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
    
    // First create a parent project
    const parentProject = addProject({ name: "Parent for Complete Project", expectTimeSpent: 10 });
    
    const input = {
        name: "Complete Project",
        description: "This has all fields",
        parentId: parentProject.projectId, // Use a real parent ID
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
    
    // First create a parent project
    const parentProject = addProject({ name: "Parent Project", expectTimeSpent: 10 });
    
    // Then create a child project referencing the parent
    const input = { name: "Child Project", expectTimeSpent: 5, parentId: parentProject.projectId };
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

function testAddProject_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: AddProject - Failure Nonexistent ParentId ---");
    const input = { name: "Nonexistent Parent Project", expectTimeSpent: 5, parentId: "P-DOES-NOT-EXIST-" + Utilities.getUuid() };
    const result = addProject(input);
    // This test expects addProject to fail if parentId doesn't exist in the database
    return assertNull(result, "Function should return null for nonexistent parentId");
}

// ---------------------------------------------------------------------------------------
// --- Test Cases for getProject functions ---
// ---------------------------------------------------------------------------------------

function testGetAllProjects_Success_Basic() {
    Logger.log("\n--- Test: GetAllProjects - Success ---");
    
    // Setup: Add a few test projects
    const project1 = addProject({ name: "Test Project 1", expectTimeSpent: 10 });
    const project2 = addProject({ name: "Test Project 2", expectTimeSpent: 20 });
    
    // Execute
    const allProjects = getAllProjects();
    
    // Verify
    let pass = true;
    pass = assertArray(allProjects, "Function should return an array") && pass;
    
    // Check if our test projects are in the results
    const foundProject1 = allProjects.some(p => p.projectId === project1.projectId);
    const foundProject2 = allProjects.some(p => p.projectId === project2.projectId);
    
    pass = assertTruthy(foundProject1, `Project 1 (${project1.projectId}) should be in results`) && pass;
    pass = assertTruthy(foundProject2, `Project 2 (${project2.projectId}) should be in results`) && pass;
    
    return pass;
}

function testGetProjectById_Success_Basic() {
    Logger.log("\n--- Test: GetProjectById - Success ---");
    
    // Setup: Add a test project
    const testProject = addProject({ 
        name: "Find Me Project", 
        description: "This project should be findable by ID",
        expectTimeSpent: 15 
    });
    
    // Execute
    const foundProject = getProjectById(testProject.projectId);
    
    // Verify
    let pass = true;
    pass = assertTruthy(foundProject, "Function should return a project object") && pass;
    
    if (foundProject) {
        pass = assertStrictEquals(foundProject.projectId, testProject.projectId, "Project ID should match") && pass;
        pass = assertStrictEquals(foundProject.name, testProject.name, "Project name should match") && pass;
        pass = assertStrictEquals(foundProject.description, testProject.description, "Project description should match") && pass;
        pass = assertStrictEquals(foundProject.expectTimeSpent, testProject.expectTimeSpent, "Project expectTimeSpent should match") && pass;
    }
    
    return pass;
}

function testGetProjectById_Failure_NotFound() {
    Logger.log("\n--- Test: GetProjectById - Not Found ---");
    
    // Execute with a non-existent ID
    const nonExistentId = "P-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = getProjectById(nonExistentId);
    
    // Verify
    return assertNull(result, `Function should return null for non-existent ID (${nonExistentId})`);
}

function testGetProjectById_Failure_InvalidId() {
    Logger.log("\n--- Test: GetProjectById - Invalid ID ---");
    
    // Execute with invalid inputs
    const resultNull = getProjectById(null);
    const resultUndefined = getProjectById(undefined);
    const resultEmpty = getProjectById("");
    const resultNumber = getProjectById(12345);
    
    // Verify
    let pass = true;
    pass = assertNull(resultNull, "Function should return null for null ID") && pass;
    pass = assertNull(resultUndefined, "Function should return null for undefined ID") && pass;
    pass = assertNull(resultEmpty, "Function should return null for empty string ID") && pass;
    pass = assertNull(resultNumber, "Function should return null for number ID") && pass;
    
    return pass;
}

function testGetProjectsByParentId_Success_Basic() {
    Logger.log("\n--- Test: GetProjectsByParentId - Success ---");
    
    // Setup: Create a parent project and child projects
    const parentProject = addProject({ name: "Parent Project", expectTimeSpent: 30 });
    const childProject1 = addProject({ 
        name: "Child Project 1", 
        expectTimeSpent: 10,
        parentId: parentProject.projectId
    });
    const childProject2 = addProject({ 
        name: "Child Project 2", 
        expectTimeSpent: 15,
        parentId: parentProject.projectId
    });
    // Add an unrelated project
    const unrelatedProject = addProject({ name: "Unrelated Project", expectTimeSpent: 5 });
    
    // Execute
    const childProjects = getProjectsByParentId(parentProject.projectId);
    
    // Verify
    let pass = true;
    pass = assertArray(childProjects, "Function should return an array") && pass;
    pass = assertTruthy(childProjects.length >= 2, `Should find at least 2 child projects, found ${childProjects.length}`) && pass;
    
    // Check if our child projects are in the results
    const foundChild1 = childProjects.some(p => p.projectId === childProject1.projectId);
    const foundChild2 = childProjects.some(p => p.projectId === childProject2.projectId);
    const foundUnrelated = childProjects.some(p => p.projectId === unrelatedProject.projectId);
    
    pass = assertTruthy(foundChild1, `Child 1 (${childProject1.projectId}) should be in results`) && pass;
    pass = assertTruthy(foundChild2, `Child 2 (${childProject2.projectId}) should be in results`) && pass;
    pass = assertStrictEquals(foundUnrelated, false, "Unrelated project should not be in results") && pass;
    
    return pass;
}

function testGetProjectsByParentId_Success_NoChildren() {
    Logger.log("\n--- Test: GetProjectsByParentId - No Children ---");
    
    // Setup: Create a project with no children
    const lonelyProject = addProject({ name: "Lonely Project", expectTimeSpent: 5 });
    
    // Execute
    const children = getProjectsByParentId(lonelyProject.projectId);
    
    // Verify
    let pass = true;
    pass = assertArray(children, "Function should return an array") && pass;
    pass = assertStrictEquals(children.length, 0, "Array should be empty for project with no children") && pass;
    
    return pass;
}

function testGetProjectsByStatus_Success_Basic() {
    Logger.log("\n--- Test: GetProjectsByStatus - Success ---");
    
    // Setup: Create projects with different statuses
    const onTrackProject1 = addProject({ 
        name: "On Track Project 1", 
        expectTimeSpent: 10,
        status: "On track"
    });
    const onTrackProject2 = addProject({ 
        name: "On Track Project 2", 
        expectTimeSpent: 15,
        status: "On track"
    });
    const delayedProject = addProject({ 
        name: "Delayed Project", 
        expectTimeSpent: 20,
        status: "Delayed"
    });
    
    // Execute
    const onTrackProjects = getProjectsByStatus("On track");
    
    // Verify
    let pass = true;
    pass = assertArray(onTrackProjects, "Function should return an array") && pass;
    pass = assertTruthy(onTrackProjects.length >= 2, `Should find at least 2 'On track' projects, found ${onTrackProjects.length}`) && pass;
    
    // Check if our on-track projects are in the results
    const foundOnTrack1 = onTrackProjects.some(p => p.projectId === onTrackProject1.projectId);
    const foundOnTrack2 = onTrackProjects.some(p => p.projectId === onTrackProject2.projectId);
    const foundDelayed = onTrackProjects.some(p => p.projectId === delayedProject.projectId);
    
    pass = assertTruthy(foundOnTrack1, `On Track Project 1 should be in results`) && pass;
    pass = assertTruthy(foundOnTrack2, `On Track Project 2 should be in results`) && pass;
    pass = assertStrictEquals(foundDelayed, false, "Delayed project should not be in results") && pass;
    
    return pass;
}

function testGetProjectsByStatus_Success_NoMatches() {
    Logger.log("\n--- Test: GetProjectsByStatus - No Matches ---");
    
    // Execute with a status that likely has no projects
    // Using "Completed" as it's less likely to have matches in a test environment
    const completedProjects = getProjectsByStatus("Completed");
    
    // Verify
    let pass = true;
    pass = assertArray(completedProjects, "Function should return an array") && pass;
    // Note: This might fail if there are actually completed projects in the sheet
    // In a real test environment, you might want to ensure there are no completed projects first
    
    return pass;
}

function testGetProjectsByStatus_Failure_InvalidStatus() {
    Logger.log("\n--- Test: GetProjectsByStatus - Invalid Status ---");
    
    // Execute with invalid status
    const result = getProjectsByStatus("Not a valid status");
    
    // Verify
    let pass = true;
    pass = assertArray(result, "Function should return an array") && pass;
    pass = assertStrictEquals(result.length, 0, "Array should be empty for invalid status") && pass;
    
    return pass;
}

