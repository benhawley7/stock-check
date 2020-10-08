# Stock Check
Using TypeScript to read and manipulate arrays of stock and transactions.

## How to...?

### Clone the repo
Clone from github (ssh):

```bash
git clone git@github.com:benhawley7/stock-check.git
```

### Install
Install the NodeJs modules:
```bash
npm install
```

### Run the code
Running the npm start will execute the `src/app.ts` file, prompting a terminal input for a SKU code:

```bash
npm start
```

Alternatively, you may wish to directly access the `calculateCurrentStockLevel(sku: string): Promise<{sku: string, qty: number}>` function, this function is exported by `src/products.ts`.

The data (stocks and transactions) used by the project is located in the `data` folder.

### Run the test suite
To execute the test suite run the following command:

```bash
npm run test
```

### Test code formatting / style
You can test the code style and formatting using the linter with the command:

```bash
npm run lint
```