require("dotenv").config();

const expenses = {
  rent: 1140,
  investments: 1500,
  groceries: 675,
  bills: 270,
  subscriptions: 22,
  taxes: 1200,
};

function main(amount = 0) {
  let availableAmount = (process.env.AVAILABLE_VALUE as any) || amount; 
  Object.values(expenses).forEach(expense => {
    availableAmount -= expense;
  })
  return availableAmount;
}

function getAsPercentage(amount = (process.env.AVAILABLE_VALUE as any) ||0, expense=expenses){
  function parsePencentage(_expense:any){
    return ((_expense / amount) * 100)
  }
  const value = {
    rent: parsePencentage(expense.rent),
    investments: parsePencentage(expense.investments),
    groceries: parsePencentage(expense.groceries),
    bills: parsePencentage(expense.bills),
    subscriptions: parsePencentage(expense.subscriptions),
    taxes: parsePencentage(expense.taxes),
    budget: parsePencentage(main(amount)),
  }
  console.log(value);
  return value;
}
getAsPercentage();