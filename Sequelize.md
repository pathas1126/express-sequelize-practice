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
DATABASE = "M"
DB_USER = "root"
DB_PASSWORD = "패스워드"
DB_HOST = "DB호스트"
```

- .env 파일에 작성한 환경 변수는 프로젝트 어디에서나 process.env의 속성으로 접근 가능
  ex) process.env.DATABASE
- 