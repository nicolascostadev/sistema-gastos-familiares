import { useTransactions } from "../../hooks/useTransactions";
import { Container } from "./styles";
import { IoTrashOutline } from 'react-icons/io5';

export function TransactionsTable() {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(transaction.amount)}
              </td>
              <td>{transaction.category}</td>
              <td>
                {new Intl.DateTimeFormat('pt-BR').format(
                  new Date(transaction.createdAt)
                )}
              </td>
              <td>
                <div className="icon-wrapper" onClick={ () => deleteTransaction(transaction.id)}>
                <IoTrashOutline size={20} />
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </Container>
  );
}
