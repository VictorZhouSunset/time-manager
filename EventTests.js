// --- Test Runner ---
function runAllAddCalendarEventTests() {
    Logger.log("======== RUNNING ADDCALENDAREVENT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testAddCalendarEvent_Success_Basic()) allTestsPassed = false;
    if (!testAddCalendarEvent_Success_AllFields()) allTestsPassed = false;
    if (!testAddCalendarEvent_Success_WithParentId()) allTestsPassed = false;

    if (!testAddCalendarEvent_Failure_MissingName()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_MissingStartTime()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_MissingEndTime()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_EndBeforeStart()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_InvalidParentIdType()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_EmptyParentIdString()) allTestsPassed = false;
    if (!testAddCalendarEvent_Warning_InvalidDescriptionType()) allTestsPassed = false;

    Logger.log("======== ADDCALENDAREVENT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDCALENDAREVENT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDCALENDAREVENT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

// ---------------------------------------------------------------------------------------
// --- Test Cases for addCalendarEvent ---
// ---------------------------------------------------------------------------------------

function testAddCalendarEvent_Success_Basic() {
    Logger.log("\n--- Test: AddCalendarEvent - Success Basic ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
    const input = {
        name: "Basic Event",
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.eventId && result.eventId.startsWith('CE-'), "Result should have an eventId starting with 'CE-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, "", "Description should default to empty string") && pass;
        pass = assertStrictEquals(result.parentId, null, "ParentId should default to null") && pass;
        pass = assertInstanceOf(result.eventStart, Date, "EventStart should be a Date object") && pass;
        pass = assertInstanceOf(result.eventEnd, Date, "EventEnd should be a Date object") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Success_AllFields() {
    Logger.log("\n--- Test: AddCalendarEvent - Success All Fields ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
    const input = {
        name: "Complete Event",
        description: "This event has all fields",
        parentId: "P-DUMMY-PARENT-123",
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.eventId && result.eventId.startsWith('CE-'), "Result should have an eventId starting with 'CE-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, input.description, "Description should match input") && pass;
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
        pass = assertInstanceOf(result.eventStart, Date, "EventStart should be a Date object") && pass;
        pass = assertInstanceOf(result.eventEnd, Date, "EventEnd should be a Date object") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Success_WithParentId() {
    Logger.log("\n--- Test: AddCalendarEvent - Success With ParentId ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000)); // 1 hour later
    const input = {
        name: "Child Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: "T-ANOTHER-DUMMY"
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Failure_MissingName() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing Name ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when name is missing");
}

function testAddCalendarEvent_Failure_MissingStartTime() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing Start Time ---");
    const endTime = new Date();
    const input = {
        name: "Missing Start",
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when eventStart is missing");
}

function testAddCalendarEvent_Failure_MissingEndTime() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing End Time ---");
    const startTime = new Date();
    const input = {
        name: "Missing End",
        eventStart: startTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when eventEnd is missing");
}

function testAddCalendarEvent_Success_EndEqualStart() {
    Logger.log("\n--- Test: AddCalendarEvent - Success End Equal Start ---");
    const startTime = new Date();
    const input = {
        name: "End Equal Start",
        eventStart: startTime,
        eventEnd: startTime
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.eventStart, input.eventStart, "Start time should match input") && pass;
        pass = assertStrictEquals(result.eventEnd, input.eventEnd, "End time should match input") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Failure_EndBeforeStart() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure End Time Before Start Time ---");
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() + (1 * 60 * 60 * 1000)); // Start is 1 hour after end
    const input = {
        name: "Invalid Time Order",
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when end time is before start time");
}

function testAddCalendarEvent_Failure_InvalidParentIdType() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Invalid ParentId Type ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Bad ParentId Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: 12345
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null for non-string parentId if provided");
}

function testAddCalendarEvent_Failure_EmptyParentIdString() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Empty ParentId String ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Empty ParentId Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: "  "
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null for empty string parentId if provided");
}

function testAddCalendarEvent_Warning_InvalidDescriptionType() {
    Logger.log("\n--- Test: AddCalendarEvent - Warning Invalid Description Type ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Desc Type Event",
        eventStart: startTime,
        eventEnd: endTime,
        description: 123
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create event") && pass;
    if (result) {
        pass = assertStrictEquals(result.description, "", "Description should default to empty string for invalid type") && pass;
    }
    return pass;
}
