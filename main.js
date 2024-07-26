
// const express = require('express')
// const { writeData, readData } = require('./utils')
// const fs = require('fs/promises')
// const app = express()
// const path = require('path')

// app.use(express.json())
// app.set('view engine', 'ejs')



// app.get('/expenses', async (req, res) => {
//     try {
//         const data = await readData('data.json', true);
//         res.status(200).json(data);
//     } catch (error) {
//         console.log(error);
//     }
// });

// app.post('/expenses/create', async (req, res) => {
//     const { name, price, category, initBalance } = req.body;
//     if (!name || !price || !category) {
//         return res.json({ success: false, data: null, message: "Name, Price, and Category are required" });
//     }

//     try {
//         const data = await readData('data.json', true);
//         const lastId = data[data.length - 1]?.id || 0;

//         const allExpenses = {
//             id: lastId + 1,
//             name,
//             initBalance,
//             expense: [],
//         };

//         const expenseInfoLastId = allExpenses.expense[allExpenses.expense.length - 1]?.id || 0;
//         const newExpense = {
//             price,
//             category,
//             date: new Date().toISOString(),
//             id: expenseInfoLastId + 1
//         };
//         allExpenses.currentBalance = Number(allExpenses.initBalance) - Number(newExpense.price)
//         allExpenses.expense.push(newExpense);
//         data.push(allExpenses);
//         await writeData('data.json', data);
//         res.json({ success: true, message: "Expense created successfully" });

//     } catch (error) {
//         console.log(error);
//     }
// });


// app.put('/expenses/update/:id', async (req, res) => {
//     try {
//         const { id } = req.params
//         const { name, price, category, initBalance } = req.body;
//         const data = await readData('data.json', true)
//         console.log(data)
//         const index = data.findIndex(el => Number(el.id) === Number(id))
//         if (index === -1) return res.json({ success: false, message: "Expense not found" })
//         const newExpense = {
//             price,
//             category,
//             date: new Date().toISOString(),
//             id: data[index].expense.length + 1
//         };
//         if (data[index].currentBalance < newExpense.price) {
//             return res.status(400).json({ success: false, message: "Not enough amount on balance" });
//         }

//         data[index].expense.push(newExpense)
//         const totalAmount = data[index].expense.reduce((acc, el) => acc + Number(el.price), 0);
//         data[index].currentBalance = Number(data[index].initBalance) - totalAmount;
//         await writeData('data.json', data)


//     } catch (error) {
//         console.log(error)
//     }
// })


// app.delete('/expenses/delete/:id', async (req, res) => {
//     try {
//         const { id } = req.params
//         const data = await readData('data.json', true)
//         const index = data.findIndex(el => Number(el.id) === Number(id))
//         if (index === -1) return res.json({ success: false, message: "Expense not found" })
//         const deletedExpense = data.splice(index, 1)
//         await writeData('data.json', data)
//         console.log(deletedExpense, 'deletedExpense')

//     } catch (error) {
//         console.log(error)
//     }
// })


// app.listen(3003, () => {
//     console.log('Server is running on port http://localhost:3003')
// })






const express = require('express')
const { writeData, readData } = require('./utils')
const fs = require('fs/promises')
const app = express()
const path = require('path')

app.use(express.json())
app.set('view engine', 'ejs')



app.get('/expenses', async (req, res) => {
    try {
        const data = await readData('data.json', true);
        res.render(path.join(__dirname, 'views', 'pages', 'home.ejs'), { data })
    } catch (error) {
        console.log(error);
    }
});



app.get('/expenses/create', async (req, res) => {
    try {
        res.render(path.join(__dirname, 'views', 'pages', 'create.ejs'))
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating expense' });
    }
});



app.post('/expenses/create', async (req, res) => {
    const { name, price, category, initBalance } = req.body
    const data = await readData('data.json', true)
    const lastId = data[data.length - 1]?.id || 0;

    const allExpenses = {
        id: lastId + 1,
        name,
        initBalance,
        expense: [],
    };

    const expenseInfoLastId = allExpenses.expense[allExpenses.expense.length - 1]?.id || 0;
    const newExpense = {
        price: Number(price),
        category,
        date: new Date().toISOString(),
        id: expenseInfoLastId + 1
    };
    allExpenses.currentBalance = Number(allExpenses.initBalance) - Number(newExpense.price)
    allExpenses.expense.push(newExpense);
    data.push(allExpenses);
    await writeData('data.json', data);

})



app.get('/expenses/delete/:id', async (req, res) => {
    try {
        const data = await readData('data.json', true)
        const { id } = req.params
        const index = data.findIndex(el => Number(el.id) === Number(id))
        const deletedExpense = data[index]
        res.render(path.join(__dirname, 'views', 'pages', 'delete.ejs'), { deletedExpense })
    } catch (error) {
        console.log(error)
    }
})




app.delete('/expenses/delete/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await readData('data.json', true)
        const index = data.findIndex(el => Number(el.id) === Number(id))
        if (index === -1) return res.json({ success: false, message: "Expense not found" })
        const deletedExpense = data.splice(index, 1)
        await writeData('data.json', data)
        console.log({ success: true, message: deletedExpense})
    } catch (error) {
        console.log(error)
    }
})



app.get('/expenses/update/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await readData('data.json', true)
        const index = data.findIndex(el => Number(el.id) === Number(id))
        if (index === -1) return res.json({ success: false, message: "Expense not found" })
        const expenseForUpdate = data[index]
        res.render(path.join(__dirname, 'views', 'pages', 'update.ejs'), { expenseForUpdate })
    } catch (error) {
        console.log(error)
    }

})



app.put('/expenses/update/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { infoForUpdate } = req.body
        const { price, category } = infoForUpdate
        const data = await readData('data.json', true)
        const index = data.findIndex(el => Number(el.id) === Number(id))
        if (index === -1) return res.json({ success: false, message: "Expense not found" })
        const expenseForUpdate = data[index]
        const newExpense = {
            price,
            category,
            date: new Date().toISOString(),
            id: expenseForUpdate.expense.length + 1
        }
        if (expenseForUpdate.currentBalance < Number(newExpense.price)) {
            return res.status(400).json({ success: false, message: "Not enough amount on balance" });
        }
        expenseForUpdate.expense.push(newExpense)
        const totalAmount = expenseForUpdate.expense.reduce((acc, el) => acc + Number(el.price), 0);
        expenseForUpdate.currentBalance = Number(expenseForUpdate.initBalance) - totalAmount
        data[index] = expenseForUpdate
        await writeData('data.json', data)

    } catch (error) {
        console.log(error)
    }
})


app.listen(3003, () => {
    console.log('Server is running on port http://localhost:3003')
})







