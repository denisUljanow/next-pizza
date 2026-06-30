import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormAddressInput, FormTextarea } from '../form-components';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title="3. Lieferadresse" className={className}>
            <div className="flex flex-col gap-5">
                <FormAddressInput
                    name="address"
                    className="text-base"
                    placeholder="Adresse"
                />
                <FormTextarea
                    name="comment"
                    className="text-base"
                    placeholder="Kommentar zur Bestellung"
                    rows={5}
                />
            </div>
        </WhiteBlock>
    );
};
