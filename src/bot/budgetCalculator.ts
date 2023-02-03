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
  const { chatId, _id, available, income, ...expensesWithouChatId } = expenses;

  Object.values(expensesWithouChatId).forEach(expense => {
    availableAmount -= expense || 0;
  })
  return availableAmount;
}

export function getBudgetAsPercentage(amount = (process.env.AVAILABLE_VALUE as any) || 0, expense = _expenses) {
  function parsePencentage(_expense: any) {
    return ((_expense / amount) * 100).toFixed(2) + "%" + " - " + _expense
  }

  const { chatId, _id, available, income, ...expensesWithouChatId } = expense

  const value = {
    rent: parsePencentage(expensesWithouChatId.rent),
    investments: parsePencentage(expensesWithouChatId.investments),
    groceries: parsePencentage(expensesWithouChatId.groceries),
    bills: parsePencentage(expensesWithouChatId.bills),
    subscriptions: parsePencentage(expensesWithouChatId.subscriptions),
    taxes: parsePencentage(expensesWithouChatId.taxes),
    budget: parsePencentage(getBudget(amount, expense)),
  }

  Object.entries(expensesWithouChatId).forEach(expense => {
    if (expense[0] != 'budget')
      Object.assign(value, {
        [expense[0]]: parsePencentage(expense[1]) + " - " + expense[1]
      })
  })

  return value;
}