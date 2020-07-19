// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    let categoria = await categoryRepository.findOne({
      where: { category },
    });

    if (!categoria) {
      categoria = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoria);
    }

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Insufficient account balance', 400);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoria.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
