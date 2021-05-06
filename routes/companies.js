const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');
var slugify = require('slugify');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query('SELECT * FROM companies;');
		return res.json({ companies: results.rows });
	} catch (e) {
		return next(e);
	}
});

router.get('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const comp = await db.query('SELECT * FROM companies WHERE code=$1', [ code ]);
		const industries = await db.query(
			`SELECT i.industry 
			FROM industries as i
			LEFT JOIN comp_industries AS ci
			on i.code = ci.industry_code
			LEFT JOIN companies as co
			on ci.company_code = co.code
			WHERE co.code = $1
			`,
			[ code ]
		);
		if (comp.rows.length === 0) {
			throw new ExpressError(`Can't find company with code of ${code}`, 404);
		}
		console.log(industries.rows[0]);
		const { cCode, name, description } = comp.rows[0];
		const indies = industries.rows.map((r) => r.industry);
		return res.send({ company: cCode, name, description, industries: indies });
	} catch (e) {
		return next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { name, description } = req.body;
		const code = slugify(name, { lower: true });
		const results = await db.query('INSERT INTO companies (code,name,description) VALUES ($1,$2,$3) RETURNING *', [
			code,
			name,
			description
		]);
		return res.status(201).json({ company: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.patch('/:code', async (req, res, next) => {
	try {
		const { name, description } = req.body;
		const { code } = req.params;
		const results = await db.query('UPDATE companies SET  name=$2, description=$3  WHERE code=$1 RETURNING *', [
			code,
			name,
			description
		]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find company with code of ${code}`, 404);
		}
		return res.send({ user: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.delete('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const results = await db.query('DELETE FROM companies WHERE code=$1', [ code ]);
		return res.send({ msg: 'Deleted!' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
