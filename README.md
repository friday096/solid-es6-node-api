# Solid Principle Node ES6 Boilerplate API application based on MongoDB

## SOLID Principles

The SOLID principles are a set of design principles intended to make software designs more understandable, flexible, and maintainable. They include:

- **S**ingle Responsibility Principle (SRP): A class should have one, and only one, reason to change. This means that each class should focus on a single task or responsibility.

- **O**pen/Closed Principle (OCP): Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification. This encourages you to extend the functionality of a class without modifying its existing code.

- **L**iskov Substitution Principle (LSP): Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program. This ensures that a subclass can stand in for its superclass.

- **I**nterface Segregation Principle (ISP): A client should not be forced to implement interfaces it does not use. Instead, multiple specific interfaces are better than a single general-purpose interface.

- **D**ependency Inversion Principle (DIP): High-level modules should not depend on low-level modules. Both should depend on abstractions. This reduces the coupling between components, making the system easier to maintain and extend.

## Features

- User Registration
- User Login
- Password Reset
- Token-based Authentication
- Send Email Notifications

## Available Scripts

Use `npm run dev` to run the project.

```bash
MONGO_URI=''
SMTP_USER=''  # email
SMTP_PASS=''  # app-password
JWT_SECRET=jwt_secret_2024
APP_PORT=8081
ERROR_CODE=201
SUCCESS_CODE=200
EMAIL_FROM='your_email@example.com'
