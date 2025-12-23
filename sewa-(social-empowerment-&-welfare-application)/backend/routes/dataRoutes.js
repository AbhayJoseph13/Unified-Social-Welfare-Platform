
const express = require('express');
const router = express.Router();
const { Issue, NGO, User, BlogPost, Group, Job, JobApplication } = require('../models');

// --- Issue Reports ---

router.get('/reports', async (req, res) => {
  try {
    const reports = await Issue.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reports', async (req, res) => {
  try {
    const report = new Issue(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Public NGO Routes ---

router.get('/ngos', async (req, res) => {
  try {
    const ngos = await NGO.find({ status: 'APPROVED' });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Blog Routes ---

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ _id: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const blog = new BlogPost(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Group Routes ---

router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Job Portal Routes ---

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/jobs/:id/applications', async (req, res) => {
  try {
    const apps = await JobApplication.find({ jobId: req.params.id });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/applications', async (req, res) => {
  try {
    const app = new JobApplication(req.body);
    await app.save();
    // Increment applicant count
    await Job.findByIdAndUpdate(req.body.jobId, { $inc: { applicantsCount: 1 } });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const app = await JobApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Admin Routes ---

router.get('/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeIssues = await Issue.countDocuments({ status: 'PENDING' });
    const resolvedIssues = await Issue.countDocuments({ status: 'RESOLVED' });
    const pendingNGOs = await NGO.countDocuments({ status: 'PENDING' });
    
    res.json({ totalUsers, activeIssues, resolvedIssues, pendingNGOs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin/ngos', async (req, res) => {
  try {
    const ngos = await NGO.find({ status: 'PENDING' });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/admin/ngos/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const ngo = await NGO.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
