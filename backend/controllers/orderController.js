import asyncHandler from "express-async-handler"
import Order from "../models/OrderModel.js"

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  console.log("Adding order in controller")
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    console.log("No Items in order")
    res.status(400)
    throw new Error("No order items")
    return
  } else {
    console.log("Found items, going to create order")
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    try {
      const createdOrder = await order.save()
      res.status(201).json(createdOrder)
    } catch (error) {
      console.log(`Something is wrong ${order}\n${error}`.red.bold)
      res.status(400)
      throw new Error(`Something is wrong ${order}\n${error}`)
    }
  }
})

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order not found!")
  }
})

export { addOrderItems, getOrderById }
