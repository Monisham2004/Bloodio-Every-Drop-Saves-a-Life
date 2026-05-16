const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const DonationHistory = require('../models/DonationHistory');
const sendEmail = require('../config/mail');

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private (Recipient only)
const createRequest = async (req, res) => {
  try {
    const { donorId, bloodGroup, units, hospital, city, urgency, message } = req.body;

    const request = await BloodRequest.create({
      recipient: req.user._id,
      donor: donorId,
      bloodGroup,
      units,
      hospital,
      city,
      urgency,
      message,
      status: 'Pending',
    });

    // If a specific donor was requested, send an email
    if (donorId) {
      const donor = await User.findById(donorId);
      if (donor) {
        const emailMessage = `
          <h3>New Blood Request</h3>
          <p>You have a new blood request for ${units} units of ${bloodGroup} blood at ${hospital}, ${city}.</p>
          <p>Urgency: <strong>${urgency}</strong></p>
          <p>Message: ${message || 'No message provided'}</p>
          <p>Please log in to your dashboard to accept or reject this request.</p>
        `;
        
        await sendEmail({
          email: donor.email,
          subject: `Urgent: Blood Request (${bloodGroup})`,
          message: emailMessage,
        });
      }
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create bulk blood requests
// @route   POST /api/requests/bulk
// @access  Private (Recipient only)
const createBulkRequest = async (req, res) => {
  try {
    const { donorIds, bloodGroup, units, hospital, city, urgency, message } = req.body;

    if (!donorIds || donorIds.length === 0) {
      return res.status(400).json({ message: 'No donors selected' });
    }

    // Check existing pending requests between recipient and these donors
    const existingRequests = await BloodRequest.find({
      recipient: req.user._id,
      donor: { $in: donorIds },
      status: 'Pending'
    });

    const existingDonorIds = existingRequests.map(r => r.donor.toString());
    const newDonorIds = donorIds.filter(id => !existingDonorIds.includes(id.toString()));

    if (newDonorIds.length === 0) {
      return res.status(400).json({ 
        message: 'Pending requests already exist for all selected donors',
        created: 0
      });
    }

    const requestsToCreate = newDonorIds.map(donorId => ({
      recipient: req.user._id,
      donor: donorId,
      bloodGroup,
      units,
      hospital,
      city,
      urgency,
      message,
      status: 'Pending'
    }));

    await BloodRequest.insertMany(requestsToCreate);

    // Fetch donors to send emails
    const donors = await User.find({ _id: { $in: newDonorIds } });

    const emailPromises = donors.map(donor => {
      const emailMessage = `
        <h3>New Blood Request</h3>
        <p>You have a new blood request for ${units} units of ${bloodGroup} blood at ${hospital}, ${city}.</p>
        <p>Urgency: <strong>${urgency}</strong></p>
        <p>Message: ${message || 'No message provided'}</p>
        <p>Please log in to your dashboard to accept or reject this request.</p>
      `;
      
      return sendEmail({
        email: donor.email,
        subject: `Urgent: Blood Request (${bloodGroup})`,
        message: emailMessage,
      });
    });

    await Promise.all(emailPromises);

    res.status(201).json({ message: 'Requests sent successfully', created: newDonorIds.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user requests (sent or received)
// @route   GET /api/requests/my
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'donor') {
      requests = await BloodRequest.find({ donor: req.user._id })
        .populate('recipient', 'name email phone')
        .sort('-createdAt');
    } else if (req.user.role === 'recipient') {
      requests = await BloodRequest.find({ recipient: req.user._id })
        .populate('donor', 'name email phone')
        .sort('-createdAt');
    } else {
      // Admin gets all
      requests = await BloodRequest.find()
        .populate('donor', 'name email')
        .populate('recipient', 'name email')
        .sort('-createdAt');
    }
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id).populate('recipient', 'email name').populate('donor', 'email name');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only donor can accept/reject
    if (req.user.role === 'donor' && request.donor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    const updatedRequest = await request.save();

    // If accepted, email the recipient
    if (status === 'Accepted') {
      const emailMessage = `
        <h3>Blood Request Accepted</h3>
        <p>Good news! Your blood request at ${request.hospital} has been accepted by ${request.donor.name}.</p>
        <p>Please log in to your dashboard to view donor contact details.</p>
      `;
      await sendEmail({
        email: request.recipient.email,
        subject: `Blood Request Accepted!`,
        message: emailMessage,
      });
    }

    // If completed, add to donation history
    if (status === 'Completed' && req.user.role === 'donor') {
      await DonationHistory.create({
        donor: request.donor._id,
        recipient: request.recipient._id,
        request: request._id,
        hospital: request.hospital,
        units: request.units,
      });

      // Update donor last donation date
      await User.findByIdAndUpdate(request.donor._id, {
        lastDonationDate: new Date()
      });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, createBulkRequest, getMyRequests, updateRequestStatus };
