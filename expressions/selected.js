let raw = $(local:button).selected
let end = indexOf(raw, ")")

if (end < 0) {
    return bool(parseVariables(raw) ?? false)
}

let val = getVariable(substr(raw, 2, end))
let path = substr(raw, end + 1)

return bool(
    (
        path == ""
            ? val
            : jsonpath(val, concat("$", parseVariables(path)))
    ) ?? false
)