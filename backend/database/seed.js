const db = require('../config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Waiting for database initialization...');
  await db.initPromise;
  console.log('Clearing database tables...');
  await db.query('TRUNCATE TABLE saved_jobs, applications, jobs, users RESTART IDENTITY CASCADE');

  console.log('Hashing passwords...');
  const passwordHash = await bcrypt.hash('123456', 10);

  console.log('Seeding users...');
  
  const insertUser = async (name, email, password, role, profile_image, resume_url, skills, resume_text) => {
    const res = await db.query(`
      INSERT INTO users (name, email, password, role, profile_image, resume_url, skills, resume_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `, [name, email, password, role, profile_image, resume_url, skills, resume_text]);
    return res.rows[0].id;
  };

  // Recruiters
  const googleRecruiterId = await insertUser('Google Recruiter', 'recruiter.google@demo.com', passwordHash, 'recruiter', null, null, null, null);
  const microsoftRecruiterId = await insertUser('Microsoft Recruiter', 'recruiter.microsoft@demo.com', passwordHash, 'recruiter', null, null, null, null);
  const metaRecruiterId = await insertUser('Meta Recruiter', 'recruiter.meta@demo.com', passwordHash, 'recruiter', null, null, null, null);

  // Jobseekers
  await insertUser('Yogith Reddy', 'jobseeker@demo.com', passwordHash, 'jobseeker', null, null, 'react, nodejs, python, git, sql, javascript', 'Yogith Reddy - Full Stack Developer. Experienced with React, Node.js, Python, Git and SQL database management.');
  await insertUser('Jane Doe', 'jane.doe@demo.com', passwordHash, 'jobseeker', null, null, 'python, machine learning, pandas, numpy', 'Jane Doe - AI Engineer. Specialized in data analysis, machine learning and Python programming.');

  console.log('Seeding jobs...');
  const insertJob = async (title, company, company_logo, location, salary, description, skills, experience, job_type, recruiterId) => {
    await db.query(`
      INSERT INTO jobs (title, company, company_logo, location, salary, description, skills, experience, job_type, recruiter_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1)
    `, [title, company, company_logo, location, salary, description, skills, experience, job_type, recruiterId]);
  };

  await insertJob(
    'Software Engineer (Python & AI)',
    'Google',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    'Bengaluru',
    2500000,
    'Join Google as a Software Engineer in the AI Team. You will build and scale AI-driven features and systems.',
    'python, machine learning, deep learning, git, rest api',
    '2-5 Years',
    'Full Time',
    googleRecruiterId
  );

  await insertJob(
    'Frontend Developer (React)',
    'Microsoft',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'Hyderabad',
    1800000,
    'Microsoft is looking for a Frontend Developer with expertise in React, TypeScript, and modern styling practices.',
    'react, javascript, typescript, html, css, git',
    '1-2 Years',
    'Full Time',
    microsoftRecruiterId
  );

  await insertJob(
    'Full Stack Engineer (Node & React)',
    'Meta',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    'Remote',
    2800000,
    'Work on scalable full stack features at Meta. Proficient in Node.js, React, Express, and Database design.',
    'nodejs, express, react, mongodb, mysql, javascript, git',
    '2-5 Years',
    'Remote',
    metaRecruiterId
  );

  await insertJob(
    'Data Scientist',
    'Google',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    'Remote',
    2200000,
    'Analyze large datasets and build robust prediction models using pandas, numpy, and machine learning models.',
    'python, data science, pandas, numpy, scikit-learn, sql',
    '2-5 Years',
    'Remote',
    googleRecruiterId
  );

  await insertJob(
    'DevOps Engineer',
    'Microsoft',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'Bengaluru',
    2000000,
    'Automate CI/CD pipelines, manage kubernetes clusters, and ensure high availability of Microsoft cloud systems.',
    'docker, kubernetes, aws, azure, devops, ci/cd, git, linux',
    '2-5 Years',
    'Full Time',
    microsoftRecruiterId
  );
}

seed()
  .then(() => {
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
