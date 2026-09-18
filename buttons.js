let config = $(expression:buttonConfig)
let pageState = $(custom:pageState)
let layers = pageState.layers

let buttons = [[]]
for (let l=length(layers)-1; l>=0; l--) {
    //let page = config.pages[pageState.curPage]
    let layer = layers[l]
    let page = config.pages[layer]

    let groups = arrayMap(page.groups, g => {
        g.group = config.buttonGroups[g.id]
        return g
    })

    for (const g of groups) {
        let colOffset = g.col
        let rowOffset = g.row

        const rows = g.group.buttons
        for (let row = 0; row < length(rows); row++) {
            const rowBtns = rows[row]
            const targetRow = row + rowOffset

            if (buttons[targetRow] == null) {
                buttons[targetRow] = []
            }

            for (let col = 0; col < length(rowBtns); col++) {
                const targetCol = col + colOffset
                const buttonId = rowBtns[col]

                if (buttonId != null) {
                    let btn = config.buttons[buttonId]
                    btn.background = g.group.background
                    if ((g.tag ?? "") != ""){
                        btn.groupTag = g.tag
                    }
                    if ((g.selection ?? "") != ""){
                        btn.groupSelection = parseVariables(g.selection)
                    }
                    if ((g.closeModalOnSelect ?? "") != ""){
                        btn.closeModalOnSelect = parseVariables(g.closeModalOnSelect)
                    }
                    if (btn.selected ?? "" != ""){
                        btn.selected = bool(parseVariables(btn.selected) ?? false)
                    }
                    btn.dimmed = l!=0
                    buttons[targetRow][targetCol] = btn
                }
            }
        }
    }

}

return buttons