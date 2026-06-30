import React from 'react';
import { WhiteBlock } from '../white-block';
import { Input } from '../../ui/input';
import { FormInput } from '../form-components';

interface Props {
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Persönliche Daten" className={className}>
        <div className="grid grid-cols-2 gap-5">
            <FormInput name="firstName" className="text-base" placeholder="Vorname" /> 
            <FormInput name="lastName" className="text-base" placeholder="Nachname" />
            <FormInput name="email" className="text-base" placeholder="E-Mail" />    
            <FormInput name="phone" className="text-base" placeholder="Telefon" /> 
        </div>
    </WhiteBlock>  
  );
};
