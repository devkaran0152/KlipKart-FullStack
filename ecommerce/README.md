# E-commerce Order Management System

Spring Boot backend scaffold using Java 21, Maven, Spring Web, Spring Data JPA,
MySQL, Validation, Lombok, and DevTools.

## Package structure

- `com.ecommerce.controller`
- `com.ecommerce.service`
- `com.ecommerce.repository`
- `com.ecommerce.entity`
- `com.ecommerce.dto`
- `com.ecommerce.exception`
- `com.ecommerce.config`

## Before running

1. Create a MySQL database: `CREATE DATABASE ecommerce_db;`
2. Open `src/main/resources/application.properties`.
3. Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.
4. In Eclipse, import this folder using **File > Import > Maven > Existing Maven Projects**.
5. Right-click the project > **Maven > Update Project**, then run `EcommerceApplication.java`.

Do not commit real database passwords to Git.
