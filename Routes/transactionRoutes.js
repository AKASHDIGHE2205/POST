import express from "express";
import db from "../db.js";
const router = express.Router();
router.use(express.json());// Middleware to parse JSON bodies

//Api to get All Dept's for Entry modal view
router.get("/getDepts", (req, res) => {
  const sql = `SELECT dept_id, dept_name FROM dept`;

  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      // Log and respond with error status if the query fails
      console.error("Error retrieving departments:", err);
      return res.status(500).json({ message: "Failed to retrieve departments", error: err });
    }

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    // Respond with the retrieved results
    return res.status(200).json(results);
  });
});

//Api to get All post Types for Entry modal view
router.get("/getPTypes", (req, res) => {
  const sql = `SELECT post_id, post_name FROM post_type `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving departments:", err);
      return res.status(500).json({ message: "Failed to retrieve departments", error: err });
    }
    return res.status(200).json(results);
  });
});

//Api to get All Firms For Entry Modal view
router.get("/getFirms", (req, res) => {
  const sql = `SELECT firm_id, firm_name FROM firms`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving firms:", err);
      return res.status(500).json({ message: "Failed to retrieve firms", error: err });
    }
    return res.status(200).json(results);
  });
});

//Api to create Inward post Entry
router.post("/newEntry", (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag } = req.body;

  // console.log("Entry Date:", entry_date, "Post Type:", post_type, "Name:", party_name, "Dept Id:", dept_id, "Firm Id:", firm_id, "City Name:", city_name, "Remark:", remark, "Receipt No:", receipt_no, "Quantity:", qty, "Flag:", flag);

  const sql = `
    INSERT INTO post_entry 
    (entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?) `;

  db.query(sql, [entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", err: err });
    }
    return res.status(201).json({ message: "Post Entry Created!" });
  });

});

//Api to get All Party Details For Entry Modal view
router.get("/getPartyNames", (req, res) => {
  const sql = `
    SELECT a.party_id, a.party_name, b.city_name,a.party_city
    FROM party_names AS a
    JOIN cities AS b ON a.party_city = b.city_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving party names:", err);
      return res.status(500).json({ message: "Failed to retrieve party names", error: err });
    }
    return res.status(200).json(results);
  });
});

//API tO VIEW ALL INWARD ENTRY
router.get("/getAllInEntry", (req, res) => {
  const sql = `
    SELECT 
      a.entry_id,
      a.entry_date,
      e.post_name,
      b.dept_name,
      c.firm_name,
      d.city_name,
      a.remark,
      a.receipt_no,
      a.qty,
      a.flag
    FROM 
      post_entry AS a
    JOIN 
      dept AS b ON a.dept_id = b.dept_id
    JOIN 
      firms AS c ON a.firm_id = c.firm_id
    JOIN 
      cities AS d ON a.city_name = d.city_id
    JOIN 
      post_type AS e ON a.post_type = e.post_id
    WHERE 
      a.flag = 'I'
    ORDER BY
      a.entry_id ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
});

//API TO VIEW ALL OUTWARD ENTRY
router.get("/getAllOutEntry", (req, res) => {
  const sql = `SELECT 
                  a.entry_id,
                  a.entry_date,
                  e.post_name,
                  b.dept_name,
                  c.firm_name,
                  d.city_name,
                  a.remark,
                  a.receipt_no,
                  a.qty,
                  a.flag

               FROM 
                  post_entry AS a
               JOIN 
                  dept AS b ON a.dept_id = b.dept_id
               JOIN 
                  firms AS c ON a.firm_id = c.firm_id
               JOIN 
                  cities AS d ON a.city_name = d.city_id
               JOIN post_type AS e ON a.post_type = e.post_id
               WHERE a.flag = 'O'
               ORDER BY 
                   a.entry_id ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
});

//Api to create Outward post Entry
router.post("/newOutEntry", (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine, party_name } = req.body;

  console.log("Entry Date:", entry_date, "Post Type:", post_type, "Dept Id:", dept_id, "Firm Id:", firm_id, "City Name:", city_name, "Remark:", remark, "Receipt No:", receipt_no, "Quantity:", qty, "Flag:", flag, "charges:", charges, "fr_machine:", fr_machine, "Party NAme", party_name);

  const sql = `
    INSERT INTO post_entry 
    (entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine,party_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

  db.query(sql, [entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine, party_name], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", err: err });
    }
    return res.status(201).json({ message: "Post Entry Created!" });
  });
});

//Api to create new stamp purchase Entry
router.post("/newStampEntry", (req, res) => {
  const { pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark } = req.body;

  console.log(pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark);

  const sql = `
    INSERT INTO stamp_pur 
    (pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(201).json({ message: "Stamp entry created successfully!" });
  });
});

//Api To create new voucher Entry
router.post("/newVoucherEntry", (req, res) => {
  const { v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark } = req.body;

  console.log(v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark);

  const sql = `
    INSERT INTO voucher_entry 
    (v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(201).json({ message: "Voucher entry created successfully!" });
  });

});

//Api To View all Stam Entries
router.get("/getAllStampEntry", (req, res) => {
  const sql = `SELECT a.pur_date,a.stamp_id,b.firm_name,a.rec_no,a.pay_date,a.stamp,a.fr_machine,a.remark
               FROM stamp_pur AS a
               JOIN firms AS b ON a.firm_name = b.firm_id`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
});

//Api to View All Vocuher entry
router.get("/getAllVoucherEntry", (req, res) => {

  const sql = `
          SELECT a.v_no,a.v_date,a.receipt_no,a.paid_date,a.stamp,a.fr_machine,a.remark,a.firm_name as firm_id,b.firm_name
          FROM voucher_entry AS a
          JOIN firms AS b ON a.firm_name=b.firm_id`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
});

//Api to View all OUtward details entry
router.post("/getAllOutwardDetails", (req, res) => {
  const { from_date, to_date, firm_id } = req.body;

  console.log(from_date, to_date, firm_id);

  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required query parameters: from_date and to_date" });
  }

  let sql = `
    SELECT 
      a.entry_id, 
      a.entry_date, 
      e.post_name AS post_type, 
      c.firm_name, 
      b.dept_name, 
      a.party_name, 
      a.city_name, 
      a.remark, 
      a.qty, 
      a.fr_machine, 
      a.charges, 
      a.rec_no, 
      a.rec_date 
    FROM 
      post_entry AS a 
      JOIN dept AS b ON a.dept_id = b.dept_id 
      JOIN firms AS c ON a.firm_id = c.firm_id 
      JOIN post_type AS e ON a.post_type = e.post_id 
    WHERE 
      a.entry_date BETWEEN ? AND ? 
      AND a.flag = 'O' `;

  const params = [from_date, to_date];

  if (firm_id !== '0') {
    sql += ` AND a.firm_id = ?`;
    params.push(firm_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error retrieving outward details:", err);
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
});

export default router; 