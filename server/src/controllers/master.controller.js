const Master = require("../models/Master");


// Get master document (assuming there's only one)
exports.getMaster = async (req, res) => {
  try {
    const master = await Master.find(); // Fetches the first document
    if (!master) {
      return res.status(404).json({ message: "Master record not found" });
    }
    res.json(master);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update master document
exports.updateMaster = async (req, res) => {
  try {
    const updates = req.body;

    const master = await Master.find();
    if (!master) {
      return res.status(404).json({ message: "Master record not found" });
    }

    Object.assign(master, updates);
    await master.save();

    res.json({ message: "Master record updated", master });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

