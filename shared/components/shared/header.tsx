'use client';

import React from 'react';
import Image from 'next/image';

import { Container } from './container';
import { Button } from '../ui/button';
import { SearchInput } from './search-input';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { CartButton } from '.';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className }) => {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams?.get('payment') == 'success') {
      setTimeout(() => {
        toast.success('Zahlung erfolgreich! Sie erhlalten ein Bestättigungs-Email mit allen Details.', {
          duration: 5000,
          position: 'top-center',
        });
      }, 500);
    }
  }, []);

  return (
    <header className={cn('border-b border-gray-100', className)}>
      <Container className="flex items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" width={35} height={35} alt="Logo" />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">beste Pizza der Welt</p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}  

        <div className="flex items-center gap-3">
          <Button variant="outline">Login</Button>
          {hasCart && <CartButton />}      
        </div>
      </Container>
    </header>
  );
};
