const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query('SELECT * FROM invoices;');
		return res.json({ invoice: results.rows });
	} catch (e) {
		return next(e);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query('SELECT * FROM invoices WHERE id=$1', [ id ]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
		}
		return res.send({ invoice: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { comp_code, amt } = req.body;
		const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1,$2) RETURNING *', [
			comp_code,
			amt
		]);
		return res.status(201).json({ invoice: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.patch('/:id', async (req, res, next) => {
	try {
		const { comp_code, amt } = req.body;
		const { id } = req.params;
		const results = await db.query('UPDATE invoices SET comp_code=$1, amt=$2 WHERE id=$3 RETURNING *', [
			comp_code,
			amt,
			id
		]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
		}
		return res.send({ invoice: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query('DELETE FROM invoices WHERE id=$1', [ id ]);
		return res.send({ msg: 'Deleted!' });
	} catch (e) {
		return next(e);
	}
});

router.get('/companies/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const comp_results = await db.query('SELECT * FROM companies WHERE code=$1', [ code ]);
		if (comp_results.rows.length === 0) {
			throw new ExpressError(`Can't find company with id of ${code}`, 404);
		}
		const invoices = await db.query('SELECT * from invoices WHERE comp_code =$1', [ code ]);
		// return res.send({ invoice: results.rows[0] });
		let comp = comp_results.rows[0];
		return res.send({
			company: { code: comp.code, name: comp.name, description: comp.description, invoices: invoices.rows }
		});
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
