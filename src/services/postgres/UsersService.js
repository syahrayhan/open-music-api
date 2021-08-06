const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const InvariantError = require('../../exceptions/InvariantError')

class UsersService {
  constructor () {
    this._pool = new Pool()
  }

  async addUser ({ username, password, fullname }) {
    await this.verifyNewUser(username)
    const id = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add user')
    }

    return result.rows[0].id
  }

  async verifyNewUser (username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('Failed to add user. Username already used')
    }
  }
}

module.exports = UsersService
