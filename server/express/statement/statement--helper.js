async function addStatement(pgQuery, query) {
    const res = await pgQuery(query)
    return res.rows
}

async function isRepeated(dataSet,db) {
    console.log('==> Checking Database Step 1')
    const range = []
    const submitedDateRange = dataSet.map(({date,description,withdrawn_amount}, index) => {
        if(index == 0) {
            range.push(date.replace('/','-').replace('/','-'))
        }else if(index == dataSet.length - 1) {
            range.push(date.replace('/','-').replace('/','-'))
        }
        const dataSetKey = `${date.replace('/','-').replace('/','-')}${description}$${withdrawn_amount}`
        return dataSetKey
    })
    console.log('==> Step 2 Confirming')
    // 2. Scan statement database using the extracted data
    const dateRange = dataSet.length == 1 ?
    await db(`SELECT TO_CHAR(statement.date :: DATE, 'MM-DD-YYYY') AS date, description, withdrawn_amount FROM statement WHERE date = $1`, [dataSet[0].date]) :
    await db(`SELECT TO_CHAR(statement.date :: DATE, 'MM-DD-YYYY') AS date, description, withdrawn_amount FROM statement WHERE date BETWEEN '${range[0]}'::DATE AND '${range[1]}'::DATE`)
    
    let repeatedItems = 0
    const repeatedItemsIndex = []
    const nonRepeatedItems = []
    for(let i = 0; i < dateRange.rows.length; i++) {
        const {date,description,withdrawn_amount} = dateRange.rows[i]
        const dbRange = `${date.replace('/','-').replace('/','-')}${description}${withdrawn_amount == '$0.00' ? '$0' : withdrawn_amount}`
        
        if(submitedDateRange[i] === dbRange) {
            repeatedItems ++
            repeatedItemsIndex.push(i)
        }
    }

    return {
        repeatedItems,
        repeatedItemsIndex
    }
}

function parse (statement) {
    const ar = statement.slice(statement.indexOf('\n') + 1).split('\n')
    const ar2 = ar.map(e => {
        
        if(e){
            let r = undefined
            if(e.includes(',,')) {
                r = e.replace(',,',',0,')
            } else {
                r = e
            }
            return r
        }

    })
    const ar3 = ar2.filter(e => e && e)

    const ar4 = ar3.map(e => {
        return {
            date: e.split(',')[0],
            description:  e.split(',')[1].replace("'",""),
            widthdrawn_amount:  e.split(',')[2],
            deposited_amount:  e.split(',')[3],
            balance_amount:  e.split(',')[4],
        }
    })
    return ar4
}

function convertToInsertToStatement (parsedStatement, statement_type, statement_owner) {
    let base =`INSERT INTO statement (date, description, withdrawn_amount, deposited_amount, statement_type, transaction_purpose, statement_owner, balance_amount) VALUES \n`
    parsedStatement.map((e,i) => {
        const d = `to_date('${e.date.replace("/","-").replace("/","-")}','MM-DD-YYYY')`
        const st = `${statement_type == 'credit' ? 'credit' : 'debit'}`
        base = base.concat( `(${d}, '${e.description}', ${e.withdrawn_amount}, ${e.deposited_amount}, '${st}', '${e.transaction_purpose}', '${statement_owner}', ${e.balance_amount})${i == parsedStatement.length - 1? ' returning *' : ','} \n` )
    })
    return base.trim()
}

function getInsertIntoStatementQuery (raw, type) {
    return convertToInsertToStatement(parse(raw), type)
}

module.exports = {
    addStatement,
    getInsertIntoStatementQuery,
    parse,
    convertToInsertToStatement,
    isRepeated
}