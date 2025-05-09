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

function runAllUpdateProjectTests() {
    Logger.log("======== RUNNING UPDATEPROJECT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testUpdateProject_Success_Basic()) allTestsPassed = false;
    if (!testUpdateProject_Success_AllFields()) allTestsPassed = false;
    if (!testUpdateProject_Success_PartialUpdate()) allTestsPassed = false;
    if (!testUpdateProject_Success_UpdateParentId()) allTestsPassed = false;
    if (!testUpdateProject_Success_ZeroTimes()) allTestsPassed = false;

    if (!testUpdateProject_Failure_InvalidProjectId()) allTestsPassed = false;
    if (!testUpdateProject_Failure_NotFound()) allTestsPassed = false;
    if (!testUpdateProject_Failure_InvalidUpdateData()) allTestsPassed = false;
    if (!testUpdateProject_Failure_NegativeExpectTime()) allTestsPassed = false;
    if (!testUpdateProject_Failure_NegativeTotalTime()) allTestsPassed = false;
    if (!testUpdateProject_Failure_InvalidParentId()) allTestsPassed = false;
    if (!testUpdateProject_Failure_NonexistentParentId()) allTestsPassed = false;
    if (!testUpdateProject_Failure_CircularReference()) allTestsPassed = false;
    if (!testUpdateProject_Failure_CircularReference_WithTask()) allTestsPassed = false;

    Logger.log("======== UPDATEPROJECT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL UPDATEPROJECT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME UPDATEPROJECT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

function runAllDeleteProjectTests() {
    Logger.log("======== RUNNING DELETEPROJECT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    // Basic deletion tests
    // └── Tests simple project deletion
    if (!testDeleteProject_Success_Basic()) allTestsPassed = false;
    if (!testDeleteProject_Failure_InvalidProjectId()) allTestsPassed = false;
    if (!testDeleteProject_Failure_NotFound()) allTestsPassed = false;

    // Parent-child relationship tests
    // └── Tests cascade deletion of projects and their children
    if (!testDeleteProject_Success_WithChildren()) allTestsPassed = false;

    // Tests for removing projects while preserving children
    // └── Tests non-cascade deletion with child preservation
    if (!testRemoveProject_Success_Basic()) allTestsPassed = false;
    if (!testRemoveProject_Success_WithChildren()) allTestsPassed = false;
    if (!testRemoveProject_Failure_InvalidProjectId()) allTestsPassed = false;
    if (!testRemoveProject_Failure_NotFound()) allTestsPassed = false;

    // Tests for removing projects with their events
    // └── Tests deletion of projects and their associated calendar events
    if (!testRemoveProjectWithEvents_Success_Basic()) allTestsPassed = false;
    if (!testRemoveProjectWithEvents_Success_WithChildren()) allTestsPassed = false;
    if (!testRemoveProjectWithEvents_Failure_InvalidProjectId()) allTestsPassed = false;
    if (!testRemoveProjectWithEvents_Failure_NotFound()) allTestsPassed = false;

    Logger.log("======== DELETEPROJECT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL DELETEPROJECT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME DELETEPROJECT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for addProject functions ---
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



// ---------------------------------------------------------------------------------------
// --- Test Cases for updateProject functions ---
// ---------------------------------------------------------------------------------------

function testUpdateProject_Success_Basic() {
    Logger.log("\n--- Test: UpdateProject - Success Basic ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Update",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Update the project
    const updateData = {
        name: "Updated Project Name"
    };
    const result = updateProject(testProject.projectId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.projectId, testProject.projectId, "Project ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, testProject.expectTimeSpent, "ExpectTimeSpent should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateProject_Success_AllFields() {
    Logger.log("\n--- Test: UpdateProject - Success All Fields ---");
    
    // Create a parent project for this test
    const parentProject = addProject({
        name: "Parent for Project Update",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Full Update",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Update all fields
    const updateData = {
        name: "Fully Updated Project",
        description: "Updated description",
        status: "On track",
        expectTimeSpent: 15,
        totalTimeSpent: 5,
        parentId: parentProject.projectId
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.projectId, testProject.projectId, "Project ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.status, updateData.status, "Status should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, updateData.expectTimeSpent, "ExpectTimeSpent should be updated") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, updateData.totalTimeSpent, "TotalTimeSpent should be updated") && pass;
        pass = assertStrictEquals(result.parentId, updateData.parentId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateProject_Success_PartialUpdate() {
    Logger.log("\n--- Test: UpdateProject - Success Partial Update ---");
    
    // Create a test project with all fields
    const testProject = addProject({
        name: "Test Project for Partial Update",
        description: "Original description",
        expectTimeSpent: 10,
        status: "Not yet started"
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Update only description and status
    const updateData = {
        description: "Updated description only",
        status: "On track"
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.projectId, testProject.projectId, "Project ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, testProject.name, "Name should remain unchanged") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.status, updateData.status, "Status should be updated") && pass;
        pass = assertStrictEquals(result.expectTimeSpent, testProject.expectTimeSpent, "ExpectTimeSpent should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateProject_Success_UpdateParentId() {
    Logger.log("\n--- Test: UpdateProject - Success Update ParentId ---");
    
    // Create two parent projects
    const parent1 = addProject({
        name: "Parent 1 for Project",
        expectTimeSpent: 20
    });
    const parent2 = addProject({
        name: "Parent 2 for Project",
        expectTimeSpent: 25
    });
    
    if (!parent1 || !parent2) {
        Logger.log("❌ Failed to create parent projects");
        return false;
    }
    
    // Create a test project with first parent
    const testProject = addProject({
        name: "Test Project for Parent Update",
        expectTimeSpent: 10,
        parentId: parent1.projectId
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Update parent ID
    const updateData = {
        parentId: parent2.projectId
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.projectId, testProject.projectId, "Project ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.parentId, parent2.projectId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateProject_Success_ZeroTimes() {
    Logger.log("\n--- Test: UpdateProject - Success Zero Times ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Zero Times",
        expectTimeSpent: 10,
        totalTimeSpent: 5
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Update to zero times
    const updateData = {
        expectTimeSpent: 0,
        totalTimeSpent: 0
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.expectTimeSpent, 0, "ExpectTimeSpent should be updated to 0") && pass;
        pass = assertStrictEquals(result.totalTimeSpent, 0, "TotalTimeSpent should be updated to 0") && pass;
    }
    return pass;
}

function testUpdateProject_Failure_InvalidProjectId() {
    Logger.log("\n--- Test: UpdateProject - Failure Invalid ProjectId ---");
    
    const updateData = { name: "New Name" };
    const result = updateProject(null, updateData);
    
    return assertNull(result, "Function should return null for invalid project ID");
}

function testUpdateProject_Failure_NotFound() {
    Logger.log("\n--- Test: UpdateProject - Failure Not Found ---");
    
    const nonExistentId = "P-DOES-NOT-EXIST-" + Utilities.getUuid();
    const updateData = { name: "New Name" };
    const result = updateProject(nonExistentId, updateData);
    
    return assertNull(result, "Function should return null for non-existent project ID");
}

function testUpdateProject_Failure_InvalidUpdateData() {
    Logger.log("\n--- Test: UpdateProject - Failure Invalid UpdateData ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Invalid Update",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    const result = updateProject(testProject.projectId, null);
    
    return assertNull(result, "Function should return null for invalid update data");
}

function testUpdateProject_Failure_NegativeExpectTime() {
    Logger.log("\n--- Test: UpdateProject - Failure Negative ExpectTimeSpent ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Negative Time",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    const updateData = {
        expectTimeSpent: -5
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for negative expectTimeSpent");
}

function testUpdateProject_Failure_NegativeTotalTime() {
    Logger.log("\n--- Test: UpdateProject - Failure Negative TotalTimeSpent ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Negative Total Time",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    const updateData = {
        totalTimeSpent: -3
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for negative totalTimeSpent");
}

function testUpdateProject_Failure_InvalidParentId() {
    Logger.log("\n--- Test: UpdateProject - Failure Invalid ParentId ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Invalid Parent",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    const updateData = {
        parentId: 12345 // Invalid type
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for invalid parent ID type");
}

function testUpdateProject_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: UpdateProject - Failure Nonexistent ParentId ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Nonexistent Parent",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    const updateData = {
        parentId: "P-DOES-NOT-EXIST-" + Utilities.getUuid()
    };
    
    const result = updateProject(testProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for non-existent parent ID");
}

function testUpdateProject_Failure_CircularReference() {
    Logger.log("\n--- Test: UpdateProject - Failure Circular Reference ---");
    
    // Create a parent project
    const parentProject = addProject({
        name: "Parent Project for Circular Test",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create a child project
    const childProject = addProject({
        name: "Child Project for Circular Test",
        expectTimeSpent: 10,
        parentId: parentProject.projectId
    });
    
    if (!childProject) {
        Logger.log("❌ Failed to create child project");
        return false;
    }
    
    // Try to make parent project a child of its child (circular reference)
    // Initial structure:    parentProject
    //                         ↓
    //                     childProject
    //
    // Attempted structure: parentProject
    //                         ↓
    //                     childProject
    //                         ↓
    //                     parentProject (circular!)
    
    const updateData = {
        parentId: childProject.projectId
    };
    
    const result = updateProject(parentProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for circular reference");
}

function testUpdateProject_Failure_CircularReference_WithTask() {
    Logger.log("\n--- Test: UpdateProject - Failure Circular Reference With Task ---");
    
    // Create a parent project
    const parentProject = addProject({
        name: "Parent Project for Task Circular Test",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create a task under the project
    const task = addTask({
        name: "Task for Circular Test",
        expectTimeSpent: 10,
        parentId: parentProject.projectId
    });
    
    if (!task) {
        Logger.log("❌ Failed to create task");
        return false;
    }
    
    // Create a child project under the task
    const childProject = addProject({
        name: "Child Project for Task Circular Test",
        expectTimeSpent: 5,
        parentId: task.taskId
    });
    
    if (!childProject) {
        Logger.log("❌ Failed to create child project");
        return false;
    }
    
    // Try to make parent project a child of the child project (circular reference)
    // Initial structure:    parentProject
    //                         ↓
    //                        task
    //                         ↓
    //                     childProject
    //
    // Attempted structure: parentProject
    //                         ↓
    //                        task
    //                         ↓
    //                     childProject
    //                         ↓
    //                     parentProject (circular!)
    
    const updateData = {
        parentId: childProject.projectId
    };
    
    const result = updateProject(parentProject.projectId, updateData);
    
    return assertNull(result, "Function should return null for circular reference through task");
}



// ---------------------------------------------------------------------------------------
// --- Test Cases for deleteProject functions ---
// ---------------------------------------------------------------------------------------

function testDeleteProject_Success_Basic() {
    Logger.log("\n--- Test: DeleteProject - Success Basic ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Delete",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Delete the project
    const result = deleteProject(testProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful deletion") && pass;
    
    // Verify the project is actually deleted
    const deletedProject = getProjectById(testProject.projectId);
    pass = assertNull(deletedProject, "Project should no longer exist in the database") && pass;
    
    return pass;
}

function testDeleteProject_Success_WithChildren() {
    Logger.log("\n--- Test: DeleteProject - Success With Children ---");
    
    // Create a parent project
    const parentProject = addProject({
        name: "Parent Project for Delete",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create child projects
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
    
    // Create tasks under the parent
    const task1 = addTask({
        name: "Task 1",
        expectTimeSpent: 5,
        parentId: parentProject.projectId
    });
    
    const task2 = addTask({
        name: "Task 2",
        expectTimeSpent: 8,
        parentId: parentProject.projectId
    });
    
    // Create events for the parent and children
    const parentEvent = addCalendarEvent({
        name: "Parent Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: parentProject.projectId
    });
    
    const childEvent = addCalendarEvent({
        name: "Child Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: childProject1.projectId
    });
    
    // Delete the parent project
    const result = deleteProject(parentProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful deletion") && pass;
    
    // Verify everything is deleted
    pass = assertNull(getProjectById(parentProject.projectId), "Parent project should be deleted") && pass;
    pass = assertNull(getProjectById(childProject1.projectId), "Child project 1 should be deleted") && pass;
    pass = assertNull(getProjectById(childProject2.projectId), "Child project 2 should be deleted") && pass;
    pass = assertNull(getTaskById(task1.taskId), "Task 1 should be deleted") && pass;
    pass = assertNull(getTaskById(task2.taskId), "Task 2 should be deleted") && pass;
    pass = assertNull(getEventById(parentEvent.eventId), "Parent event should be deleted") && pass;
    pass = assertNull(getEventById(childEvent.eventId), "Child event should be deleted") && pass;
    
    return pass;
}

function testDeleteProject_Failure_InvalidProjectId() {
    Logger.log("\n--- Test: DeleteProject - Failure Invalid ProjectId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = deleteProject(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testDeleteProject_Failure_NotFound() {
    Logger.log("\n--- Test: DeleteProject - Failure Not Found ---");
    
    const nonExistentId = "P-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = deleteProject(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent project ID");
}

function testRemoveProject_Success_Basic() {
    Logger.log("\n--- Test: RemoveProject - Success Basic ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Remove",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Remove the project
    const result = removeProject(testProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify the project is actually removed
    const removedProject = getProjectById(testProject.projectId);
    pass = assertNull(removedProject, "Project should no longer exist in the database") && pass;
    
    return pass;
}

function testRemoveProject_Success_WithChildren() {
    Logger.log("\n--- Test: RemoveProject - Success With Children ---");
    
    // Create a parent project
    const parentProject = addProject({
        name: "Parent Project for Remove",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create child projects
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
    
    // Create tasks under the parent
    const task1 = addTask({
        name: "Task 1",
        expectTimeSpent: 5,
        parentId: parentProject.projectId
    });
    
    const task2 = addTask({
        name: "Task 2",
        expectTimeSpent: 8,
        parentId: parentProject.projectId
    });
    
    // Remove the parent project
    const result = removeProject(parentProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify parent is removed but children are preserved
    pass = assertNull(getProjectById(parentProject.projectId), "Parent project should be removed") && pass;
    
    // Verify children still exist but have no parent
    const updatedChild1 = getProjectById(childProject1.projectId);
    const updatedChild2 = getProjectById(childProject2.projectId);
    const updatedTask1 = getTaskById(task1.taskId);
    const updatedTask2 = getTaskById(task2.taskId);
    
    pass = assertTruthy(updatedChild1, "Child project 1 should still exist") && pass;
    pass = assertTruthy(updatedChild2, "Child project 2 should still exist") && pass;
    pass = assertTruthy(updatedTask1, "Task 1 should still exist") && pass;
    pass = assertTruthy(updatedTask2, "Task 2 should still exist") && pass;
    
    if (updatedChild1) pass = assertNull(updatedChild1.parentId, "Child project 1 should have no parent") && pass;
    if (updatedChild2) pass = assertNull(updatedChild2.parentId, "Child project 2 should have no parent") && pass;
    if (updatedTask1) pass = assertNull(updatedTask1.parentId, "Task 1 should have no parent") && pass;
    if (updatedTask2) pass = assertNull(updatedTask2.parentId, "Task 2 should have no parent") && pass;
    
    return pass;
}

function testRemoveProject_Failure_InvalidProjectId() {
    Logger.log("\n--- Test: RemoveProject - Failure Invalid ProjectId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = removeProject(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testRemoveProject_Failure_NotFound() {
    Logger.log("\n--- Test: RemoveProject - Failure Not Found ---");
    
    const nonExistentId = "P-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = removeProject(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent project ID");
}

function testRemoveProjectWithEvents_Success_Basic() {
    Logger.log("\n--- Test: RemoveProjectWithEvents - Success Basic ---");
    
    // Create a test project
    const testProject = addProject({
        name: "Test Project for Remove With Events",
        expectTimeSpent: 10
    });
    
    if (!testProject) {
        Logger.log("❌ Failed to create test project");
        return false;
    }
    
    // Create events for the project
    const event1 = addCalendarEvent({
        name: "Event 1",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: testProject.projectId
    });
    
    const event2 = addCalendarEvent({
        name: "Event 2",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 7200000),
        parentId: testProject.projectId
    });
    
    // Remove the project with its events
    const result = removeProjectWithEvents(testProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify project and its events are removed
    pass = assertNull(getProjectById(testProject.projectId), "Project should be removed") && pass;
    pass = assertNull(getEventById(event1.eventId), "Event 1 should be removed") && pass;
    pass = assertNull(getEventById(event2.eventId), "Event 2 should be removed") && pass;
    
    return pass;
}

function testRemoveProjectWithEvents_Success_WithChildren() {
    Logger.log("\n--- Test: RemoveProjectWithEvents - Success With Children ---");
    
    // Create a parent project
    const parentProject = addProject({
        name: "Parent Project for Remove With Events",
        expectTimeSpent: 20
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create child project
    const childProject = addProject({
        name: "Child Project",
        expectTimeSpent: 10,
        parentId: parentProject.projectId
    });
    
    // Create events for parent and child
    const parentEvent = addCalendarEvent({
        name: "Parent Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: parentProject.projectId
    });
    
    const childEvent = addCalendarEvent({
        name: "Child Event",
        eventStart: new Date(),
        eventEnd: new Date(Date.now() + 3600000),
        parentId: childProject.projectId
    });
    
    // Remove the parent project with its events
    const result = removeProjectWithEvents(parentProject.projectId);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return true for successful removal") && pass;
    
    // Verify parent and its events are removed, but child and its events remain
    pass = assertNull(getProjectById(parentProject.projectId), "Parent project should be removed") && pass;
    pass = assertNull(getEventById(parentEvent.eventId), "Parent event should be removed") && pass;
    
    // Verify child project and its event still exist
    const updatedChild = getProjectById(childProject.projectId);
    const updatedChildEvent = getEventById(childEvent.eventId);
    
    pass = assertTruthy(updatedChild, "Child project should still exist") && pass;
    pass = assertTruthy(updatedChildEvent, "Child event should still exist") && pass;
    
    if (updatedChild) pass = assertNull(updatedChild.parentId, "Child project should have no parent") && pass;
    
    return pass;
}

function testRemoveProjectWithEvents_Failure_InvalidProjectId() {
    Logger.log("\n--- Test: RemoveProjectWithEvents - Failure Invalid ProjectId ---");
    
    // Test with various invalid IDs
    const invalidIds = [null, undefined, 123, "", "   ", "invalid-format"];
    let pass = true;
    
    for (const invalidId of invalidIds) {
        const result = removeProjectWithEvents(invalidId);
        pass = assertStrictEquals(result, false, `Function should return false for invalid ID: ${invalidId}`) && pass;
    }
    
    return pass;
}

function testRemoveProjectWithEvents_Failure_NotFound() {
    Logger.log("\n--- Test: RemoveProjectWithEvents - Failure Not Found ---");
    
    const nonExistentId = "P-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = removeProjectWithEvents(nonExistentId);
    
    return assertStrictEquals(result, false, "Function should return false for non-existent project ID");
}
