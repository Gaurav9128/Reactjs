const Workshop = require("../models/Workshop");

// Create Workshop
exports.createWorkshop = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
     workingDays,
      startTime,
      endTime,
    } = req.body;

    const existingWorkshop = await Workshop.findOne({ isActive: true });

    if (existingWorkshop) {
      return res.status(400).json({
        success: false,
        message: "An active workshop already exists.",
      });
    }

    const workshop = await Workshop.create({
      title,
      description,
      startDate,
      workingDays,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Workshop Created Successfully",
      workshop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Active Workshop
exports.getWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ isActive: true });

    res.status(200).json({
      success: true,
      workshop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "No Active Workshop Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workshop Updated Successfully",
      workshop,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};