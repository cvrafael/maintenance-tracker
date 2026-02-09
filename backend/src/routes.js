const { Router } = require("express");
require("dotenv").config();

const maintenance = require("./controllers/trackerControllers/maintanenceControllers")
const router = Router();

router.get("/tracker-maintenance", maintenance.find_all);
router.put("/tracker-maintenance/update", maintenance.update_status);
module.exports = router;
