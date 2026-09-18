let raw = $(local:button).icon
let end = indexOf(raw, ")")

if (end < 0) {
    return parseVariables(raw)
}

let val = getVariable(substr(raw, 2, end))
let path = substr(raw, end + 1)

return path == ""
    ? val
    : jsonpath(val, concat("$", parseVariables(path)))