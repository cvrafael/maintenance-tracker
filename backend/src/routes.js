const { Router } = require("express");
require("dotenv").config();

const maintenance = require("./controllers/trackerControllers/maintanenceControllers")
const router = Router();

router.get("/tracker-maintenance", maintenance.find_all);
module.exports = router;
