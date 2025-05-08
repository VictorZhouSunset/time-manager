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