const pool = require("../config/db");

const getRoles = async () => {
  const result = await pool.query("SELECT * FROM roles");
  return result.rows;
};

const getPermissionsForRole = async (roleName) => {
  const result = await pool.query(
    `SELECT * FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permissions_id
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = $1
    `,
    [roleName]
  );

  return result.rows.map((r) => r.name);
};

module.exports = { getRoles, getPermissionsForRole };
