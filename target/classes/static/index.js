require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kuku3678',
  database: 'job_portal'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const adminEmail = process.env.ADMIN_EMAIL;

// DELETE application by ID
app.delete('/api/applications/:id', (req, res) => {
    const applicationId = parseInt(req.params.id);

    const sql = 'DELETE FROM applications WHERE id = ?';

    db.query(sql, [applicationId], (err, result) => {
        if (err) {
            console.error('Error deleting application:', err);
            return res.status(500).json({ success: false, message: 'Error deleting application.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        res.json({ success: true, message: 'Application deleted successfully.' });
    });
});

// ✅ POST a new job
app.post('/api/jobs', (req, res) => {
  const { title, description, type, salary, deadline, company_name, company_logo, location, category } = req.body;

  const sql = `
    INSERT INTO jobs (title, description, type, salary, deadline, company_name, company_logo, location, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, type, salary, deadline, company_name, company_logo, location, category], (err, result) => {
    if (err) {
      console.error("❌ Job Posting Error:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }

    res.status(201).send({ success: true, jobId: result.insertId });
  });
});

// ✅ GET all jobs (with optional filtering by category, type, and location)
app.get('/api/jobs', (req, res) => {
  const { type, location, category } = req.query;

  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const values = [];

  if (type) {
    sql += ' AND type = ?';
    values.push(type);
  }

  if (location) {
    sql += ' AND location = ?';
    values.push(location);
  }

  if (category) {
    sql += ' AND category = ?';
    values.push(category);
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ Job Fetching Error:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }
    res.send(results);
  });
});

// ✅ Get job by ID
app.get('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  const sql = 'SELECT * FROM jobs WHERE id = ?';
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching job:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).send({ success: false, message: "Job not found" });
    }

    res.send(results[0]);
  });
});

// ✅ Get distinct job categories
// ✅ Get jobs by category
app.get('/api/jobs/category/:category', (req, res) => {
  const category = req.params.category;

  const sql = 'SELECT * FROM jobs WHERE category = ?';
  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error("❌ Error fetching jobs by category:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).send({ success: false, message: "No jobs found for this category" });
    }

    res.send({
      success: true,
      jobs: results
    });
  });
});


// ✅ Submit application
// ✅ Submit application (Only Email to Admin, No Email to User)
app.post('/api/apply', (req, res) => {
  const { jobId, name, email, resume } = req.body;

  const sql = 'INSERT INTO applications (jobId, name, email, resume) VALUES (?, ?, ?, ?)';
  db.query(sql, [jobId, name, email, resume], (err, result) => {
    if (err) {
      console.error("❌ Application Error:", err);
      return res.status(500).send({ success: false, message: "Database error" });
    }

    // Send email to admin
    const mailOptionsToAdmin = {
      from: process.env.GMAIL_USER,
      to: adminEmail,
      subject: `New Application for Job ID ${jobId}`,
      text: `New applicant: ${name}\nEmail: ${email}\nResume:\n${resume}`
    };

    transporter.sendMail(mailOptionsToAdmin, (error, info) => {
      if (error) {
        console.error("❌ Email to Admin Error:", error);
      } else {
        console.log('✅ Email sent to Admin:', info.response);
      }
    });

    // Return success response to frontend
    res.send({ success: true, message: 'Application submitted successfully.' });
  });
});
// ✅ Confirm Application API
app.post('/api/applications/confirm', (req, res) => {
    const { applicationId, userEmail } = req.body;

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';
    db.query(sql, ['Confirmed', applicationId], (err, result) => {
        if (err) {
            console.error('❌ Status Update Error:', err);
            return res.status(500).json({ success: false, message: 'Database update error.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        // Send confirmation email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Application Confirmed',
            text: 'Dear Applicant,\n\nYour application has been confirmed by the admin. We will contact you soon.\n\nThank you.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Email Error:', error);
                return res.status(500).json({ success: false, message: 'Failed to send confirmation email.' });
            } else {
                console.log('✅ Confirmation email sent:', info.response);
                return res.json({ success: true, message: 'Application confirmed and email sent.' });
            }
        });
    });
});


// ✅ Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = 'rozgaar1234'; // You can move this to .env later

  if (password === ADMIN_PASSWORD) {
    res.send({ success: true });
  } else {
    res.status(401).send({ success: false, message: 'Unauthorized' });
  }
});

// ✅ Get all applications
app.get('/api/applications', (req, res) => {
  const sql = 'SELECT * FROM applications ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching applications:", err);
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
