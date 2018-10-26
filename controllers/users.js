import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from '../models/db/index';
import validateUser from '../middleware/userValidation';

dotenv.config();

class User {
  static async createUser(req, res) {
    const { error } = validateUser(req.body);

    if (error) res.status(400).send(error.details[0].message);

    const result = await db.query('SELECT * FROM users where email =$1', [req.body.email]);

    if (result.rowCount >= 1) {
      res.status(400).json({ message: 'This email has already been registered' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const {
        name,
      } = req.body;
      const password = await bcrypt.hash(req.body.password, salt);
      const {
        email,
      } = req.body;
      try {
        const {
          rows,
        } = await db.query('INSERT INTO users(name, password, email) VALUES($1,$2,$3) returning id, name,email', [name, password, email]);
          // returning id, name and email returns just those without the other fields
        const userId = await db.query('SELECT id FROM users WHERE email = $1', [req.body.email]);
        const token = jwt.sign({
          email,
          id: userId.rows[0],
          name,
        },
        process.env.JWT_KEY);
        res.header('x-auth-token', token).status(201).json({
          message: 'user successfully created!',
          user: rows[0],
        });
      } catch (err) {
        res.status(500).send('error occured while creating user, please try again later');
      }
    }
  }

  static async loginUser(req, res) {
    const email = await db.query('SELECT email FROM users WHERE email = $1', [req.body.email]);
    // the error msg only worked when i added the row[0] to it, it wont work without it
    if (!email.rows[0]) {
      res.status(400).json({
        message: 'Invalid email or password',
      });
    } else {
      const {
        rows,
      } = await db.query('SELECT password FROM users WHERE email = $1', [req.body.email]);
      // before the bcrypt.compare worked,
      // i had to first search for the email with the password i want to decrypt,
      // i then selected the password directly from the row
      const validPassword = await bcrypt.compare(req.body.password, rows[0].password);
      if (!validPassword) {
        res.status(400).json({
          message: 'Invalid email or password',
        });
      } else {
        const userId = await db.query('SELECT id FROM users WHERE email = $1', [req.body.email]);

        const name = await db.query('SELECT name FROM users WHERE email = $1', [req.body.email]);

        const token = jwt.sign({
          email: email.rows[0],
          id: userId.rows[0],
          name: name.rows[0],
        },
        process.env.JWT_KEY);

        try {
          res.status(200).json({
            message: 'login succesful!',
            token,
          });
        } catch (error) {
          res.status(500).send('please try again later');
        }
      }
    }
  }

  static async deleteUser(req, res) {
    let {
      rows,
    } = await db.query(`SELECT * from users WHERE id = ${req.params.id}`);
    if (req.userData.id.id !== rows[0].id) {
      res.status(403).json({
        message: 'You cannot delete this account',
      });
    } else {
      rows = await db.query(`DELETE from users where id = ${req.params.id}`);
      try {
        res.status(200).json({
          message: 'Your account has been successfully deleted',
          details: rows[0],
        });
      } catch (error) {
        res.status(500).send('An error occured while trying to delete your account');
      }
    }
  }
}
export default User;
// the endpoints were all written as async function before i converted it to a class

// export const createUserController = createUser;
// export const loginUserController = loginUser;
// export const deleteUserController = deleteUser;
