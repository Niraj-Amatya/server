const Menu = require("../models/menu");

// creates order given menuId and order details
// order object must have pickupAt (date-time string) and quantity(natural number) fields
const createOrder = async (menuId, order) => {
  const { pickupAt, quantity } = order;
  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: {
        orders: { pickupAt, quantity },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  return updatedMenu;
};

// given orderId returns the order details encapsulated within the meal object that the order belongs to
// returns null if order not found
const getOrderById = async (orderId) => {
  const mealWithOrder = await Menu.findOne(
    {
      "orders._id": orderId,
    },
    {
      orders: {
        $elemMatch: {
          _id: orderId,
        },
      },
    }
  ).exec();
  return mealWithOrder;
};

// given mealId returns all the orders belonging to that meal encapsulated withing meal object
// returns null if mealId not found
const getOrdersForMeal = async (mealId) => {
  const mealWithAllOrders = await Menu.findOne({ _id: mealId })
    .select("orders")
    .exec();
  return mealWithAllOrders;
};

// given orderId and orderUpdates, updates the value of the order fields pickupAt and quantity and returns the new order object encapsulted within the meal object that it belongs to
// returns null if orderId not found
const updateOrderById = async (orderId, orderUpdates) => {
  const { pickupAt, quantity } = orderUpdates;
  const mealWithUpdatedOrder = await Menu.findOneAndUpdate(
    {
      "orders._id": orderId,
    },
    {
      "orders.$.pickupAt": pickupAt,
      "orders.$.quantity": quantity,
    },
    {
      select: {
        orders: {
          $elemMatch: {
            _id: orderId,
          },
        },
      },
      new: true,
      runValidators: true,
    }
  ).exec();
  return mealWithUpdatedOrder;
};

// given valid orderId, sets cancelAt field within the order to indicate the order is cancelled and returns the cancelled order object encapsulated within the meal object it belongs to
// returns null if order not found
const cancelOrderById = async (orderId) => {
  const mealWithCancelledOrder = await Menu.findOneAndUpdate(
    {
      "orders._id": orderId,
    },
    {
      "orders.$.cancelAt": new Date().toISOString(),
    },
    {
      select: {
        orders: {
          $elemMatch: {
            _id: orderId,
          },
        },
      },
      new: true,
    }
  ).exec();
  return mealWithCancelledOrder;
};

module.exports = {
  cancelOrderById,
  createOrder,
  getOrderById,
  getOrdersForMeal,
  updateOrderById,
};
