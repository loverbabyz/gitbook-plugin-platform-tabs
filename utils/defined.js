/**
 * Check if a value is defined (not null and not undefined)
 */
function defined(value) {
    return value !== null && value !== undefined;
}

module.exports = defined;
