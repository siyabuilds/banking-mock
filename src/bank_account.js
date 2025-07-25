import Decimal from "decimal.js";
import assert from "assert";

export const ERROR_MESSAGES = {
  INVALID_AMOUNT: "Invalid amount: must be a positive number",
  INSUFFICIENT_FUNDS: "Insufficient funds for withdrawal",
  INVALID_INTEREST_RATE: "Invalid interest rate: must be a non-negative number",
};

const validateAmount = (amount) => {
  if (!Decimal.isDecimal(amount)) {
    amount = new Decimal(amount);
  }
  assert(amount.gt(0), ERROR_MESSAGES.INVALID_AMOUNT);
};

export class BankAccount {
  constructor({ interestRate = 0 } = {}) {
    const rate = Decimal.isDecimal(interestRate)
      ? interestRate
      : new Decimal(interestRate);
    assert(rate.gte(0), ERROR_MESSAGES.INVALID_INTEREST_RATE);
    this.balance = new Decimal(0);
    this.interestRate = rate;
  }

  deposit({ amount }) {
    validateAmount(amount);
    this.balance = this.balance.plus(new Decimal(amount));
  }

  withdraw({ amount }) {
    validateAmount(amount);
    const withdrawalAmount = new Decimal(amount);
    assert(
      this.balance.gte(withdrawalAmount),
      ERROR_MESSAGES.INSUFFICIENT_FUNDS
    );
    this.balance = this.balance.minus(withdrawalAmount);
  }

  getBalance() {
    return this.balance;
  }

  compoundInterest() {
    const monthlyInterest = this.balance
      .times(this.interestRate)
      .div(100)
      .div(12);
    this.updateBalance(monthlyInterest);
  }

  updateBalance(amount) {
    this.balance = this.balance.plus(new Decimal(amount));
  }
}
