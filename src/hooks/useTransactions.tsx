import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
  active: boolean;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (Transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (index: number) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData 
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    /*api
      .get("transactions")
      .then((response) => 
      setTransactions(response.data.transactions));*/

      const transactionsJSON = localStorage.getItem('transactions');

      if (transactionsJSON) {
        const transactions = JSON.parse(transactionsJSON);
        setTransactions(transactions);
      }
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post<{transaction: Transaction}>('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    })
    const { transaction } = response.data;

    localStorage.setItem('transactions', JSON.stringify([...transactions, transaction]));

    setTransactions([
      ...transactions,
      transaction,
    ]);

  }

  async function deleteTransaction(id: number) {
    const filteredTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(filteredTransactions);

    localStorage.setItem('transactions', JSON.stringify(filteredTransactions))

  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction, deleteTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}