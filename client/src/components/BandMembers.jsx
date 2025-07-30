import { useState, useEffect } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Avatar,
	IconButton,
	Menu,
	Button,
	Card,
	Flex,
	Portal,
} from '@chakra-ui/react';
import { FaEllipsisH, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function BandMembers({
	members,
	isOwnProfile,
	bandId,
	onAddMember,
	onRemoveMember,
}) {
	const [enriched, setEnriched] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [showAddMember, setShowAddMember] = useState(false);
	const [addingMember, setAddingMember] = useState(null);
	const navigate = useNavigate();
	const { user: loggedInUser } = useUser();

	useEffect(() => {
		if (!members?.length) {
			setEnriched([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		Promise.all(
			members.map((m) =>
				fetch(`http://localhost:8080/api/user/id/${m.userId}`).then((r) => {
					if (!r.ok) throw new Error();
					return r.json();
				})
			)
		)
			.then((users) => setEnriched(members.map((m, i) => ({ ...m, ...users[i] }))))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [members]);

	// Search users by name
	const handleSearch = async (term) => {
		setSearchTerm(term);
		if (!term.trim() || term.trim().length < 2) {
			setResults([]);
			return;
		}

		setSearchLoading(true);
		try {
			const response = await fetch(
				`http://localhost:8080/api/user/search?query=${encodeURIComponent(term)}`,
				{
					headers: {
						Authorization: loggedInUser?.jwt || '',
					},
				}
			);

			if (response.ok) {
				const users = await response.json();
				// Filter out users who are already members
				const existingMemberIds = enriched.map((m) => m.userId);
				const filteredUsers = users.filter((user) => !existingMemberIds.includes(user.id));
				setResults(filteredUsers);
			} else {
				console.error('Failed to search users');
				setResults([]);
			}
		} catch (error) {
			console.error('Error searching users:', error);
			setResults([]);
		} finally {
			setSearchLoading(false);
		}
	};

	// Remove a member
	const handleRemove = async (userId) => {
		try {
			const response = await fetch(`http://localhost:8080/api/band/${bandId}/members/${userId}`, {
				method: 'DELETE',
				headers: {
					Authorization: loggedInUser?.jwt || '',
				},
			});

			if (response.ok) {
				console.log('Member removed successfully');

				// Call the parent callback to refresh the members list
				if (onRemoveMember) {
					onRemoveMember(userId);
				}
			} else {
				const errorData = await response.json();
				console.error('Failed to remove member:', errorData.error);
				alert(`Failed to remove member: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Error removing member:', error);
			alert('Error removing member. Please try again.');
		}
	};
	const handleAdd = async (userId) => {
		setAddingMember(userId);
		try {
			const response = await fetch(`http://localhost:8080/api/band/${bandId}/members`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser?.jwt || '',
				},
				body: JSON.stringify({ userId }),
			});

			if (response.ok) {
				const result = await response.json();
				console.log('Member added successfully:', result);

				// Call the parent callback to refresh the members list
				if (onAddMember) {
					onAddMember(userId);
				}

				// Reset the search
				setShowAddMember(false);
				setSearchTerm('');
				setResults([]);
			} else {
				const errorData = await response.json();
				console.error('Failed to add member:', errorData.error);
				alert(`Failed to add member: ${errorData.error}`);
			}
		} catch (error) {
			console.error('Error adding member:', error);
			alert('Error adding member. Please try again.');
		} finally {
			setAddingMember(null);
		}
	};

	if (loading) return <Text>Loading members...</Text>;
	if (error) return <Text color='red.500'>Error: {error}</Text>;

	return (
		<Box>
			{/* Header with menu */}
			<HStack justify='space-between' mb={4}>
				<Text fontSize='lg' fontWeight='bold'>
					Members
				</Text>
				{isOwnProfile && (
					<Menu.Root>
						<Menu.Trigger asChild>
							<IconButton
								aria-label='Options'
								size='sm'
								variant='ghost'
								color='gray.500'
								_hover={{ color: 'gray.700', bg: 'gray.50' }}
							>
								<FaEllipsisH />
							</IconButton>
						</Menu.Trigger>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Item onClick={() => setShowAddMember(true)}>
									<Text>Add Member</Text>
								</Menu.Item>
							</Menu.Content>
						</Menu.Positioner>
					</Menu.Root>
				)}
			</HStack>

			{/* Member list */}
			<VStack gap={4} align='stretch'>
				{enriched.length > 0 ? (
					enriched.map((m) => (
						<Card.Root
							key={m.userId}
							overflow='hidden'
							bg='white'
							borderRadius='16px'
							boxShadow='0 2px 12px rgba(0,0,0,0.08)'
							transition='all 0.2s ease'
							_hover={{
								boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
								transform: 'translateY(-1px)',
							}}
							w='full'
						>
							<Card.Body p={4}>
								<Flex align='center'>
									<Avatar.Root
										size='md'
										mr={3}
										cursor='pointer'
										onClick={() => navigate(`/profile/${m.username}`)}
									>
										<Avatar.Image src={m.profileImgUrl} />
										<Avatar.Fallback name={m.username} />
									</Avatar.Root>
									<VStack
										align='start'
										spacing={0}
										flex={1}
										cursor='pointer'
										onClick={() => navigate(`/profile/${m.username}`)}
									>
										<Text fontSize='md' fontWeight='600' color='gray.700'>
											{m.username}
										</Text>
										{m.instrument && (
											<Text fontSize='sm' color='gray.500'>
												{m.instrument}
											</Text>
										)}
										{m.bio && (
											<Text fontSize='sm' color='gray.600' mt={1}>
												{m.bio}
											</Text>
										)}
									</VStack>
									{isOwnProfile && m.role !== 'owner' && (
										<Menu.Root>
											<Menu.Trigger asChild>
												<IconButton
													aria-label='More options'
													ml={2}
													size='sm'
													variant='ghost'
													color='gray.500'
													_hover={{ color: 'gray.700', bg: 'gray.50' }}
												>
													<FaEllipsisH />
												</IconButton>
											</Menu.Trigger>
											<Portal>
												<Menu.Positioner>
													<Menu.Content>
														<Menu.Item
															onClick={() => handleRemove(m.userId)}
															color='red.500'
															_hover={{ color: 'red.700', bg: 'red.50' }}
														>
															<HStack spacing={2}>
																<FaTrash />
																<Text>Remove Member</Text>
															</HStack>
														</Menu.Item>
													</Menu.Content>
												</Menu.Positioner>
											</Portal>
										</Menu.Root>
									)}
								</Flex>
							</Card.Body>
						</Card.Root>
					))
				) : (
					<Text color='gray.500' textAlign='center' py={8}>
						No members yet.
					</Text>
				)}
			</VStack>

			{/* Add member section */}
			{showAddMember && (
				<Card.Root mt={4} bg='gray.50' borderRadius='16px'>
					<Card.Body p={4}>
						<VStack gap={4} align='stretch'>
							<HStack justify='space-between' align='center'>
								<Text fontSize='md' fontWeight='600'>
									Add Band Member
								</Text>
								<IconButton
									aria-label='Close'
									size='sm'
									variant='ghost'
									onClick={() => {
										setShowAddMember(false);
										setSearchTerm('');
										setResults([]);
									}}
								>
									<FaTimes />
								</IconButton>
							</HStack>
							<Box>
								<input
									type='text'
									placeholder='Search users by name or username...'
									value={searchTerm}
									onChange={(e) => handleSearch(e.target.value)}
									style={{
										width: '100%',
										padding: '12px 16px',
										border: '2px solid #e2e8f0',
										borderRadius: '12px',
										fontSize: '14px',
										outline: 'none',
										transition: 'border-color 0.2s ease',
									}}
									onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
									onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
								/>
								{searchTerm.length > 0 && searchTerm.length < 2 && (
									<Text fontSize='xs' color='gray.500' mt={1}>
										Type at least 2 characters to search
									</Text>
								)}
							</Box>

							{searchLoading && (
								<Text color='gray.500' fontSize='sm' textAlign='center'>
									Searching users...
								</Text>
							)}

							{!searchLoading && searchTerm.length >= 2 && results.length === 0 && (
								<Text color='gray.500' fontSize='sm' textAlign='center'>
									No users found matching "{searchTerm}"
								</Text>
							)}

							{results.length > 0 && (
								<VStack gap={2} align='stretch' maxH='300px' overflowY='auto'>
									{results.map((user) => (
										<Card.Root key={user.id} bg='white' borderRadius='12px' p={0}>
											<Card.Body p={3}>
												<Flex justify='space-between' align='center'>
													<HStack spacing={3}>
														<Avatar.Root size='sm'>
															<Avatar.Image src={user.profileImgUrl} />
															<Avatar.Fallback name={user.username || user.name} />
														</Avatar.Root>
														<VStack align='start' spacing={0}>
															<Text fontSize='sm' fontWeight='600'>
																{user.name || user.username}
															</Text>
															{user.name && user.username && (
																<Text fontSize='xs' color='gray.500'>
																	@{user.username}
																</Text>
															)}
															{user.instrument && (
																<Text fontSize='xs' color='blue.600'>
																	{user.instrument}
																</Text>
															)}
														</VStack>
													</HStack>
													<Button
														size='sm'
														colorScheme='blue'
														onClick={() => handleAdd(user.id)}
														isLoading={addingMember === user.id}
														loadingText='Adding...'
													>
														<FaPlus style={{ marginRight: '4px' }} />
														Add
													</Button>
												</Flex>
											</Card.Body>
										</Card.Root>
									))}
								</VStack>
							)}
						</VStack>
					</Card.Body>
				</Card.Root>
			)}
		</Box>
	);
}
