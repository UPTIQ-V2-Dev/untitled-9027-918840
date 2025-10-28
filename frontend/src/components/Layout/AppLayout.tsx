import { cn } from '../../lib/utils';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased', className)}>
      <Header />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};