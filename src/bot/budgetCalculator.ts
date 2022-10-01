require("dotenv").config();

const _expenses = {
  rent: 1140,
  investments: 1500,
  groceries: 675,
  bills: 270,
  subscriptions: 22,
  taxes: 1200,
  chatId: 0,
  available: 0,
  income: 0,
  _id: "0"
};

export function getBudget(amount = 0, expenses = _expenses) {
  let availableAmount = (process.env.AVAILABLE_VALUE as any) || amount; 
  const { chatId, _id, available, income, ...expensesWithouChatId } = expenses
  Object.values(expensesWithouChatId).forEach(expense => {
    availableAmount -= expense || 0;
  })
  return availableAmount;
}

export function getBudgetAsPercentage(amount = (process.env.AVAILABLE_VALUE as any) ||0, expense = _expenses){
  function parsePencentage(_expense:any){
    return ((_expense / amount) * 100).toFixed(2) + "%"
  }
  const value = {
    rent: parsePencentage(expense.rent),
    investments: parsePencentage(expense.investments),
    groceries: parsePencentage(expense.groceries),
    bills: parsePencentage(expense.bills),
    subscriptions: parsePencentage(expense.subscriptions),
    taxes: parsePencentage(expense.taxes),
    budget: parsePencentage(getBudget(amount)),
  }
  console.log(value);
  return value;
}