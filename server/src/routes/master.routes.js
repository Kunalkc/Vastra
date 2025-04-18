const express = require("express");
const router = express.Router();
const {
  createMaster,
  getMaster,
  updateMaster,
  deleteMaster
} = require("../controllers/master.controller");

router.get("/", getMaster);
router.patch("/", updateMaster);

module.exports = router; 