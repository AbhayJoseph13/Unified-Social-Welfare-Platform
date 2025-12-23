
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: 'User' },
  email: { type: String, unique: true, sparse: true }, 
  password: { type: String }, 
  phoneNumber: { type: String, unique: true, sparse: true },
  provider: { type: String, default: 'LOCAL' }, 
  providerId: { type: String }, 
  role: { type: String, enum: ['CITIZEN', 'NGO', 'GOVT', 'VOLUNTEER', 'ADMIN'], default: 'CITIZEN' },
  karmaPoints: { type: Number, default: 0 },
  avatar: String
});

const IssueSchema = new mongoose.Schema({
  category: String,
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
  description: String,
  status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
  timestamp: { type: Number, default: Date.now },
  location: String
});

const NGOSchema = new mongoose.Schema({
  name: String,
  cause: String,
  description: String,
  image: String,
  raised: { type: Number, default: 0 },
  goal: { type: Number, default: 10000 },
  type: String, 
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const BlogPostSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  likes: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  image: String
});

const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  members: { type: Number, default: 1 },
  image: String
});

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Volunteer'] },
  salaryRange: String,
  description: String,
  requirements: [String],
  postedBy: String,
  postedAt: { type: String, default: () => new Date().toISOString() },
  applicantsCount: { type: Number, default: 0 }
});

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicantId: String,
  applicantName: String,
  resumeLink: String,
  coverLetter: String,
  status: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  aiMatchScore: Number,
  appliedAt: { type: String, default: () => new Date().toISOString() }
});

const User = mongoose.model('User', UserSchema);
const Issue = mongoose.model('Issue', IssueSchema);
const NGO = mongoose.model('NGO', NGOSchema);
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
const Group = mongoose.model('Group', GroupSchema);
const Job = mongoose.model('Job', JobSchema);
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

module.exports = { User, Issue, NGO, BlogPost, Group, Job, JobApplication };
