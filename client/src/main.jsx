import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from './context/UserContext.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider
				attribute='class'
				disableTransitionOnChange
				defaultTheme='light'
				forcedTheme='light'
			>
				<UserProvider>
					<App />
				</UserProvider>
			</ThemeProvider>
		</ChakraProvider>
	</React.StrictMode>
);
