'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Progress,
	Box,
	Group,
	Button,
	Heading,
	Flex,
	Field,
	Input,
	NativeSelect,
	InputGroup,
	Text,
} from '@chakra-ui/react';

const Form1 = ({ username, setUsername, email, setEmail, password, setPassword }) => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	return (
		<>
			<Heading w='100%' textAlign={'center'} fontWeight='normal' mb='2%'>
				Account Information
			</Heading>

			<Field.Root mb='4%'>
				<Field.Label fontWeight={'normal'}>Username</Field.Label>
				<Input
					placeholder='Choose a username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</Field.Root>

			<Field.Root mb='4%'>
				<Field.Label fontWeight={'normal'}>Email address</Field.Label>
				<Input
					type='email'
					placeholder='you@example.com'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Field.HelperText>We'll never share your email.</Field.HelperText>
			</Field.Root>

			<Field.Root>
				<Field.Label fontWeight={'normal'}>Password</Field.Label>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</InputGroup>
				<Button size='sm' onClick={handleClick} variant='ghost' mt={2} alignSelf='flex-start'>
					{show ? 'Hide' : 'Show'}
				</Button>
			</Field.Root>
		</>
	);
};

const Form2 = ({ bandName, setBandName, genre, setGenre }) => {
	return (
		<>
			<Heading w='100%' textAlign={'center'} fontWeight='normal' mb='2%'>
				Band Details
			</Heading>

			<Field.Root mb='4%'>
				<Field.Label fontWeight={'normal'}>Band Name</Field.Label>
				<Input
					placeholder="Your band's name"
					value={bandName}
					onChange={(e) => setBandName(e.target.value)}
				/>
			</Field.Root>

			<Field.Root mb='4%'>
				<Field.Label fontWeight={'normal'}>Genre</Field.Label>
				<NativeSelect.Root>
					<NativeSelect.Field
						placeholder='Select genre'
						value={genre}
						onChange={(e) => setGenre(e.target.value)}
					>
						<option value=''>Select a genre</option>
						<option value='rock'>Rock</option>
						<option value='jazz'>Jazz</option>
						<option value='electronic'>Electronic</option>
						<option value='pop'>Pop</option>
						<option value='hip-hop'>Hip Hop</option>
						<option value='country'>Country</option>
						<option value='classical'>Classical</option>
						<option vlaue='metal'>Metal</option>
						<option value='folk'>Folk</option>
						<option value='blues'>Blues</option>
						<option value='reggae'>Reggae</option>
						<option value='other'>Other</option>
					</NativeSelect.Field>
					<NativeSelect.Indicator />
				</NativeSelect.Root>
			</Field.Root>
		</>
	);
};

export default function BandSignUpForm() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [progress, setProgress] = useState(33.33);

	// form fields
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [bandName, setBandName] = useState('');
	const [genre, setGenre] = useState('');

	const handleNext = () => {
		if (step === 1) {
			setStep(2);
			setProgress(66.66);
		}
	};

	const handleBack = () => {
		if (step === 2) {
			setStep(1);
			setProgress(33.33);
		}
	};

	const handleSubmit = async () => {
		try {
			const userRes = await fetch('http://localhost:8080/api/user', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password }),
			});
			if (!userRes.ok) {
				const errs = await userRes.json();
				alert('User signup failed: ' + errs.join(', '));
				return;
			}
			const createdUser = await userRes.json();
			console.log(createdUser);

			const authRes = await fetch('http://localhost:8080/api/user/authenticate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			if (!authRes.ok) {
				alert('Authentication failed after signup');
				return;
			}
			const { jwt } = await authRes.json();

			const bandRes = await fetch('http://localhost:8080/api/band', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: jwt,
				},
				body: JSON.stringify({ name: bandName, genre }),
			});
			if (!bandRes.ok) {
				const errs = await bandRes.json();
				alert('Band creation failed: ' + errs.join(', '));
				return;
			}

			alert('Band and account created! Please log in.');
			navigate('/login');
		} catch (e) {
			console.error(e);
			alert('Network error. Please try again.');
		}
	};
	return (
		<>
			<Box
				borderWidth='1px'
				rounded='lg'
				shadow='1px 1px 3px rgba(0,0,0,0.3)'
				maxWidth={600}
				p={6}
				m='10px auto'
				as='form'
			>
				{/* Progress Bar */}
				<Progress.Root value={progress} mb='5%' mx='5%' striped animated>
					<Progress.Track>
						<Progress.Range />
					</Progress.Track>
				</Progress.Root>

				{/* Header */}
				<Heading textAlign='center' mb={6} size='xl'>
					Band Registration
				</Heading>

				{/* Form Steps */}
				{step === 1 ? (
					<Form1
						username={username}
						setUsername={setUsername}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
					/>
				) : (
					<Form2 bandName={bandName} setBandName={setBandName} genre={genre} setGenre={setGenre} />
				)}

				{/* Navigation Buttons */}
				<Group mt='5%' w='100%'>
					<Flex w='100%' justifyContent='space-between'>
						<Flex gap={2}>
							<Button
								onClick={handleBack}
								disabled={step === 1}
								colorPalette='teal'
								variant='solid'
								w='7rem'
							>
								Back
							</Button>
							<Button
								w='7rem'
								disabled={step === 2}
								onClick={handleNext}
								colorPalette='teal'
								variant='outline'
							>
								Next
							</Button>
						</Flex>
						{step === 2 ? (
							<Button w='7rem' colorPalette='red' variant='solid' onClick={handleSubmit}>
								Submit
							</Button>
						) : null}
					</Flex>
				</Group>
			</Box>
		</>
	);
}
