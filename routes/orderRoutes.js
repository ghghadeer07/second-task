// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const menu = require("../data/menu");
const coupons = require("../data/coupons");

// ===============================
// ROUTE 2: POST /orders
// ===============================

router.post("/", (req, res) => {
  const { items, coupon } = req.body;

  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items array is required" });
  }

  //مصفوفة لتخزين العناصر التي تم طلبها 
  let orderItems = [];
  //متغير لتخزين المجموع الفرعي 
  let subtotal = 0;
//لوب يمر على كل العناصر 
  for (let orderItem of items) {
    const { id, qty } = orderItem;
 // يتحقق من المخزون 
    if (!id || !qty || qty <= 0) {
      return res.status(400).json({ error: "Each item must have valid id and qty" });
    }

    const menuItem = menu.find((m) => m.id === id);
    if (!menuItem) {
      return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    if (menuItem.stock < qty) {
      return res.status(400).json({ error: `Not enough stock for ${menuItem.name}` });
    }

    const itemTotal = menuItem.price * qty;
    subtotal += itemTotal;

    orderItems.push({
      id: menuItem.id,
      qty,
      price: menuItem.price,
    });
  }

  //  تطبيق الكوبون (اختياري)
  let discount = 0;
  let appliedCoupon = null;

  if (coupon) {
    const foundCoupon = coupons.find(
      (c) => c.code.toLowerCase() === coupon.toLowerCase()
    );
    if (foundCoupon) {
      discount = Math.min(
        (subtotal * foundCoupon.percent) / 100,
        foundCoupon.maxDiscount
      );
      appliedCoupon = foundCoupon.code;
    }
  }

  //  حساب الإجمالي النهائي
  const total = subtotal - discount;

  //  إنشاء الرد النهائي
  const response = {
    currency: "IQD",
    items: orderItems,
    subtotal,
    coupon: appliedCoupon,
    discount,
    total,
    createdAt: new Date().toISOString(),
  };

  res.json(response);
});

module.exports = router;
