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

// //Api to get All Party Details For Entry Modal view
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
      a.party_name,
      a.city_name,
      a.remark,
      a.receipt_no,
      a.qty,
      a.flag
    FROM 
      post_entry AS a
    LEFT JOIN 
      dept AS b ON a.dept_id = b.dept_id
    LEFT JOIN 
      firms AS c ON a.firm_id = c.firm_id
    LEFT JOIN 
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
                  a.party_name,
                  b.dept_name,
                  c.firm_name,
                  a.city_name,
                  a.remark,
                  a.receipt_no,
                  a.qty,
                  a.flag
               FROM 
                  post_entry AS a
               LEFT JOIN 
                  dept AS b ON a.dept_id = b.dept_id
               LEFT JOIN 
                  firms AS c ON a.firm_id = c.firm_id
               LEFT JOIN 
                  post_type AS e ON a.post_type = e.post_id
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

//Api to update the outward details
router.put("/updateEntry", (req, res) => {
  const { charges, ret, rec_no, rec_date, entry_id } = req.body;

  console.log(charges, ret, rec_no, rec_date, entry_id);

  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const fields = [];
  const values = [];

  if (charges) {
    fields.push("charges=?");
    values.push(charges);
  }
  if (ret) {
    fields.push("ret=?");
    values.push(ret);
  }
  if (rec_no) {
    fields.push("rec_no=?");
    values.push(rec_no);
  }
  if (rec_date) {
    fields.push("rec_date=?");
    values.push(rec_date);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE post_entry SET ${fields.join(", ")} WHERE entry_id=?`;
  values.push(entry_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry updated successfully", details: results });
  });
});

//Api to update Inward Or Outward Entry
router.put("/updateInEntry", (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, entry_id } = req.body;

  // console.log(entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, entry_id);

  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const fields = [];
  const values = [];

  if (entry_date && entry_date !== '') {
    fields.push("entry_date = ?");
    values.push(entry_date);
  }
  if (post_type && post_type !== '') {
    fields.push("post_type = ?");
    values.push(post_type);
  }
  if (dept_id && dept_id !== '' && dept_id !== '0') {
    fields.push("dept_id = ?");
    values.push(dept_id);
  }
  if (firm_id && firm_id !== '' && firm_id !== '0') {
    fields.push("firm_id = ?");
    values.push(firm_id);
  }
  if (party_name && party_name !== '') {
    fields.push("party_name = ?");
    values.push(party_name);
  }
  if (city_name && city_name !== '') {
    fields.push("city_name = ?");
    values.push(city_name);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }
  if (receipt_no && receipt_no !== '') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (qty && qty !== '' && qty !== '0') {
    fields.push("qty = ?");
    values.push(qty);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update", details: err });
  }

  const sql = `UPDATE post_entry SET ${fields.join(", ")} WHERE entry_id = ?`;
  values.push(entry_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found", details: err });
    }
    return res.status(200).json({ message: "Entry updated successfully", details: results });
  });
});

//Api to update the Inward Details
router.put("/updateOutEntry", (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, charges, fr_machine, party_name, entry_id } = req.body;

  console.log(entry_id, entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, charges, fr_machine, party_name);

  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const fields = [];
  const values = [];

  if (entry_date && entry_date !== '') {
    fields.push("entry_date = ?");
    values.push(entry_date);
  }
  if (post_type && post_type !== '') {
    fields.push("post_type = ?");
    values.push(post_type);
  }
  if (dept_id && dept_id !== '' && dept_id !== '0') {
    fields.push("dept_id = ?");
    values.push(dept_id);
  }
  if (firm_id && firm_id !== '' && firm_id !== '0') {
    fields.push("firm_id = ?");
    values.push(firm_id);
  }
  if (party_name && party_name !== '') {
    fields.push("party_name = ?");
    values.push(party_name);
  }
  if (city_name && city_name !== '') {
    fields.push("city_name = ?");
    values.push(city_name);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }
  if (receipt_no && receipt_no !== '') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (qty && qty !== '' && qty !== '0') {
    fields.push("qty = ?");
    values.push(qty);
  }
  if (charges && charges !== '' && charges !== 0) {
    fields.push("charges = ?");
    values.push(charges);
  }
  if (fr_machine && fr_machine !== '' && fr_machine !== 0) {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE post_entry SET ${fields.join(", ")} WHERE entry_id = ?`;
  values.push(entry_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry update successful", details: results });
  });
});

//Api to Add new department
router.post("/newDept", (req, res) => {
  const { dept_name } = req.body;

  if (!dept_name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  const sql = `INSERT INTO dept (dept_name) VALUES (?)`;

  db.query(sql, [dept_name], (err, results) => {
    if (err) {
      console.error("Error inserting department:", err);
      return res.status(500).json({ message: "Error inserting department", details: err });
    }
    return res.status(200).json({ message: "New Department Added...!", details: results });
  });
});

//Api to Add new Post Type
router.post("/newPostType", (req, res) => {
  const { post_name } = req.body;

  // Validate the input
  if (!post_name) {
    return res.status(400).json({ message: "Post name is required" });
  }

  const sql = `INSERT INTO post_type (post_name) VALUES (?)`;

  db.query(sql, [post_name], (err, results) => {
    if (err) {
      console.error("Error inserting post type:", err);
      return res.status(500).json({ message: "Error inserting post type", details: err });
    }
    return res.status(200).json({ message: "New Post Type Added!", details: results });
  });
});

//Apt to update the stamp entry
router.put("/updateStampEntry", (req, res) => {
  const { pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark, stamp_id } = req.body;

  console.log(pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark, stamp_id);

  if (!stamp_id) {
    return res.status(400).json({ message: "Missing required field: stamp_id" });
  }

  const fields = [];
  const values = [];

  if (pur_date && pur_date !== '') {
    fields.push("pur_date = ?");
    values.push(pur_date);
  }
  if (firm_name && firm_name !== '') {
    fields.push("firm_name = ?");
    values.push(firm_name);
  }
  if (rec_no && rec_no !== '' && rec_no !== '0') {
    fields.push("rec_no = ?");
    values.push(rec_no);
  }
  if (pay_date && pay_date !== '') {
    fields.push("pay_date = ?");
    values.push(pay_date);
  }
  if (stamp && stamp !== '' && stamp !== 0) {
    fields.push("stamp = ?");
    values.push(stamp);
  }
  if (fr_machine && fr_machine !== '' && fr_machine !== 0) {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE stamp_pur SET ${fields.join(", ")} WHERE stamp_id = ?`;
  values.push(stamp_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating stamp entry:", err);
      return res.status(500).json({ message: "Error updating stamp entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Stamp entry not found" });
    }
    return res.status(200).json({ message: "Stamp Entry Update Successful", details: results });
  });
});

//Api to update the voucher entry
router.put("/updateVEntry", (req, res) => {
  const { v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark, v_no } = req.body;
  // console.log("V Date:-", v_date, "receipt No:-", receipt_no, "Paid Date:-", paid_date, "firm Name:-", firm_name, "Stamp:-", stamp, "Fr Machine:-", fr_machine, "Remark", remark, "v No:-", v_no);

  if (!v_no) {
    return res.status(400).json({ message: "Missing required field: v_no" });
  }

  const fields = [];
  const values = [];

  if (v_date && v_date !== '') {
    fields.push("v_date = ?");
    values.push(v_date);
  }
  if (receipt_no && receipt_no !== '' && receipt_no !== '0') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (paid_date && paid_date !== '') {
    fields.push("paid_date = ?");
    values.push(paid_date);
  }
  if (firm_name && firm_name !== '' && firm_name !== '0') {
    fields.push("firm_name = ?");
    values.push(firm_name);
  }
  if (stamp && stamp !== '0') {
    fields.push("stamp = ?");
    values.push(stamp);
  }
  if (fr_machine && fr_machine !== '') {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE voucher_entry SET ${fields.join(", ")} WHERE v_no = ?`;
  values.push(v_no);

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry updated successfully!", details: results });
  });
});

//Api to view all Type/Department/Firm
router.post("/viewGroup", (req, res) => {
  const { Group } = req.body;
  // console.log(Group);

  if (!Group) {
    return res.status(400).json({ message: "Group parameter is required" });
  }

  let sql;
  switch (Group) {
    case 'D':
      sql = `SELECT dept_id AS id ,dept_name AS name FROM dept`;
      break;
    case 'F':
      sql = `SELECT firm_id AS id ,firm_name AS name FROM firms`;
      break;
    case 'T':
      sql = `SELECT post_id AS id,post_name AS name  FROM post_type`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving data", details: err });
    }
    return res.status(200).json(results);
  });
});

//Api to create New Type/Department/Firm
router.post("/newGroup", (req, res) => {
  const { Group, name } = req.body;
  console.log(Group, name);

  if (!Group || !name) {
    return res.status(400).json({ message: "Group and name parameters are required" });
  }

  let sql;
  switch (Group) {
    case 'D':
      sql = `INSERT INTO dept (dept_name) VALUES (?)`;
      break;
    case 'F':
      sql = `INSERT INTO firms (firm_name) VALUES (?)`;
      break;
    case 'T':
      sql = `INSERT INTO post_type (post_name) VALUES (?)`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }
  db.query(sql, [name], (err, results) => {
    if (err) {
      console.error("Error inserting group:", err);
      return res.status(500).json({ message: "Error inserting group", details: err });
    }
    return res.status(200).json({ message: "Group created successfully!", details: results });
  });
});

export default router;