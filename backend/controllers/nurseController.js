const pool = require("../db")

// GET all nurses
//  const getNurses = async (req, res) => {
//     console.log(">>>>>>>>>>>>>>>");
    
//   try {
//     const result = await pool.query("SELECT * FROM nurses ORDER BY id ASC");
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getNurses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     const nurses = await pool.query(
//       "SELECT * FROM nurses ORDER BY id ASC LIMIT $1 OFFSET $2",
//       [limit, offset]
//     );

//     const totalCount = await pool.query("SELECT COUNT(*) FROM nurses");

//     res.json({
//       data: nurses.rows,
//       total: parseInt(totalCount.rows[0].count),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getNurses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const nurses = await pool.query(
      "SELECT * FROM nurses ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const totalCount = await pool.query("SELECT COUNT(*) FROM nurses");

    res.json({
      data: nurses.rows,
      total: parseInt(totalCount.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD a nurse
 const addNurse = async (req, res) => {
  const { name, license_number, dob, age } = req.body;
  console.log(req.body,"boooooooo");
  
  try {
    await pool.query(
      "INSERT INTO nurses (name, license_number, dob, age) VALUES ($1,$2,$3,$4)",
      [name, license_number, dob, age]
    );
    res.json({ message: "Nurse added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a nurse
 const updateNurse = async (req, res) => {
  console.log(req.params,">>>>>>>>>>>>");
  
  const { id } = req.params;
  const { name, license_number, dob, age } = req.body;
  try {
    await pool.query(
      "UPDATE nurses SET name=$1, license_number=$2, dob=$3, age=$4 WHERE id=$5",
      [name, license_number, dob, age, id]
    );
    res.json({ message: "Nurse updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Nurse Controller
const deleteNurse = async (req, res) => {
  try {
    const { id } = req.params;

    // delete from database
    const result = await pool.query("DELETE FROM nurses WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    res.status(200).json({ message: "Nurse deleted successfully", nurse: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting nurse" });
  }
};

module.exports = { getNurses ,addNurse,updateNurse,deleteNurse};

