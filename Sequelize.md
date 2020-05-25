# Sequelize

> Sequelize는 ORM(Object-Relational Mapping)중 하나로
> Node.js로 mysql이나 postgresql과 같은 데이터베이스를 제어할 수 있게 해줌

 ## ORM을 왜 사용하는가?

- 데이터베이스의 구조를 프로젝트의 폴더 구조와 코드를 통해서 확인 가능
- 유효성 검사를 편리하게 할 수 있음

## 실습 프로젝트 시작하기

### 전체 프로젝트 파일

> https://github.com/pathas1126/express-sequelize-practice/tree/ca0bdc1d0b710ee0e6a918a4420acf7317a9b834
> Express 강의를 따라했던 소스로 위 주소의 파일을 압축으로 받아서 해제하거나 git clone을 통해 로컬 저장소에 저장

### 프로젝트 의존 패키지 설치

```bash
$ npm install
```

- node_modules는 .gitignore에 의해 프로젝트에서 제외되어 있음으로 위의 명령어를 통해 필요한 패키지 설치

# dotenv 설정하기

> 데이터베이스 관련 환경설정 변수들을 dotenv 파일로 관리함으로써,
> 협업하는 경우 여러 사람이 각자의 DB를 통해 편하게 작업할 수 있게 됨

## 패키지 설치

```bash
$ npm i dotenv
```

## 환경 변수 파일 작성

### 예제 파일 생성

> 프로젝트 루트에 .env.sample 파일 생성 후 아래 코드 작성

```javascript
DATABASE = "데이터베이스명"
DB_USER = "root"
DB_PASSWORD = "패스워드"
DB_HOST = "DB호스트"
```

- 샘플 파일을 만들어 둠으로써 실제 .env 파일에 입력해야 하는 값을 알 수 있음
- 실제 .env 파일은 개인 정보를 포함하고 있어서 github과 같이 오픈된 저장소에 올릴 수는 없기 때문에 예제 파일을 만들어서 협업하는 개발자들에게 어떤 환경 변수가 필요한 지 알림

### 실제 환경 변수 파일 생성

> 프로젝트 루트에 .env 파일 생성 후 아래 코드 작성

```javas
DATABASE = "exercise"
DB_USER = "root"
DB_PASSWORD = "root 계정 PWD"
DB_HOST = "localhost"
```

- .env 파일에 작성한 환경 변수는 프로젝트 어디에서나 process.env의 속성으로 접근 가능
  ex) process.env.DATABASE
- 실제 .env 파일은 .gitignore에 추가해서 git이 추적하지 않도록 해야 함

*※ .env 파일에 코드를 작성할 때 줄 마지막에 띄어쓰기가 있다면 에러가 발생함으로 주의!!*

# Database 생성

> 프로젝트에서 사용할 MySQL DB 생성

## MySQL 로그인

```bash
$ mysql -u root -p
$ ###### 
```

- 위의 명령어는 cmd의 위치를 mysql의 bin 폴더로 옮긴 뒤 실행

## DATABASE 생성

```sql
CREATE DATABASE exercise;
Query OK, 1 row affected (0.02 sec)
```

## DATABASE 확인

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| blog               |
| dailycoding        |
| exercise           | => exercise 데이터베이스 생성
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| workbench          |
+--------------------+
```

# DB 접속

> Sequelize를 통해서 Database에 접근

## 라이브러리 설치

```bash
$ npm i mysql2 sequelize@4.42.0
```

- mysql2: mysql 데이터베이스에 접근하는 것을 도와주는 라이브러리
- sequelize: node.js로 MySQL에 접근하는 것을 도와주는 라이브러리, ORM

## DATABASE 동기화

### DB 접근 파일 작성

> 프로젝트 루트에 models 폴더 생성 후 index.js 파일 작성

```javascript
var Sequelize = require("sequelize");
var path = require("path");
var fs = require("fs");
var dotenv = require("dotenv");

dotenv.config(); //LOAD CONFIG

// Sequelize를 초기화하며 인스턴스를 생성
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+09:00", //한국 시간 셋팅
    operatorsAliases: Sequelize.Op,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

let db = [];

// models 폴더 내부에 index.js 파일을 제외한 js 파일을
// Sequelize와 연동하는 코드
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".js") && file !== "index.js";
  })
  .forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// 외부키가 있는 경우 연결하는 코드
Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

### app.js에서 DB 접속하기

> app.js 파일을 아래와 같이 수정

```javascript
// ...
const db = require("./models");

class App {
  constructor() {
    this.app = express();

    // db 접속
    this.dbConnection();
      
	// ...	
  }

  dbConnection() {
    // DB authentication
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .then(() => {
        console.log("DB Sync complete.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

    // ...
```

- `npm start` 명령어로 결과 확인

# 모델 작성

> SQL에서는 테이블을 작성하는 것과 동일

## Products 모델 작성

> models 폴더에 Products.js 파일 생성 후 아래 코드 작성

```javascript
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define("Products", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
  });
  return Products;
};
```

- Products 모델 작성
- id, name, price, description 네 개의 칼럼을 갖는 테이블
- DataTypes: 데이터 형식 지정
- primaryKey: 해당 칼럼을 주요키로 설정, 주요키는 고유의 값을 가지면서 각각의 로우를 구분하는 역할을 함
- autoIncrement: 입력값이 없는 경우 자동으로 1씩 증가됨

## model 동기화 하기

> app.js 파일을 아래와 같이 수정

```javascript
// ...
  dbConnection() {
    // DB authentication
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .then(() => {
        console.log("DB Sync complete.");
        return db.sequelize.sync();
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }
// ...
/*
Executing (default): CREATE TABLE IF NOT EXISTS `Products` (`id` INTEGER auto_increment 
, `name` VARCHAR(255), `price` INTEGER, `description` TEXT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `Products`
*/
```

- 두 번째 then의 return 이하에서 데이터베이스를 동기화함
- CMD 창이나 워크 벤치로 exercise 데이터베이스를 조회해 보면,
  Products 테이블이 생성된 것을 볼 수 있음