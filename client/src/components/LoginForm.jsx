import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Box, VStack, Field, Input, Button, Heading, Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function LoginForm() {
	const navigate = useNavigate();
	const { setUser, setBands } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch('http://localhost:8080/api/user/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!res.ok) {
			setErrors(await res.json());
			return;
		}

		const { jwt } = await res.json();
		const decoded = jwtDecode(jwt);
		const userObj = { ...decoded, jwt };

		setUser(userObj);
		localStorage.setItem('user', JSON.stringify(userObj));

		const bandRes = await fetch('http://localhost:8080/api/band/self', {
			headers: { 'Content-Type': 'application/json', Authorization: userObj.jwt },
		});
		const myBands = bandRes.ok ? await bandRes.json() : [];
		setBands(myBands);

		navigate('/');
	};

	return (
		<Box
			display='flex'
			alignItems='center'
			shadow='md'
			justifyContent='center'
			minH='100vh'
			bg='gray.50'
			p={4}
		>
			<Card.Root maxW='md' w='full' p={8} shadow='lg' borderRadius='md' bg='white'>
				<VStack spacing={6}>
					<Heading size='lg' textAlign='center'>
						Login to Your Account
					</Heading>
					{errors.length > 0 && (
						<ul id='errors'>
							{errors.map((error) => (
								<li key={error}>{error}</li>
							))}
						</ul>
					)}
					<Box as='form' w='full' onSubmit={handleSubmit}>
						<VStack spacing={4}>
							<Field.Root>
								<Field.Label htmlFor='email'>Email</Field.Label>
								<Input
									name='email'
									id='email-input'
									type='email'
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder='Enter your email'
								/>
							</Field.Root>

							<Field.Root>
								<Field.Label htmlFor='password'>Password</Field.Label>
								<Input
									name='password'
									id='password-input'
									type='password'
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder='Enter your password'
								/>
							</Field.Root>

							<Button type='submit' colorScheme='blue' size='lg' w='full' mt={4}>
								Login
							</Button>
						</VStack>
					</Box>
				</VStack>
			</Card.Root>
		</Box>
	);
}
