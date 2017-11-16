# Node Question ORM Migration Walkthrough

## Objectives

1. Define a `.CreateTable()` `static` class function for `Question`
2. Write a `CREATE TABLE` SQL Statement for the `Question` class.
3. Return a `Promise` for the `CreateTable()` function.
4. Execute a SQL Statement using the `sqlite3` NPM package with `db.run()`

## Instructions

In `models/Question.js` there is an empty class. The goal is to build a `static` class function `CreateTable` that can execute the necessary SQL to create a `questions` table in our database that has an `id` column set to an `INTEGER PRIMARY KEY` and a `content` `TEXT` column. In order to function properly, the database execution must be wrapped in a `Promise` that resolves. 

**SPOILER: Below you will find Walkthrough Instructions for solving the lab**

## Walkthrough Instructions

**These instructions are progressive and if you follow them you will solve the lab. Only the final code block is the solution, all other code blocks are building up to it.**

To pass this lab, let's first stub out a `static` function in the `Question` class in `models/Question.js`

**File: [models/Question.js](models/Question.js)**
```js
class Question{
  static CreateTable() {
  }
}
```

Running the tests in this current state produces:

```
  Question
    as a class
      .CreateTable()
        ✓ exists
        1) returns a promise
        2) creates a new table in the database named 'questions'
        3) adds 'id' and 'content' columns to the 'questions' table


  1 passing (16ms)
  3 failing

  1) Question
       as a class
         .CreateTable()
           returns a promise:
           AssertionError: expected undefined to be an instance of Promise

```

Focusing only on the first error, we know that ultimately `CreateTable` should be returning a promise. Let's implement that as naively as possible.

**File: [models/Question.js](models/Question.js)**
```js
class Question{
  static CreateTable() {
    return new Promise(function(resolve){
      resolve("This Does Nothing!")
    })
  }
}
```

Running the tests again in the state above shows:

```
  Question
    as a class
      .CreateTable()
        ✓ exists
        ✓ returns a promise
        1) creates a new table in the database named 'questions'
        2) adds 'id' and 'content' columns to the 'questions' table

  2 passing (12ms)
  2 failing

  1) Question
       as a class
         .CreateTable()
           creates a new table in the database named 'questions':
           TypeError: Cannot read property 'name' of undefined
```

Progress! Excellent. We now need to ensure that our function actually creates a table. Let's first focus on that SQL, again, relatively naively, only including the SCHEMA for a single column, `id`, our `INTEGER PRIMARY KEY`.

```sql
CREATE TABLE questions (id INTEGER PRIMARY KEY)
```

We'll need to execute that SQL against the DB using the `sqlite3` database driver. Since there is no return value to a `CREATE TABLE` statement, [`db.run()`](https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback) is the ideal database driver function. 

We also have to move the resolution of our promise into the callback of `db.run()`, ensuring that the promise is only resolved AFTER the SQL statement is actually executed.

**File: [models/Question.js](models/Question.js)**
```js
class Question{
  static CreateTable() {
    return new Promise(function(resolve){
      const sql = `CREATE TABLE questions (id INTEGER PRIMARY KEY)`
      db.run(sql, function(){
        resolve("questions table created")
      })      
    })
  }
}
```

```
  Question
    as a class
      .CreateTable()
        ✓ exists
        ✓ returns a promise
        ✓ creates a new table in the database named 'questions'
        1) adds 'id' and 'content' columns to the 'questions' table
  
  3 passing (18ms)
  1 failing

  1) Question
       as a class
         .CreateTable()
           adds 'id' and 'content' columns to the 'questions' table:

          'questions' table is missing a 'content' field with type 'TEXT'
```

With only one test failing, the error output gives us a clear hint of what to do next. Add the `content` column of type `TEXT` to our SQL.

** Solution **
**File: [models/Question.js](models/Question.js)**
```js
class Question{
  static CreateTable() {
    return new Promise(function(resolve){
      const sql = `CREATE TABLE questions (
        id INTEGER PRIMARY KEY,
        content TEXT
      )`

      db.run(sql, function(){
        resolve("questions table created")
      })      
    })
  }
}
```

A final run of the test suite gives us all green.

```
  Question
    as a class
      .CreateTable()
        ✓ exists
        ✓ returns a promise
        ✓ creates a new table in the database named 'questions'
        ✓ adds 'id' and 'content' columns to the 'questions' table


  4 passing (17ms)
```