const { logger } = require("./util/logger");

const shoppingList = [];

function addItem(name, price) {

  // constructor for new item that will be added
  const newItem = {
    name,
    // uses price from request body
    price: parseFloat(price).toFixed(2),
    purchased: false,
  };
  // push the newItem object into the shopping list array
  shoppingList.push(newItem);
  logger.info(`Added item: ${newItem.name}`);
  return `"${name} has been added to the shopping list!`;
}

function togglePurchased(index) {
  // conditional to check tht the index provided in the request url exists in the current shoppinglist array
  if (index >= 0 && index < shoppingList.length) {
    // if it does, then change the purchased property boolean value of that index to the opposite value 
    shoppingList[index].purchased = !shoppingList[index].purchased;
    logger.info(
      `Toggle Purchased: ${shoppingList[index].name}: ${shoppingList[index].purchased}`
    );
    return `Toggle purchase status of ${shoppingList[index].name}`;
  } else {
    logger.error(`Failed toggled purchase: Index - ${index}`);
    return "Invalid Item Index";
  }
}

function removeItem(index) {
  if (index >= 0 && index < shoppingList.length) {
    const removedItem = shoppingList.splice(index, 1);
    logger.info(`Removed Item: ${removedItem[0].name}`);
    return `${removedItem[0].name} has been removed`;
  } else {
    logger.error(`Failed remove item: Index - ${index}`);
    return "Invalid Item Index";
  }
}

function calculateTotalCost() {
  const totalCost = shoppingList.reduce(
    (sum, item) => sum + (item.purchased ? item.price : 0),
    0
  );
  logger.info(`Calculating total cost: Total Cost $${totalCost}`);
  return totalCost;
}

module.exports = {
  shoppingList,
  addItem,
  togglePurchased,
  removeItem,
  calculateTotalCost,
};
