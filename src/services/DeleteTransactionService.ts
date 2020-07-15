import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne({ where: { id } });
    console.log(transaction);
    if (!transaction) {
      throw new AppError('Transacion does not exist', 400);
    }
    console.log(id);
    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
