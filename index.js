class Expense{
    constructor(name){
        this.name = name;
        this.expenseTypes = [];
    }
//expense and type. Type is either transaction expense, investments expense or savings expense
    addExpense(name, expenseDescription){
        this.expenseTypes.push(new ExpenseType(name,expenseDescription));
    }
}
//expense description is the reason for transaction or expense. Like vacation fund, college fund, bill payment
class ExpenseType{
    constructor(name, expenseDescription){
        this.name = name;
        this.expenseDescription = this.expenseDescription;
    }
}
//check root url. Ask if its correct
class ExpenseService{
    static url = 'https://6408aaf72f01352a8a9a1f28.mockapi.io/expenses';

    static getAllExpenses(){
        return $.get(this.url);
    }

    static getSpecificExpense(id){
        return $.get(this.url +`/${id}`);
    }

    static createExpense(expense){
        return $.post(this.url, expense);
    }

    static updateExpense(expense){
        return $.ajax({
            url: this.url + `/${expense._id}`,
            dataType: 'json',
            data: JSON.stringify(expense),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteExpense(id){
        return $.ajax({
            url:this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager{
    static expenses;

    //fix arrow function
    static getAllExpenses(){
        ExpenseService.getAllExpenses().then(expenses => this.render(expenses)); 
    }

    static createExpense(name){
        ExpenseService.createExpense(new Expense(name))
        .then(()=>{
            return ExpenseService.getAllExpenses();
        })
        .then((expenses)=> this.render(expenses));
    }

    static deleteExpense(id){
        ExpenseService.deleteExpense(id)
        .then(()=>{
            return ExpenseService.getAllExpenses();
        })
        .then((expenses)=> this.render(expenses));
    }

    static addExpense(id){
        for(let expense of this.expenses){
            if(expense._id == id){
                expense.expenseTypes.push(new ExpenseType($(`#${expense._id}-expenseType-name`).val(), $(`#${expense._id}-expenseType-expenseDescription`).val()));
                ExpenseService.updateExpense(expense)
                    .then(()=>{
                        return ExpenseService.getAllExpenses();
                    })
                    .then((expenses)=> this.render(expenses));
                }
            }
        }
        
//double check this method
    static deleteExpenseType(expenseId, expenseTypeId){
        for(let expense of this.expenses){
            if(expense._id == expenseId){
                for(let expenseType of expense.expenseTypes){
                    if(expenseType._id == expenseTypeId){
                        expense.expenseTypes.splice(expense.expenseTypes.indexOf(expenseType), 1);
                        ExpenseService.updateExpense(expense)
                        .then(()=>{
                            return ExpenseService.getAllExpenses();
                        })
                        .then((expenses) => this.render(expenses));
                    }
                }
            }
        }
    }

    static render(expenses){
        this.expenses = expenses;
        $('#app').empty();
        for(let expense of expenses){
            $('#app').prepend(
                `<div id="${expense._id}" class="card">
                    <div class="card-header">
                        <h2>${expense.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteExpense('${expense._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${expense._id}-expenseType-name" class="form-control" placeholder="Expense Name">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${expense._id}-expenseType-expenseDescription" class="form-control" placeholder="Expense Description">
                                </div>
                            </div>
                            <button id="${expense._id}-new-expense" onclick="DOMManager.addExpenseType('${expense._id}')" class="btn btn-primary form-control">Add New Expense</button>
                        </div>
                    </div>
                </div><br>`
            );
            for(let expenseType of expense.expenseTypes){
                $(`#${expense._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${expenseType._id}"><strong>Name: </strong> ${expenseType.name}</span>
                    <span id="name-${expenseType._id}"><strong>Expense Description: </strong> ${expenseType.expenseDescription}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteExpenseType('${expense._id}', '${expenseDescription._id}')">Delete Expense</button>`
                )
            }
        }
    }
}

$('#create-new-expense').click(()=>{
    DOMManager.createExpense($('#new-expense-name').val());
    $('#new-expense-name').val('');
});

DOMManager.getAllExpenses();