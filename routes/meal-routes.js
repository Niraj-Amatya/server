const { Router } = require("express");
const {
  createMealItem,
  // getAllMealItems,
  // getMealItem,
  getMealsOpenForOrders,
  getAllMealsSoldByMe,
  getMealSoldByMe,
  updateMealItem,
  deleteMealItem,
} = require("../controllers/meals-controller");
const { userAuthenticated, verifyMealSeller } = require("./middleware");

// const {
//   getOrdersByMeal,
//   createOrderForMeal,
// } = require("../controllers/orders-controller");

const mealRoutes = Router();

mealRoutes.get("/openfororders", getMealsOpenForOrders);

// mealRoutes.get("/", getAllMealItems);
// mealRoutes.get("/:id", getMealItem);
mealRoutes.use(userAuthenticated);
mealRoutes.get("/", getAllMealsSoldByMe);
mealRoutes.post("/", createMealItem);

mealRoutes.use("/:id", verifyMealSeller);

mealRoutes.get("/:id", getMealSoldByMe);
mealRoutes.put("/:id", updateMealItem);
mealRoutes.delete("/:id", deleteMealItem);

// mealRoutes.get("/:id/orders", getOrdersByMeal);
// mealRoutes.post("/:id/orders", createOrderForMeal);

module.exports = mealRoutes;
