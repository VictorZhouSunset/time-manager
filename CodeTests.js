// --- Test Runner ---
function runAllGetChildrenAndDescendantsTests() {
    Logger.log("======== RUNNING GET CHILDREN AND DESCENDANTS TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testGetChildrenByParentId_Success_NoChildren()) allTestsPassed = false;
    if (!testGetChildrenByParentId_Success_OnlyTasks()) allTestsPassed = false;
    if (!testGetChildrenByParentId_Success_OnlyProjects()) allTestsPassed = false;
    if (!testGetChildrenByParentId_Success_MixedChildren()) allTestsPassed = false;
    if (!testGetChildrenByParentId_Failure_InvalidParentId()) allTestsPassed = false;

    if (!testGetAllDescendantsByParentId_Success_NoDescendants()) allTestsPassed = false;
    if (!testGetAllDescendantsByParentId_Success_OneLevelDeep()) allTestsPassed = false;
    if (!testGetAllDescendantsByParentId_Success_MultiLevelDeep()) allTestsPassed = false;
    if (!testGetAllDescendantsByParentId_Failure_InvalidParentId()) allTestsPassed = false;

    Logger.log("======== CODE TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL CODE TESTS PASSED! 🎉🎉🎉");
        // Clean up test data only if all tests passed
        cleanupTestData();
    } else {
        Logger.log("❌❌❌ SOME CODE TESTS FAILED. Check logs above. ❌❌❌");
        Logger.log("⚠️ Test data cleanup skipped to preserve failed test context");
    }
    return allTestsPassed;
}

// --- Individual Test Cases ---

// ---------------------------------------------------------------------------------------
// --- Test Cases for getChildrenByParentId and getAllDescendantsByParentId ---
// ---------------------------------------------------------------------------------------

function testGetChildrenByParentId_Success_NoChildren() {
    Logger.log("\n--- Test: GetChildrenByParentId - Success No Children ---");
    
    // Create an empty parent project with no children
    const parentProject = registerTestProject(addProject({ 
        name: "Parent Project with No Children", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test parent project");
        return false;
    }
    
    const result = getChildrenByParentId(parentProject.projectId);
    let pass = true;

    // Test structure
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;
    pass = assertFunction(result.getAllChildren, "getAllChildren should be a function") && pass;
    pass = assertFunction(result.getChildCount, "getChildCount should be a function") && pass;

    // Test empty results
    pass = assertStrictEquals(result.projects.length, 0, "Projects array should be empty") && pass;
    pass = assertStrictEquals(result.tasks.length, 0, "Tasks array should be empty") && pass;
    pass = assertStrictEquals(result.getChildCount(), 0, "Child count should be 0") && pass;
    pass = assertStrictEquals(result.getAllChildren().length, 0, "getAllChildren should return empty array") && pass;

    return pass;
}

function testGetChildrenByParentId_Success_OnlyTasks() {
    Logger.log("\n--- Test: GetChildrenByParentId - Success Only Tasks ---");
    
    // Create a parent project for tasks
    const parentProject = registerTestProject(addProject({ 
        name: "Parent Project for Tasks Only", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test parent project");
        return false;
    }
    
    const task1 = registerTestTask(addTask({ 
        name: "Child Task 1 for OnlyTasks", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 1 
    }));
    const task2 = registerTestTask(addTask({ 
        name: "Child Task 2 for OnlyTasks", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 2 
    }));

    let pass = true;
    if (!task1 || !task2) {
        Logger.log("  ❌ FAIL: Failed to create test tasks for testGetChildrenByParentId_Success_OnlyTasks");
        return false;
    }

    const result = getChildrenByParentId(parentProject.projectId);

    // Test structure
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;

    // Test counts
    pass = assertStrictEquals(result.projects.length, 0, "Projects array should be empty") && pass;
    pass = assertStrictEquals(result.tasks.length, 2, "Tasks array should have 2 items") && pass;
    pass = assertStrictEquals(result.getChildCount(), 2, "Child count should be 2") && pass;

    // Test content (check if task IDs are present)
    if (result.tasks.length === 2) {
        const taskIds = result.tasks.map(t => t.taskId);
        pass = assertTruthy(taskIds.includes(task1.taskId), "Task 1 ID should be present") && pass;
        pass = assertTruthy(taskIds.includes(task2.taskId), "Task 2 ID should be present") && pass;
    }

    // Test getAllChildren sorting
    const allChildren = result.getAllChildren();
    pass = assertStrictEquals(allChildren.length, 2, "getAllChildren should return 2 items") && pass;
    if (allChildren.length === 2) {
        pass = assertTruthy(
            allChildren[0].createdAt <= allChildren[1].createdAt,
            "Children should be sorted by createdAt"
        ) && pass;
    }

    return pass;
}

function testGetChildrenByParentId_Success_OnlyProjects() {
    Logger.log("\n--- Test: GetChildrenByParentId - Success Only Projects ---");
    
    // Create a parent project for child projects
    const parentProject = registerTestProject(addProject({ 
        name: "Parent Project for Projects Only", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test parent project");
        return false;
    }
    
    const project1 = registerTestProject(addProject({ 
        name: "Child Project 1 for OnlyProjects", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 1 
    }));
    const project2 = registerTestProject(addProject({ 
        name: "Child Project 2 for OnlyProjects", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 2 
    }));

    let pass = true;
    if (!project1 || !project2) {
        Logger.log("  ❌ FAIL: Failed to create test projects for testGetChildrenByParentId_Success_OnlyProjects");
        return false;
    }

    const result = getChildrenByParentId(parentProject.projectId);

    // Test structure
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;

    // Test counts
    pass = assertStrictEquals(result.projects.length, 2, "Projects array should have 2 items") && pass;
    pass = assertStrictEquals(result.tasks.length, 0, "Tasks array should be empty") && pass;
    pass = assertStrictEquals(result.getChildCount(), 2, "Child count should be 2") && pass;

    // Test content (check if project IDs are present)
    if (result.projects.length === 2) {
        const projectIds = result.projects.map(p => p.projectId);
        pass = assertTruthy(projectIds.includes(project1.projectId), "Project 1 ID should be present") && pass;
        pass = assertTruthy(projectIds.includes(project2.projectId), "Project 2 ID should be present") && pass;
    }
    
    // Test getAllChildren sorting
    const allChildren = result.getAllChildren();
    pass = assertStrictEquals(allChildren.length, 2, "getAllChildren should return 2 items") && pass;
    if (allChildren.length === 2) {
        pass = assertTruthy(
            allChildren[0].createdAt <= allChildren[1].createdAt,
            "Children should be sorted by createdAt"
        ) && pass;
    }

    return pass;
}

function testGetChildrenByParentId_Success_MixedChildren() {
    Logger.log("\n--- Test: GetChildrenByParentId - Success Mixed Children ---");
    
    // Create a parent project for mixed children
    const parentProject = registerTestProject(addProject({ 
        name: "Parent Project for Mixed Children", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test parent project");
        return false;
    }
    
    const testProject = registerTestProject(addProject({
        name: "Test Child Project",
        parentId: parentProject.projectId,
        expectTimeSpent: 1
    }));
    const testTask = registerTestTask(addTask({
        name: "Test Child Task",
        parentId: parentProject.projectId,
        expectTimeSpent: 1
    }));

    let pass = true;
    if (!testProject || !testTask) {
        Logger.log("  ❌ FAIL: Failed to create test children");
        return false;
    }

    const result = getChildrenByParentId(parentProject.projectId);

    // Test structure and counts
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertStrictEquals(result.projects.length, 1, "Should have one project") && pass;
    pass = assertStrictEquals(result.tasks.length, 1, "Should have one task") && pass;
    pass = assertStrictEquals(result.getChildCount(), 2, "Total child count should be 2") && pass;

    // Test content
    if (result.projects.length > 0) {
        pass = assertStrictEquals(result.projects[0].projectId, testProject.projectId, "Project ID should match") && pass;
    }
    if (result.tasks.length > 0) {
        pass = assertStrictEquals(result.tasks[0].taskId, testTask.taskId, "Task ID should match") && pass;
    }

    // Test getAllChildren sorting
    const allChildren = result.getAllChildren();
    pass = assertStrictEquals(allChildren.length, 2, "getAllChildren should return 2 items") && pass;
    if (allChildren.length === 2) {
        pass = assertTruthy(
            allChildren[0].createdAt <= allChildren[1].createdAt,
            "Children should be sorted by createdAt"
        ) && pass;
    }

    return pass;
}

function testGetChildrenByParentId_Failure_InvalidParentId() {
    Logger.log("\n--- Test: GetChildrenByParentId - Failure Invalid ParentId ---");
    const parentId = "P-INVALID-ID-NO-EXIST";
    const result = getChildrenByParentId(parentId);
    let pass = true;

    // Test structure (should still return the default empty structure)
    pass = assertTruthy(result, "Result should be an object even for invalid ID") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;
    pass = assertFunction(result.getAllChildren, "getAllChildren should be a function") && pass;
    pass = assertFunction(result.getChildCount, "getChildCount should be a function") && pass;

    // Test empty results
    pass = assertStrictEquals(result.projects.length, 0, "Projects array should be empty for invalid ID") && pass;
    pass = assertStrictEquals(result.tasks.length, 0, "Tasks array should be empty for invalid ID") && pass;
    pass = assertStrictEquals(result.getChildCount(), 0, "Child count should be 0 for invalid ID") && pass;
    pass = assertStrictEquals(result.getAllChildren().length, 0, "getAllChildren should return empty array for invalid ID") && pass;

    return pass;
}

function testGetAllDescendantsByParentId_Success_NoDescendants() {
    Logger.log("\n--- Test: GetAllDescendantsByParentId - Success No Descendants ---");
    
    // Create a parent project with no descendants
    const parentProject = registerTestProject(addProject({ 
        name: "Parent With No Kids", 
        parentId: null, 
        expectTimeSpent: 1 
    }));
    
    let pass = true;
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test project for testGetAllDescendantsByParentId_Success_NoDescendants");
        return false;
    }

    const result = getAllDescendantsByParentId(parentProject.projectId);

    // Test structure
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;
    pass = assertFunction(result.getAllDescendants, "getAllDescendants should be a function") && pass;
    pass = assertFunction(result.getDescendantCount, "getDescendantCount should be a function") && pass;

    // Test empty results
    pass = assertStrictEquals(result.projects.length, 0, "Projects array should be empty") && pass;
    pass = assertStrictEquals(result.tasks.length, 0, "Tasks array should be empty") && pass;
    pass = assertStrictEquals(result.getDescendantCount(), 0, "Descendant count should be 0") && pass;
    pass = assertStrictEquals(result.getAllDescendants().length, 0, "getAllDescendants should return empty array") && pass;

    return pass;
}

function testGetAllDescendantsByParentId_Success_OneLevelDeep() {
    Logger.log("\n--- Test: GetAllDescendantsByParentId - Success One Level Deep ---");
    
    // Create a parent project for one level of descendants
    const parentProject = registerTestProject(addProject({ 
        name: "Parent Project for One Level", 
        expectTimeSpent: 10 
    }));
    
    if (!parentProject) {
        Logger.log("  ❌ FAIL: Failed to create test parent project");
        return false;
    }
    
    const childProject = registerTestProject(addProject({ 
        name: "Child Project OneLevel", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 1 
    }));
    const childTask = registerTestTask(addTask({ 
        name: "Child Task OneLevel", 
        parentId: parentProject.projectId, 
        expectTimeSpent: 1 
    }));

    let pass = true;
    if (!childProject || !childTask) {
        Logger.log("  ❌ FAIL: Failed to create test data for testGetAllDescendantsByParentId_Success_OneLevelDeep");
        return false;
    }
    // Ensure these children do not have their own children for this specific test

    const result = getAllDescendantsByParentId(parentProject.projectId);

    // Test structure
    pass = assertTruthy(result, "Result should be an object") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;

    // Test counts
    pass = assertStrictEquals(result.projects.length, 1, "Should have one descendant project") && pass;
    pass = assertStrictEquals(result.tasks.length, 1, "Should have one descendant task") && pass;
    pass = assertStrictEquals(result.getDescendantCount(), 2, "Total descendant count should be 2") && pass;

    // Test content
    if (result.projects.length > 0) {
        pass = assertStrictEquals(result.projects[0].projectId, childProject.projectId, "Descendant project ID should match") && pass;
    }
    if (result.tasks.length > 0) {
        pass = assertStrictEquals(result.tasks[0].taskId, childTask.taskId, "Descendant task ID should match") && pass;
    }

    // Test getAllDescendants sorting
    const allDescendants = result.getAllDescendants();
    pass = assertStrictEquals(allDescendants.length, 2, "getAllDescendants should return 2 items") && pass;
    if (allDescendants.length === 2) {
        pass = assertTruthy(
            allDescendants[0].createdAt <= allDescendants[1].createdAt,
            "Descendants should be sorted by createdAt"
        ) && pass;
    }
    return pass;
}

function testGetAllDescendantsByParentId_Success_MultiLevelDeep() {
    Logger.log("\n--- Test: GetAllDescendantsByParentId - Success Multi Level Deep ---");
    // Create a test hierarchy:
    // rootProject
    //   ├── child1
    //   │   ├── grandchild1 (task)
    //   │   └── grandchild2 (project)
    //   └── child2 (task)
    //       └── grandchild3 (task)

    // Create the root project
    const rootProject = registerTestProject(addProject({ 
        name: "Root Project for Multi-Level", 
        expectTimeSpent: 10 
    }));
    
    if (!rootProject) {
        Logger.log("  ❌ FAIL: Failed to create root project");
        return false;
    }
    
    // Level 1
    const child1 = registerTestProject(addProject({
        name: "Child Project 1",
        parentId: rootProject.projectId,
        expectTimeSpent: 1
    }));
    const child2 = registerTestTask(addTask({
        name: "Child Task 2",
        parentId: rootProject.projectId,
        expectTimeSpent: 1
    }));

    if (!child1 || !child2) {
        Logger.log("  ❌ FAIL: Failed to create level 1 children");
        return false;
    }

    // Level 2
    const grandchild1 = registerTestTask(addTask({
        name: "Grandchild Task 1",
        parentId: child1.projectId,
        expectTimeSpent: 1
    }));
    const grandchild2 = registerTestProject(addProject({
        name: "Grandchild Project 2",
        parentId: child1.projectId,
        expectTimeSpent: 1
    }));
    const grandchild3 = registerTestTask(addTask({
        name: "Grandchild Task 3",
        parentId: child2.taskId,
        expectTimeSpent: 1
    }));

    if (!grandchild1 || !grandchild2 || !grandchild3) {
        Logger.log("  ❌ FAIL: Failed to create level 2 grandchildren");
        return false;
    }

    const result = getAllDescendantsByParentId(rootProject.projectId);
    let pass = true;

    // Test counts
    pass = assertStrictEquals(result.projects.length, 2, "Should have 2 descendant projects") && pass;
    pass = assertStrictEquals(result.tasks.length, 3, "Should have 3 descendant tasks") && pass;
    pass = assertStrictEquals(result.getDescendantCount(), 5, "Total descendant count should be 5") && pass;

    // Test if all items are included
    const allDescendants = result.getAllDescendants();
    pass = assertStrictEquals(allDescendants.length, 5, "getAllDescendants should return 5 items") && pass;

    // Test sorting
    if (allDescendants.length > 1) {
        for (let i = 1; i < allDescendants.length; i++) {
            pass = assertTruthy(
                allDescendants[i-1].createdAt <= allDescendants[i].createdAt,
                "Descendants should be sorted by createdAt"
            ) && pass;
        }
    }

    return pass;
}

function testGetAllDescendantsByParentId_Failure_InvalidParentId() {
    Logger.log("\n--- Test: GetAllDescendantsByParentId - Failure Invalid ParentId ---");
    const parentId = "P-INVALID-ID-NO-DESCENDANTS";
    const result = getAllDescendantsByParentId(parentId);
    let pass = true;

    // Test structure (should still return the default empty structure)
    pass = assertTruthy(result, "Result should be an object even for invalid ID") && pass;
    pass = assertArray(result.projects, "Projects should be an array") && pass;
    pass = assertArray(result.tasks, "Tasks should be an array") && pass;
    pass = assertFunction(result.getAllDescendants, "getAllDescendants should be a function") && pass;
    pass = assertFunction(result.getDescendantCount, "getDescendantCount should be a function") && pass;

    // Test empty results
    pass = assertStrictEquals(result.projects.length, 0, "Projects array should be empty for invalid ID") && pass;
    pass = assertStrictEquals(result.tasks.length, 0, "Tasks array should be empty for invalid ID") && pass;
    pass = assertStrictEquals(result.getDescendantCount(), 0, "Descendant count should be 0 for invalid ID") && pass;
    pass = assertStrictEquals(result.getAllDescendants().length, 0, "getAllDescendants should return empty array for invalid ID") && pass;

    return pass;
} 