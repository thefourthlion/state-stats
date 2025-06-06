const express = require("express");
const router = express.Router();
const {
  createStates,
  readStates,
  readStatesFromID,
  updateStates,
  deleteStates,
} = require("../controllers/States");
router.route("/create").post(createStates);
router.route("/read").get(readStates);
router.route("/read/:id").get(readStatesFromID);
router.route("/update/:id").post(updateStates);
router.route("/delete/:id").delete(deleteStates);
module.exports = router;
