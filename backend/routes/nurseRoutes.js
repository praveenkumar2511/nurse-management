const express = require("express");
const {
  getNurses,
  addNurse,
  updateNurse,
  deleteNurse
} = require("../controllers/nurseController");

const router = express.Router();

router.get("/get", getNurses);
router.post("/create", addNurse);
router.put("/update/:id", updateNurse); 
router.delete("/delete/:id", deleteNurse);


module.exports =  router;
