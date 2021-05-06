\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS comp_industries CASCADE;



CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
code text PRIMARY KEY,
industry text NOT NULL UNIQUE

);

CREATE TABLE comp_industries(
  company_code TEXT NOT NULL REFERENCES companies,
  industry_code TEXT NOT NULL REFERENCES industries,
  PRIMARY KEY(company_code, industry_code)
);



INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('blrt','Paul Blart Mall Cop', 'great officer'),
         ('gas', 'Gas Makers', 'Talkin the farty kind'),
         ('ray', 'Raytheon', 'Just murderin people');


INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry) VALUES ('acct', 'accounting');
INSERT INTO industries (code, industry) VALUES ('farm', 'farming');
INSERT INTO industries (code, industry) VALUES ('murd', 'murdering');
INSERT INTO industries (code, industry) VALUES ('scare', 'skin care');
INSERT INTO industries (code, industry) VALUES ('begal', 'begal department');
INSERT INTO industries (code, industry) VALUES ('land', 'grave digging');

INSERT INTO comp_industries(company_code, industry_code) VALUES ('apple', 'murd'), ('apple','land'), ('ibm', 'farm'), ('blrt','scare'), ('blrt','murd'), ('gas', 'murd'), ('gas','land'), ('ray', 'murd'), ('ray', 'farm'), ('ray','scare');