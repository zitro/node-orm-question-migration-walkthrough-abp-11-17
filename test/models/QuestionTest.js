'use strict';

const { expect } = require('chai');

const db = require('../../config/db');

const Question = require('../../models/Question');

function getTableInfo(tableName){
  return new Promise(function(resolve){
    const sql = `SELECT * FROM sqlite_master WHERE type = 'table' AND name = ?`
    db.get(sql, [ tableName ], function(err, row){
      resolve(row);
    });
  })
};

async function resetDB(){
  return new Promise(async function(resolve){
    await db.run(`DROP TABLE IF EXISTS questions`, function(){
      resolve("dropped the questions table")      
    })
  })
}; 

describe('Question', () => {
  describe('as a class', () => {
    describe('.CreateTable()', () => {
      beforeEach(async function() {
        await resetDB()
      })
      afterEach(async function() {
        await resetDB()
      })      

      it('exists', async () => {
        expect(Question.CreateTable).to.be.a('function');
      });
      
      it("returns a promise", async function(){
        const CreateTablePromise = Question.CreateTable()

        expect(CreateTablePromise).to.be.an.instanceOf(Promise);
      })

      it("creates a new table in the database named 'questions'", async () => {
        await Question.CreateTable();

        const table = await getTableInfo('questions')
        
        expect(table.name).to.eq('questions');
      });

      it("adds 'id' and 'content' columns to the 'questions' table", async () => {
        await Question.CreateTable();

        const { sql } = await getTableInfo('questions');

        const idFieldExists = sql.indexOf('id INTEGER PRIMARY KEY') > -1;
        const contentFieldExists = sql.indexOf('content TEXT') > -1;

        expect(idFieldExists, "'questions' table is missing an 'id' field with type 'INTEGER' and modifier 'PRIMARY KEY'").to.eq(true);
        expect(contentFieldExists, "'questions' table is missing a 'content' field with type 'TEXT'").to.eq(true);
      });
    });
  });
});
