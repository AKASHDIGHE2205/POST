import express from "express"
import db from "../db.js"
const router = express.Router();
router.use(express.json());// Middleware to parse JSON bodies

//Api to generate inward outward entry 
router.post("/getInOutReports", (req, res) => {

  const { from_date, to_date, flag, post_type, firm_id, loc_id } = req.body;
  console.log(from_date, to_date, flag, post_type, firm_id, loc_id);

  const sql = `
   SELECT 
      a.entry_id,
      a.rec_no,
      a.rec_date,
      a.entry_date,
      a.party_name,
      a.remark,
      a.receipt_no,
      a.qty,
      a.flag,
      a.charges,
      c.dept_name,
      a.city_name,
      a.firm_id,
      b.firm_name
    FROM 
      post_entry AS a
    JOIN 
      firms AS b ON a.firm_id = b.firm_id
    JOIN 
      dept AS c ON a.dept_id = c.dept_id
    WHERE 
      a.entry_date BETWEEN ? AND ?
      AND a.flag = ?
      AND (a.post_type = ? OR ? = 0)
      AND (a.firm_id = ? OR ? = 0)
      AND a.status ='A' 
      AND a.loc_id = ?
      ORDER BY a.entry_date ASC, a.entry_id, a.firm_id ASC `;

  db.query(sql, [from_date, to_date, flag, post_type, post_type, firm_id, firm_id, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong...!", details: err });
    }
    return res.status(200).json(results);
  });
});

router.post("/getInOutSum", (req, res) => {
  const { from_date, to_date, flag, post_type, firm_id, loc_id } = req.body;

  console.log(from_date, to_date, flag, post_type, firm_id, loc_id);

  const sql =
    `SELECT 
        a.firm_id,
        b.firm_name,
        SUM(a.qty) AS total_qty,
        SUM(a.charges) AS total_charges
    FROM 
        post_entry AS a
    JOIN 
        firms AS b ON a.firm_id = b.firm_id
    JOIN 
        dept AS c ON a.dept_id = c.dept_id
    WHERE 
        a.entry_date BETWEEN ? AND ?
        AND a.flag = ?
        AND (a.post_type = ? OR ? = 0)
        AND (a.firm_id = ? OR ? = 0)
        AND a.status ='A'
        AND a.loc_id = ?
    GROUP BY
        a.firm_id, b.firm_name`;

  db.query(sql, [from_date, to_date, flag, post_type, post_type, firm_id, firm_id, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong...!", details: err });
    }
    return res.status(200).json(results);
  });
});
export default router;