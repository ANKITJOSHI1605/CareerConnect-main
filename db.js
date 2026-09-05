const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    max: 10
});

const tableNames = ['students', 'companies', 'admins', 'jobs', 'applications', 'contact_messages'];

function prepareSql(sql) {
    let prepared = sql;
    for (const table of tableNames) {
        prepared = prepared.replace(new RegExp(`\\b${table}\\b`, 'g'), `career_${table}`);
    }

    let parameter = 0;
    prepared = prepared.replace(/\?/g, () => `$${++parameter}`);
    if (/^\s*INSERT\b/i.test(prepared) && !/\bRETURNING\b/i.test(prepared)) {
        prepared += ' RETURNING id';
    }
    return prepared;
}

const legacyKeys = {
    companyname: 'companyName',
    jobtitle: 'jobTitle',
    studentname: 'studentName',
    studentemail: 'studentEmail',
    studentmajor: 'studentMajor',
    academicyear: 'academicYear',
    registereddate: 'registeredDate'
};

function normalizeRow(row) {
    const normalized = { ...row };
    for (const [postgresKey, browserKey] of Object.entries(legacyKeys)) {
        if (Object.prototype.hasOwnProperty.call(normalized, postgresKey)) {
            normalized[browserKey] = normalized[postgresKey];
            delete normalized[postgresKey];
        }
    }
    return normalized;
}

const db = {
    query(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }

        const isSelect = /^\s*SELECT\b/i.test(sql);
        pool.query(prepareSql(sql), params || [])
            .then(result => {
                const rows = result.rows.map(normalizeRow);
                if (isSelect) return callback(null, rows);
                callback(null, {
                    insertId: rows[0]?.id,
                    affectedRows: result.rowCount,
                    rows
                });
            })
            .catch(error => callback(error));
    },
    ping(callback) {
        pool.query('SELECT 1').then(() => callback(null)).catch(callback);
    }
};

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS career_students (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            major VARCHAR(100),
            academic_year VARCHAR(50),
            resume_file VARCHAR(255),
            profile_photo VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS career_companies (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            industry VARCHAR(100),
            website VARCHAR(255),
            profile_photo VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS career_admins (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS career_jobs (
            id BIGSERIAL PRIMARY KEY,
            company_id BIGINT NOT NULL REFERENCES career_companies(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT NOT NULL,
            location VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('internship', 'fulltime', 'parttime')),
            posted_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
        );

        CREATE TABLE IF NOT EXISTS career_applications (
            id BIGSERIAL PRIMARY KEY,
            student_id BIGINT NOT NULL REFERENCES career_students(id) ON DELETE CASCADE,
            job_id BIGINT NOT NULL REFERENCES career_jobs(id) ON DELETE CASCADE,
            resume_file VARCHAR(255),
            status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'interview')),
            applied_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            interview_date DATE,
            interview_time TIME,
            interview_mode VARCHAR(20) CHECK (interview_mode IN ('online', 'in-person')),
            interview_location TEXT,
            interview_notes TEXT,
            UNIQUE (student_id, job_id)
        );

        CREATE TABLE IF NOT EXISTS career_contact_messages (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
        if (password.length < 10) throw new Error('ADMIN_PASSWORD must contain at least 10 characters');
        const passwordHash = await bcrypt.hash(password, 12);
        await pool.query(
            `INSERT INTO career_admins (name, email, password)
             VALUES ($1, $2, $3)
             ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password`,
            ['CareerConnect Administrator', email, passwordHash]
        );
    }
}

module.exports = { db, initializeDatabase };
