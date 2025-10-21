// routes/menuRoutes.js
const express = require("express");
const router = express.Router();
const menu = require("../data/menu");

// ===============================
// ROUTE 1: GET /menu
// ===============================

// هذا الراوت يرجع كل عناصر القائمة
router.get("/", (req, res) => {
  const tag = req.query.tag; // لو المستخدم كتب ?tag=pizza
  let items = menu;

  if (tag) {
    items = menu.filter((item) => item.tags.includes(tag.toLowerCase()));
  }

  res.json(items);
});

module.exports = router;
