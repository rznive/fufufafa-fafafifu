const Complaint = require("../models/complaintModel");
const Response = require("../middlewares/responseHandler");

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, photo } = req.body;

    const complaint = await Complaint.create({
      user_id: req.user.id,
      title,
      description,
      photo,
    });

    return Response.success(res, "Complaint submitted", complaint);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const list = await Complaint.findAll({
      where: { user_id: req.user.id },
    });

    return Response.success(res, "My complaints", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const list = await Complaint.findAll();
    return Response.success(res, "All complaints", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) return Response.error(res, "Complaint not found", 404);

    await complaint.update({ status: req.body.status });

    return Response.success(res, "Complaint status updated", complaint);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
