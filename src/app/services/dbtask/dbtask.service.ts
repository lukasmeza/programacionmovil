import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {
  /**
   * Se declara una variable SQLiteObject y se inicializa en null
   * donde se guardara la instancia de SQLiteObject
   */
  db: SQLiteObject = null;

  constructor() {}
  /**
   * Permite guardar un objeto SQLiteObject
   * en la variable db
   */
  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }
  /**
   * Crea las tablas necesarias para el funcionamiento
   */
  createTables(): Promise<any> {
    let tables = `
    CREATE TABLE IF NOT EXISTS session_data
    (
      user_name TEXT PRIMARY KEY NOT NULL,
      password INTEGER NOT NULL,
      active INTEGER(1) NOT NULL
    );
    `;
    return this.db.executeSql(tables);
  }
  /**
   * Retorna si existe un usuario activo o no.
   */
  sessionActive() {
    // Se desarrolla la consulta
    let sql = `SELECT user_name,active FROM session_data WHERE active=1 LIMIT 1`;
    // Se ejecuta la consulta y no le pasamos parametros [value,value1,...]
    return (
      this.db
        .executeSql(sql, [])
        // Cuando se ejecute la consulta
        .then((response) => {
          // obtenemos lo que devuelve la consulta
          return Promise.resolve(response.rows.item(0)); // Se obtiene el primer item de la consulta y se retorna
        })
    );
  }
  /**
   * Función que valida la existencia del usuario que esta iniciando sesión
   * @param session Datos de inicio de sesión Usuario y Password
   */
  getSessionData(session: any) {
    let sql = `SELECT user_name, active FROM session_data
    WHERE user_name=? AND password=? LIMIT 1`;
    return this.db
      .executeSql(sql, [session.Usuario, session.Password])
      .then((response) => {
        return Promise.resolve(response.rows.item(0));
      });
  }
  /**
   * Función que crea un nuevo registro de inicio de sesión
   * @param session Datos de inicio de sesión Usuario, Password y Active
   */
  createSessionData(session: any) {
    let sql = `INSERT INTO session_data(user_name,password,active)
    VALUES(?,?,?)`;
    return this.db
      .executeSql(sql, [session.Usuario, session.Password, session.Active])
      .then((response) => {
        return Promise.resolve(response.rows.item(0));
      });
  }
  updateSessionData(session: any) {
    let sql = `UPDATE session_data
    SET active=?
    WHERE user_name=?`;
    return this.db.executeSql(sql, [session.active, session.user_name]);
  }
}
