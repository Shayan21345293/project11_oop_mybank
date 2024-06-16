#! /usr/bin/env node
import inquirer from 'inquirer';
// Customer class
class Customer {
    name;
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
// Account class
let nextAccountNumber = 1;
class Account {
    accountNumber;
    balance;
    customer;
    constructor(customer, initialBalance) {
        this.accountNumber = nextAccountNumber++;
        this.balance = initialBalance;
        this.customer = customer;
    }
    getAccountNumber() {
        return this.accountNumber;
    }
    getBalance() {
        return this.balance;
    }
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
        }
        else {
            console.log('Deposit amount must be positive.');
        }
    }
    withdraw(amount) {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
        }
        else {
            console.log('Insufficient funds or invalid amount.');
        }
    }
}
// Bank class
class Bank {
    accounts = [];
    createAccount(customer, initialBalance) {
        const account = new Account(customer, initialBalance);
        this.accounts.push(account);
        return account;
    }
    getAccount(accountNumber) {
        return this.accounts.find(account => account.getAccountNumber() === accountNumber);
    }
}
// Main function
const bank = new Bank();
async function main() {
    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Create Account', 'Deposit', 'Withdraw', 'Check Balance', 'Exit'],
        });
        switch (action) {
            case 'Create Account':
                await createAccount();
                break;
            case 'Deposit':
                await deposit();
                break;
            case 'Withdraw':
                await withdraw();
                break;
            case 'Check Balance':
                await checkBalance();
                break;
            case 'Exit':
                return;
        }
    }
}
async function createAccount() {
    const { name, initialBalance } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
        },
        {
            type: 'number',
            name: 'initialBalance',
            message: 'Enter initial balance:',
        },
    ]);
    const customer = new Customer(name);
    const account = bank.createAccount(customer, initialBalance);
    console.log(`Account created successfully! Your account number is ${account.getAccountNumber()}.`);
}
async function deposit() {
    const { accountNumber, amount } = await inquirer.prompt([
        {
            type: 'number',
            name: 'accountNumber',
            message: 'Enter your account number:',
        },
        {
            type: 'number',
            name: 'amount',
            message: 'Enter the amount to deposit:',
        },
    ]);
    const account = bank.getAccount(accountNumber);
    if (account) {
        account.deposit(amount);
        console.log(`Deposited ${amount}. New balance is ${account.getBalance()}.`);
    }
    else {
        console.log('Account not found.');
    }
}
async function withdraw() {
    const { accountNumber, amount } = await inquirer.prompt([
        {
            type: 'number',
            name: 'accountNumber',
            message: 'Enter your account number:',
        },
        {
            type: 'number',
            name: 'amount',
            message: 'Enter the amount to withdraw:',
        },
    ]);
    const account = bank.getAccount(accountNumber);
    if (account) {
        account.withdraw(amount);
        console.log(`Withdrew ${amount}. New balance is ${account.getBalance()}.`);
    }
    else {
        console.log('Account not found or insufficient funds.');
    }
}
async function checkBalance() {
    const { accountNumber } = await inquirer.prompt({
        type: 'number',
        name: 'accountNumber',
        message: 'Enter your account number:',
    });
    const account = bank.getAccount(accountNumber);
    if (account) {
        console.log(`The balance for account number ${account.getAccountNumber()} is ${account.getBalance()}.`);
    }
    else {
        console.log('Account not found.');
    }
}
main();
