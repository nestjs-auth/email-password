# `nestjs-jwt-auth` A plug-and-play auth module for the NestJS framework 🚀.

_This project is currently in development. More updates and a stable release to come!_

## Installation

`npm install --save nestjs-jwt-auth`

## Usage

```ts
// app.module.ts
import { NestAuthModule } from 'nestjs-jwt-auth';


imports: [
	NestAuthModule,
]
```

The `nestjs-jwt-auth` module will automatically load your database connection.

You must have a database table called `user` with at least the fields:

- username
- password
