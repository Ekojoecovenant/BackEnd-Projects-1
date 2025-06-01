const express = require("express");
const router = express.Router();
const appController = require("../controllers/applicationController");

router.get("/", appController.getAll);
router.get("/:id", appController.getById);
router.post("/", appController.create);
router.put("/:id", appController.update);
router.delete("/:id", appController.deleteApp);

module.exports = router;
