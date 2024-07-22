import express from "express"
import db from "../db.js"
const router = express.Router();
router.use(express.json());// Middleware to parse JSON bodies

//Api to generate inward outward entry 
router.post("/getInOutReports", (req, res) => {
  const { from_date, to_date, flag, post_type, firm_id } = req.body;

  // console.log(from_date, to_date, flag, post_type, firm_id);

  const sql = `
   SELECT 
      a.entry_id,
      a.entry_date,
      a.remark,
      a.receipt_no,
      a.qty,
      a.flag,
      a.fr_machine,
      a.charges,
      a.firm_id,
      b.firm_name,
      a.dept_id,
      c.dept_name,
      d.city_name
    FROM 
      post_entry AS a
    JOIN 
      firms AS b ON a.firm_id = b.firm_id
    JOIN 
      dept AS c ON a.dept_id = c.dept_id
      JOIN 
      cities AS d ON a.city_name = d.city_id
    WHERE 
      a.entry_date BETWEEN ? AND ?
      AND a.flag = ?
      AND (a.post_type = ? OR ? = 0)
      AND (a.firm_id = ? OR ? = 0)`;

  db.query(sql, [from_date, to_date, flag, post_type, post_type, firm_id, firm_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong...!", details: err });
    }
    return res.status(200).json(results);
  });
});


export default router;