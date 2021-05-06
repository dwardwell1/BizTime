const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

//make these results better?

router.get('/', async (req, res, next) => {
	console.log('connection');
	try {
		const results = await db.query(`SELECT i.code, i.industry, ci.company_code
            FROM industries AS i
            LEFT JOIN comp_industries AS ci
            ON i.code = ci.industry_code
            ORDER BY i.code;`);
		res.send(results.rows);
	} catch (e) {
		return next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { code, industry } = req.body;
		const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1,$2) RETURNING *', [
			code,
			industry
		]);
		return res.status(201).json({ industry: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.post('/add', async (req, res, next) => {
	console.log('connection');
	try {
		const { company_code, industry_code } = req.body;
		const results = await db.query(
			'INSERT INTO comp_industries (company_code, industry_code) VALUES ($1,$2) RETURNING *',
			[ company_code, industry_code ]
		);
		return res.status(201).json({ new_connection: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
