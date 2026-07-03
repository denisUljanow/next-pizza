import * as React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl?: string;
}

export const PayOrderTemplate: React.FC<Props> = ({ 
    orderId, 
    totalAmount,
    paymentUrl
}) => (
    <div>
      <h1>Bestellung #{orderId}</h1>
      <p>Bitte zahlen Sie folgenden Betrag: {totalAmount.toFixed(2)} €. Um die Bestellung abzuschließen, klicken Sie auf den folgenden Link: <a href={paymentUrl}>Zahlung abschließen</a></p>
    </div>
  );