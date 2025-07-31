import { useState, useEffect } from 'react';
import {
	Box,
	HStack,
	VStack,
	Text,
	Button,
	Input,
	Grid,
	Card,
	Heading,
	Select,
} from '@chakra-ui/react';
import { FaUsers, FaMusic } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import LandingPage from './LandingPage';
import UserCard from './UserCard';
import BandCard from './BandCard';

function HomePage() {
	const { user } = useUser();
	const [users, setUsers] = useState([]);
	const [bands, setBands] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [filteredBands, setFilteredBands] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('all');
	const [locationFilter, setLocationFilter] = useState('');
	const [instrumentFilter, setInstrumentFilter] = useState('');
	const [genreFilter, setGenreFilter] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [usersRes, bandsRes] = await Promise.all([
					fetch('http://localhost:8080/api/user', {
						headers: { Authorization: user.jwt },
					}),
					fetch('http://localhost:8080/api/band', {
						headers: { Authorization: user.jwt },
					}),
				]);

				if (!usersRes.ok || !bandsRes.ok) {
					throw new Error('Failed to fetch data');
				}

				const [usersData, bandsData] = await Promise.all([usersRes.json(), bandsRes.json()]);

				setUsers(usersData);
				setBands(bandsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (user?.jwt) {
			fetchData();
		}
	}, [user]);

	useEffect(() => {
		let filteredUsersResult = users;
		let filteredBandsResult = bands;

		// Search filter
		if (searchTerm) {
			filteredUsersResult = filteredUsersResult.filter(
				(user) =>
					user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.instrument?.toLowerCase().includes(searchTerm.toLowerCase())
			);

			filteredBandsResult = filteredBandsResult.filter(
				(band) =>
					band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					band.genre?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Location filter
		if (locationFilter) {
			filteredUsersResult = filteredUsersResult.filter(
				(user) =>
					user.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
					user.state?.toLowerCase().includes(locationFilter.toLowerCase())
			);

			filteredBandsResult = filteredBandsResult.filter(
				(band) =>
					band.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
					band.state?.toLowerCase().includes(locationFilter.toLowerCase())
			);
		}

		// Instrument filter
		if (instrumentFilter) {
			filteredUsersResult = filteredUsersResult.filter((user) =>
				user.instrument?.toLowerCase().includes(instrumentFilter.toLowerCase())
			);
		}

		// Genre filter
		if (genreFilter) {
			filteredBandsResult = filteredBandsResult.filter((band) =>
				band.genre?.toLowerCase().includes(genreFilter.toLowerCase())
			);
		}

		setFilteredUsers(filteredUsersResult);
		setFilteredBands(filteredBandsResult);
	}, [users, bands, searchTerm, locationFilter, instrumentFilter, genreFilter]);

	if (loading) {
		return (
			<VStack spacing={4} py={8}>
				<Text>Loading musicians and bands...</Text>
			</VStack>
		);
	}

	if (error) {
		return (
			<VStack spacing={4} py={8}>
				<Text color='red.500'>Error loading data: {error}</Text>
				<Button onClick={() => window.location.reload()}>Try Again</Button>
			</VStack>
		);
	}

	return (
		<Box py={6}>
			<VStack spacing={6} align='stretch'>
				<VStack spacing={2} textAlign='center'>
					<Heading size='xl' color='gray.800'>
						Discover Musicians & Bands
					</Heading>
					<Text color='gray.600'>
						Connect with {users.length} musicians and {bands.length} bands in the community
					</Text>
				</VStack>

				<Card.Root>
					<Card.Body p={4}>
						<VStack spacing={4}>
							<HStack spacing={4} w='full' wrap='wrap'>
								<Input
									placeholder='Search musicians and bands...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									flex={1}
									minW='200px'
								/>
								<Select.Root
									value={[filterType]}
									onValueChange={(details) => setFilterType(details.value[0])}
								>
									<Select.Trigger>
										<Select.ValueText placeholder='All' />
									</Select.Trigger>
									<Select.Content>
										<Select.Item item='all' value='all'>
											All
										</Select.Item>
										<Select.Item item='users' value='users'>
											Musicians
										</Select.Item>
										<Select.Item item='bands' value='bands'>
											Bands
										</Select.Item>
									</Select.Content>
								</Select.Root>
							</HStack>

							<HStack spacing={4} w='full' wrap='wrap'>
								<Input
									placeholder='Filter by location...'
									value={locationFilter}
									onChange={(e) => setLocationFilter(e.target.value)}
									flex={1}
									minW='150px'
								/>
								<Input
									placeholder='Filter by instrument...'
									value={instrumentFilter}
									onChange={(e) => setInstrumentFilter(e.target.value)}
									flex={1}
									minW='150px'
								/>
								<Input
									placeholder='Filter by genre...'
									value={genreFilter}
									onChange={(e) => setGenreFilter(e.target.value)}
									flex={1}
									minW='150px'
								/>
							</HStack>
						</VStack>
					</Card.Body>
				</Card.Root>

				{(filterType === 'all' || filterType === 'users') && filteredUsers.length > 0 && (
					<Box>
						<HStack spacing={2} mb={4}>
							<FaUsers color='#3182CE' />
							<Heading size='lg' color='gray.800'>
								Musicians ({filteredUsers.length})
							</Heading>
						</HStack>
						<Grid templateColumns='repeat(auto-fit, minmax(280px, 1fr))' gap={4}>
							{filteredUsers.map((user) => (
								<UserCard key={user.id} user={user} />
							))}
						</Grid>
					</Box>
				)}

				{(filterType === 'all' || filterType === 'bands') && filteredBands.length > 0 && (
					<Box>
						<HStack spacing={2} mb={4}>
							<FaMusic color='#805AD5' />
							<Heading size='lg' color='gray.800'>
								Bands ({filteredBands.length})
							</Heading>
						</HStack>
						<Grid templateColumns='repeat(auto-fit, minmax(280px, 1fr))' gap={4}>
							{filteredBands.map((band) => (
								<BandCard key={band.id} band={band} />
							))}
						</Grid>
					</Box>
				)}

				{((filterType === 'users' && filteredUsers.length === 0) ||
					(filterType === 'bands' && filteredBands.length === 0) ||
					(filterType === 'all' && filteredUsers.length === 0 && filteredBands.length === 0)) && (
					<VStack spacing={4} py={8}>
						<Text color='gray.500' fontSize='lg'>
							No{' '}
							{filterType === 'users' ? 'musicians' : filterType === 'bands' ? 'bands' : 'results'}{' '}
							found
						</Text>
						<Text color='gray.400' fontSize='sm'>
							Try adjusting your search or filters
						</Text>
					</VStack>
				)}
			</VStack>
		</Box>
	);
}

export default function Home() {
	const { user } = useUser();

	if (!user) {
		return <LandingPage />;
	}

	return <HomePage />;
}
