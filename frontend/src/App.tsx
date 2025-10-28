import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { ThemeProvider } from './components/Layout/ThemeProvider';
import { CalculatorPage } from './pages/CalculatorPage';

export const App = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="calculator-theme">
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<CalculatorPage />} />
                    </Routes>
                </AppLayout>
            </Router>
        </ThemeProvider>
    );
};
