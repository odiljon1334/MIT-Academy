'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type Theme = 'light' | 'dark';

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to generate theme object
const generateTheme = (mode: Theme) => {
	const colors = {
		background: mode === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(20, 14.3%, 4.1%)',
		foreground: mode === 'light' ? 'hsl(240, 10%, 3.9%)' : 'hsl(0, 0%, 95%)',
		primary: mode === 'light' ? 'hsl(142.1, 76.2%, 36.3%)' : 'hsl(142.1, 70.6%, 45.3%)',
		'primary-foreground': mode === 'light' ? 'hsl(355.7, 100%, 97.3%)' : 'hsl(144.9, 80.4%, 10%)',
		secondary: mode === 'light' ? 'hsl(240, 4.8%, 95.9%)' : 'hsl(240, 3.7%, 15.9%)',
		'secondary-foreground': mode === 'light' ? 'hsl(240, 5.9%, 10%)' : 'hsl(0, 0%, 98%)',
		muted: mode === 'light' ? 'hsl(240, 4.8%, 95.9%)' : 'hsl(0, 0%, 15%)',
		'muted-foreground': mode === 'light' ? 'hsl(240, 3.8%, 46.1%)' : 'hsl(240, 5%, 64.9%)',
		accent: mode === 'light' ? 'hsl(240, 4.8%, 95.9%)' : 'hsl(12, 6.5%, 15.1%)',
		'accent-foreground': mode === 'light' ? 'hsl(240, 5.9%, 10%)' : 'hsl(0, 0%, 98%)',
		destructive: mode === 'light' ? 'hsl(0, 84.2%, 60.2%)' : 'hsl(0, 62.8%, 30.6%)',
		'destructive-foreground': mode === 'light' ? 'hsl(0, 0%, 98%)' : 'hsl(0, 85.7%, 97.3%)',
		border: mode === 'light' ? 'hsl(240, 5.9%, 90%)' : 'hsl(240, 3.7%, 15.9%)',
		input: mode === 'light' ? 'hsl(240, 5.9%, 90%)' : 'hsl(240, 3.7%, 15.9%)',
		ring: mode === 'light' ? 'hsl(142.1, 76.2%, 36.3%)' : 'hsl(142.4, 71.8%, 29.2%)',
	};

	return {
		colors,
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
		},
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
			openSans: ['Open Sans', 'sans-serif'],
		},
	};
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('light');

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('theme', theme);
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		// Set CSS variables for Tailwind
		const generatedTheme = generateTheme(theme);
		Object.entries(generatedTheme.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${key}`, value);
		});
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	const generatedTheme = generateTheme(theme);

	const muiTheme = createTheme({
		palette: {
			mode: theme,
			primary: {
				main: '#ff5252',
			},
			background: {
				default: generatedTheme.colors.background,
				paper: generatedTheme.colors.background,
			},
			text: {
				primary: generatedTheme.colors.foreground,
			},
		},
		typography: {
			fontFamily: generatedTheme.fontFamily.roboto.join(','),
		},
		shape: {
			borderRadius: Number.parseInt(generatedTheme.borderRadius.md),
		},
	});

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<MUIThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
