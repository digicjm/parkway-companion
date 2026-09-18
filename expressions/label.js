let raw = $(local:button).label

// First resolve ordinary Companion variables.
let result = ""
let pos = 0

while (true) {
    let start = indexOf(raw, "${", pos)

    if (start < 0) {
        result = concat(result, substr(raw, pos))
        break
    }

    // Copy text before ${...}
    result = concat(result, substr(raw, pos, start))

    let end = indexOf(raw, "}", start + 2)

    // Invalid/unclosed ${...}; just keep the remainder
    if (end < 0) {
        result = concat(result, substr(raw, start))
        break
    }

    let expr = substr(raw, start + 2, end)
    let varEnd = indexOf(expr, ")")

    let val

    if (indexOf(expr, "$(") == 0 && varEnd >= 0) {

        // "$(expression:foo).bar[0]"
        let varName = substr(expr, 2, varEnd)
        let path = substr(expr, varEnd + 1)

        val = getVariable(varName)

        if (path != "") {
            // Resolves things such as [$(local:row)]
            path = parseVariables(path)
            val = jsonpath(val, concat("$", path))
        }

    } else {
        // Fallback for anything that isn't a variable/path
        val = parseVariables(expr)
    }

    result = concat(result, val ?? "")
    pos = end + 1
}

// Resolve any normal $(...) variables remaining in the text
return parseVariables(result)