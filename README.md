# Simple CronJob parser

## Prerequisites

- Node.js

## AI Usage

This project was created using Copilot in autocomplete mode.

## Supported characters
- `*` (asterisk): Represents all possible values for a field.
- `,` (comma): Separates multiple values for a field.
- `-` (dash): Specifies a range of values.
- `/` (slash): Specifies increments of values.
- `\d+` (number): Represents specific numeric values.

## Usage

1. Install
   ```bash
   npm install https://github.com/chivud/cron-parser
   ```
2. Import and use
   ```typescript
    import {parseCronExpression} from 'cron-parser';
    
    const cronExpression = '* * * * * bash';
    
    console.log(parseCronExpression(cronExpression));
   ```
## Scripts:
- `build`: Compile TypeScript to JavaScript
- `test`: Run tests using Jest
- `test:coverage`: Run tests with coverage report
- `dev`: Start development mode
- `start`: Start the compiled application
- `format`: Format code using Prettier