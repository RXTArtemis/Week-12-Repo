class Expense{
    constructor(name){
        this.name = name;
        this.expenseType = [];
    }

    addExpense(name, type){
        this.expenseType.push(new ExpenseType(name,type));
    }
}

class ExpenseType{
    constructor(name, type){
        this.name = name;
        this.type = type;
    }
}

class ExpenseService{
    static url = 'https://6408aaf72f01352a8a9a1f28.mockapi.io/';

    static getAllExpenses(){
        return $.get(this.url);
    }

    static getSpecificExpense(id){
        return $.get(this.url +`/${id}` );
    }

    static createExpense(expense){
        return $.post(this.url, expense);
    }

    static updateExpense(expense){
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: 'json',
            data:JSON.stringify(expense),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteExpense(id){
        return $.ajax({
            url:this.url + `/${id}`,
            type: 'Delete'
        });
    }
}

class DOMManager{
    static expenses;

    static getAllExpenses(){
        ExpenseService.getAllExpenses().then(houses => this.render(expenses)); 
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
                expense.expenseTypes.push(new ExpenseType($(`#${expenses._id}-expenseType-name`).val(), $(`#${expenses._id}-expenseType-type`).val()));
                ExpenseService.updateExpense(expense)
                    .then(()=>{
                        return ExpenseService.getAllExpenses();
                    })
                    .then((expenses)=> this.render(expenses));
                }
            }
        }

    static deleteExpense(expenseId, expenseTypeId){
        for(let expense of this.expenses){
            if(expense._id == expenseId){
                for(let expenseType of expense.expenseTypes){
                    if(expenseType._id == expenseTypeId){
                        expense.expenseTypes.splice(expense.expenseTypes.indexOf(room), 1);
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
        this.houses = houses;
        $('app').empty();
        for(let expenses of expenses){
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
                                <input type="text" id="${expense._id}-expenseType-type" class="form-control" placeholder="Expense Type">
                                </div>
                            </div>
                            <button id="${expense._id}-new-expense" onclick="DOMManager.addExpenseType('${expense._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for(let expenseType of expense.expenseTypes){
                $(`#${expense._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${expenseType._id}"><strong>Name: </strong> ${expenseType.name}</span>
                    <span id="name-${expenseType._id}"><strong>Type: </strong> ${expenseType.type}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteExpenseType('${expense._id}', '${expenseType._id}')">Delete Expense</button>
                    </p>`
                )
            }
        }
    }
}

$('#create-new-expense').click(()=>{
    DOMManager.createExpense($('#new-expense-name').val());
    $('#new-expense-name').val('');
})

DOMManager.getAllExpenses();