import { useState } from 'react';
import {
	Box,
	Progress,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	Checkbox,
	ButtonGroup,
	Button,
	Flex,
} from '@chakra-ui/react';

export default function BandSignUpForm({ onSubmit }) {
	const [step, setStep] = useState(1);
	const [progress, setProgress] = useState(33.33);

	// Step 1 state
	const [name, setName] = useState('');
	const [genre, setGenre] = useState('');
	const [bandImgUrl, setBandImgUrl] = useState('');

	// Step 2 state
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	// Step 3 state
	const [bio, setBio] = useState('');
	const [needsNewMember, setNeedsNewMember] = useState(false);

	const next = () => {
		setStep((s) => Math.min(3, s + 1));
		setProgress((p) => Math.min(100, p + 33.33));
	};
	const back = () => {
		setStep((s) => Math.max(1, s - 1));
		setProgress((p) => Math.max(33.33, p - 33.33));
	};
	const submit = () => {
		onSubmit({ name, genre, bandImgUrl, city, state, zip, bio, needsNewMember });
	};

	return (
		<Box maxW='600px' mx='auto' p={6} borderWidth='1px' borderRadius='md'>
			<Progress value={progress} mb={4} hasStripe isAnimated />

			{step === 1 && (
				<>
					<Heading size='md' mb={4}>
						Band Basics
					</Heading>
					<FormControl isRequired mb={3}>
						<FormLabel>Band Name</FormLabel>
						<Input value={name} onChange={(e) => setName(e.target.value)} />
					</FormControl>
					<FormControl isRequired mb={3}>
						<FormLabel>Genre</FormLabel>
						<Select
							placeholder='Select genre'
							value={genre}
							onChange={(e) => setGenre(e.target.value)}
						>
							<option>Rock</option>
							<option>Jazz</option>
							<option>Metal</option>
							<option>Rap</option>
							<option>Electronic</option>
							<option>Country</option>
						</Select>
					</FormControl>
					<FormControl mb={6}>
						<FormLabel>Band Image URL (optional)</FormLabel>
						<Input
							value={bandImgUrl}
							onChange={(e) => setBandImgUrl(e.target.value)}
							placeholder='https://...'
						/>
					</FormControl>
				</>
			)}

			{step === 2 && (
				<>
					<Heading size='md' mb={4}>
						Location
					</Heading>
					<FormControl isRequired mb={3}>
						<FormLabel>City</FormLabel>
						<Input value={city} onChange={(e) => setCity(e.target.value)} />
					</FormControl>
					<FormControl isRequired mb={3}>
						<FormLabel>State / Province</FormLabel>
						<Input value={state} onChange={(e) => setState(e.target.value)} />
					</FormControl>
					<FormControl mb={6}>
						<FormLabel>ZIP / Postal</FormLabel>
						<Input value={zip} onChange={(e) => setZip(e.target.value)} />
					</FormControl>
				</>
			)}

			{step === 3 && (
				<>
					<Heading size='md' mb={4}>
						More About Your Band
					</Heading>
					<FormControl mb={3}>
						<FormLabel>Bio (optional)</FormLabel>
						<Textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							placeholder='Tell folks who you are…'
							rows={4}
						/>
					</FormControl>
					<FormControl mb={6}>
						<Checkbox
							isChecked={needsNewMember}
							onChange={(e) => setNeedsNewMember(e.target.checked)}
						>
							We’re looking for new members
						</Checkbox>
					</FormControl>
				</>
			)}

			<ButtonGroup mt={4} w='100%' justifyContent='space-between'>
				<Flex>
					<Button onClick={back} isDisabled={step === 1} colorScheme='teal' mr={2}>
						Back
					</Button>
					{step < 3 && (
						<Button onClick={next} colorScheme='teal' variant='outline'>
							Next
						</Button>
					)}
				</Flex>

				{step === 3 && (
					<Button colorScheme='red' onClick={submit}>
						Create Band
					</Button>
				)}
			</ButtonGroup>
		</Box>
	);
}
