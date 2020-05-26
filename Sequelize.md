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

# DB 입력 create

> sequelize를 이용해 위에서 작성한 모델에 데이터를 추가하는 것
> sql 문으로는 INSERT문에 해당

## 서버에서 POST 요청 경로 처리

> 클라이언트에서 form 양식을 통해 POST로 요청할 경로를 서버에서 처리
> admin.ctrl.js 파일을 아래와 같이 수정

```javascript
const models = require("../../models");

// ...
exports.post_products_write = (req, res) => {
  const { name, price, description } = req.body;
  models.Products.create({
    name,
    price,
    description,
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      throw error;
    });
};

// controllers/admin/index.js의 아래 코드로 POST 요청을 받음
router.post("/products/write", ctrl.post_products_write);

// 결과 로그
/*
Executing (default): INSERT INTO `Products` (`id`,`name`,`price`,`description`,`createdAt`,`updatedAt`) VALUES (DEFAULT,'안녕','15000','이것은 안녕이라는
제품','2020-05-26 09:31:13','2020-05-26 09:31:13');
*/
```

- create 메서드로 칼럼 추가, sql에서의 INSERT와 동일한 역할
- 칼럼 추가 후 redirect 메서드로 products 페이지로 리다이렉션

# DB 조회 findAll

> sequelize를 이용해서 모델에서 데이터를 조회하는 것
> sql 문의 select * from 문과 유사

## sequelize 데이터 조회하기

> admin.ctrl.js 파일을 아래와 같이 수정

```javascript
const models = require("../../models");

exports.get_products = (_, res) => {
  // res.render(
  //   "admin/products.nunjucks",
  //   { message: "hello" } // message 란 변수를 템플릿으로 내보낸다.
  // );
  models.Products.findAll({})
    .then((products) => {
      res.render("admin/products.nunjucks", {
        products,
      });
    })
    .catch((error) => {
      throw error;
    });
};
// ...

// controllers/admin/index.js에서 아래 경로로 GET 요청을 받음
router.get("/products", ctrl.get_products);
```

- findAll 메서드를 통해서 조건에 해당하는 모든 데이터 조회 
- findOne 메서드를 사용하면 하나의 데이터만 조회

## Nunjucks 에서 데이터 출력하기

> admin/products.nunjucks 파일을 아래와 같이 수정

```html
{% set title = "관리자 리스트" %}
{% extends "layout/base.nunjucks" %}

{% block content -%}
  <table class="table table-bordered table-hover">
    <tr>
      <th>제목</th>
      <th>작성일</th>
      <th>삭제</th>
    </tr>

    {% for product in products %}
      <tr>
        <td>{{product.name}}</td>
        <td>
          {{product.createdAt}}
        </td>
        <td>
          <a href="#" class="btn btn-danger">삭제</a>
        </td>
      </tr>
    {% endfor %}
  </table>

  <a href="/admin/products/write" class="btn btn-default">작성하기</a>

{% endblock %}
```

- {% for Element in Array %} ~ {% endblock %}: Nunjucks의 for문을 사용해서 그 안에 데이터를 출력
- 결과를 보면 form에서 데이터를 추가할 때마다 조회도 잘 되는 것을 확인할 수 있음

# DB 조회  findOne, findByPk

> sequelize를 이용해서 모델에서 특정 데이터만 조회하는 것
> sql에서 where 조건식을 사용한 select문과 유사

## 상세 페이지 만들기

### 상품별 링크 달기

> products.nunjucks의 소스 코드를 아래와 같이 수정

```html
<!-- ... -->
    {% for product in products %}
      <tr>
        <td>
          <a href="/admin/products/detail/{{product.id}}">
            {{product.name}}
          </a>
        </td>
        <td>
          {{product.createdAt}}
        </td>
        <td>
          <a href="#" class="btn btn-danger">삭제</a>
        </td>
      </tr>
    {% endfor %}
<!-- ... -->
```

- 이름을 클릭하면 상품의 id가 포함된 주소로 이동하며 같은 주소로 GET 요청을 보냄

### 서버에서 GET 요청 처리할 경로 설정

> controllers/admin/index.js를 다음과 같이 수정

```javascript
// ...
router.get("/products/detail/:id", ctrl.get_products_detail);

module.exports = router;
```

### 컨트롤러에서 GET 요청 처리

> admin.ctrl.js를 다음과 같이 수정

```javascript
// ...
exports.get_products_detail = (req, res) => {
  const { id } = req.params;
  models.Products.findByPk(id).then((product) => {
    res.render("admin/detail.nunjucks", { product });
  });
};
```

- /:param 형식으로 작성된 변수는 요청의 params 속성으로 조회 가능
- findByPk 메서드를 사용해서 Pk값이 id 변수의 값과 일치하는 데이터 조회

### 상세 페이지 만들기

> template/admin 폴더에 detail.nunjucks 파일 작성

```html
{% set title = "관리자 : 상세페이지" %}
{% extends "layout/base.nunjucks" %}

{% block content -%}
    <div class="panel panel-default">
        <div class="panel-heading">
            {{ product.name }}
        </div>
        <div class="panel-body">
            <div style="padding-bottom: 10px">
                작성일 :
                {{ product.createdAt }}
            </div>

            {{ product.description }}

        </div>
    </div>

    <a href="/admin/products" class="btn btn-default">목록으로</a>
    <a href="/admin/products/edit/{{ product.id }}" class="btn btn-primary">수정</a>

{% endblock %}
```

- 각각의 데이터를 적당한 위치에 출력

# Sequelize에 메서드 추가하기

> 날짜 형식을 개선하기 위해 moment.js 를 이용해서 sequelize에 메서드 추가

## moment.js

> https://momentjs.com/
> 날짜 형식을 조정하기 위해 많이 사용되는 라이브러리

### 설치

```bash
$ npm i moment
```

### Products 모델에 메서드 추가

> Products.js를 다음과 같이 수정

```javascript
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define("Products", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
  });

  Products.prototype.dateFormat = (date) => moment(date).format("YYYY년 MM월 DD일");

  return Products;
};
```

- moment 패키지를 가져옴
- Products 모델에 prototype을 이용해서 dateFormat 메서드 추가
- YYYY, MM, DD와 같이 정해진 양식을 제외하고는 자유롭게 작성 가능
- 유용하거나 여러 곳에서 사용할 수 있는 기능은 view(html, nunjucks etc.)에서 직접 작성하는 것보다 메서드로 만들어서 prototype에 등록해 두면 다양한 곳에서 재사용 가능하기 때문에 가능한 models에 메서드로 정의하는 것이 권장됨

### 메서드 사용하기

> products.nunjucks, detail.nunjucks 파일의 날짜 출력 부분을 아래와 같이 수정

```html
<!-- ... -->
	{{product.dateFormat(product.createdAt)}}
<!-- ... -->
```

- Product 모델에 prototype 으로 등록한 dateFormat 메서드를 product의 메서드로 사용 가능
- 결과를 보면 포맷에 맞게 날짜가 출력되는 것을 볼 수 있음

# DB 수정

> sequelize를 이용해 데이터베이스 내부의 데이터를 수정하는 것

## 서버에서 요청이 들어올 경로 처리하기

### 라우터에 경로 추가하기

```javascript

```



