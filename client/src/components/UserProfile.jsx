import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
	Box,
	Flex,
	Text,
	Image,
	Container,
	HStack,
	Button,
	Textarea,
	Input,
	VStack,
	Dialog,
	Portal,
	Heading,
} from '@chakra-ui/react';
import AudioPlayer from './AudioPlayer';
import PostCard from './PostCard';

// TODO: need to chop this down; refactor into smaller components

export default function UserProfile({ user: loggedInUser }) {
	const { username } = useParams();
	const navigate = useNavigate();
	const [profileUser, setProfileUser] = useState(null);
	const [songs, setSongs] = useState([]);
	const fileInputRef = useRef();

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bioValue, setBioValue] = useState('');
	const [isEditingInfo, setIsEditingInfo] = useState(false);
	const [infoValues, setInfoValues] = useState({ city: '', state: '', instrument: '' });
	const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
	const [photoUrl, setPhotoUrl] = useState('');
	const [selectedFileName, setSelectedFileName] = useState('');
	const [posts, setPosts] = useState([]);
	const [newPostContent, setNewPostContent] = useState('');
	// Getting info for profile from user
	useEffect(() => {
		fetch(`http://localhost:8080/api/user/profile/${username}`)
			.then((res) => {
				if (!res.ok) throw new Error('Not found');
				return res.json();
			})
			.then((user) => {
				setProfileUser(user);
				setBioValue(user.bio || '');
				setInfoValues({
					city: user.city || '',
					state: user.state || '',
					instrument: user.instrument || '',
				});
			})
			.catch(() => navigate('/notFound'));
	}, [username, navigate]);
	// Getting all the songs if any
	useEffect(() => {
		if (!profileUser) return;
		fetch(`http://localhost:8080/api/user/${profileUser.id}/songs`, {
			headers: { Authorization: loggedInUser.jwt },
		})
			.then((res) => (res.ok ? res.json() : []))
			.then(setSongs)
			.catch(() => setSongs([]));
	}, [profileUser, loggedInUser]);

	// getting all the posts by the user
	useEffect(() => {
		if (!profileUser) return;

		fetch(`http://localhost:8080/api/posts/user/${profileUser.id}`, {
			headers: { Authorization: loggedInUser.jwt },
		})
			.then((res) => (res.ok ? res.json() : []))
			.then(setPosts)
			.catch(() => setPosts([]));
	}, [profileUser, loggedInUser]);

	const handleSaveBio = async () => {
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: loggedInUser.jwt,
			},
			body: JSON.stringify({ ...profileUser, bio: bioValue }),
		});
		if (res.ok) {
			setProfileUser((profile) => ({ ...profile, bio: bioValue }));
			setIsEditingBio(false);
		}
	};

	const handleSaveInfo = async () => {
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: loggedInUser.jwt,
			},
			body: JSON.stringify({ ...profileUser, ...infoValues }),
		});
		if (res.ok) {
			setProfileUser((profile) => ({ ...profile, ...infoValues }));
			setIsEditingInfo(false);
		}
	};

	const handleSavePhoto = async () => {
		const photoFile = fileInputRef.current.files[0];
		if (!photoFile) return;

		const formData = new FormData();
		formData.append('profilePhoto', photoFile);

		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}/photo`, {
			method: 'PUT',
			headers: {
				Authorization: loggedInUser.jwt,
			},
			body: formData,
		});

		if (res.ok) {
			const updatedUser = await res.json();
			setProfileUser(updatedUser);
			setSelectedFileName('');
			setIsPhotoDialogOpen(false);
			fileInputRef.current.value = '';
		}
	};

	const handleUploadSong = async () => {
		console.log('Logged in user in upload', loggedInUser.jwt);
		const file = fileInputRef.current.files[0];
		if (!file) return;

		const form = new FormData();
		form.append('file', file);
		form.append('title', file.name);

		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}/songs`, {
			method: 'POST',
			headers: {
				Authorization: loggedInUser.jwt,
			},
			body: form,
		});

		if (res.ok) {
			const contentType = res.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const newSong = await res.json();
				setSongs((prev) => [...prev, newSong]);
			} else {
				// This is so no error gets thrown if it returns an empty response
				console.log('Upload successful but no JSON response');
			}
		} else {
			const errorText = await res.text();
			console.error('Upload failed', errorText);
		}
	};
	const handleAddPost = async () => {
		if (!newPostContent.trim()) return;

		try {
			const payload = {
				body: newPostContent,
				userId: profileUser.id, // Add userId
				bandId: null, // Explicitly set bandId to null
			};

			console.log('Sending payload:', payload);

			const res = await fetch(`http://localhost:8080/api/posts/user/${profileUser.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser.jwt,
				},
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				const newPost = await res.json();
				setPosts((prevPosts) => [newPost, ...prevPosts]);
				setNewPostContent('');
			} else {
				const errorText = await res.text();
				console.error('Failed to create post. Status:', res.status);
				console.error('Error response:', errorText);
			}
		} catch (error) {
			console.error('Error creating post:', error);
		}
	};

	// Call backs for deleting and updating posts
	const handlePostDeleted = (postId) => {
		setPosts((prevPosts) => prevPosts.filter((profile) => profile.id !== postId));
	};

	const handlePostUpdated = (postId, newContent) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) => (post.id === postId ? { ...post, body: newContent } : post))
		);
	};

	const isOwnProfile = loggedInUser && profileUser && loggedInUser.id === profileUser.id;
	if (!profileUser) return null;

	return (
		<Container maxW='container.md' p={6}>
			<Box bg='white' boxShadow='sm' borderRadius='lg' p={4} mb={4}>
				<Flex justify='space-between' align='center'>
					{isEditingProfile && isEditingInfo ? (
						<VStack align='start' flex={1} mr={4}>
							<HStack spacing={4} width='100%'>
								<Box>
									<Text fontSize='sm' mb={1} fontWeight='medium'>
										City
									</Text>
									<Input
										size='sm'
										value={infoValues.city}
										onChange={(e) => setInfoValues((prev) => ({ ...prev, city: e.target.value }))}
										placeholder='City'
									/>
								</Box>
								<Box>
									<Text fontSize='sm' mb={1} fontWeight='medium'>
										State
									</Text>
									<Input
										size='sm'
										value={infoValues.state}
										onChange={(e) => setInfoValues((prev) => ({ ...prev, state: e.target.value }))}
										placeholder='State'
									/>
								</Box>
								<Box>
									<Text fontSize='sm' mb={1} fontWeight='medium'>
										Instrument
									</Text>
									<Input
										size='sm'
										value={infoValues.instrument}
										onChange={(e) =>
											setInfoValues((prev) => ({ ...prev, instrument: e.target.value }))
										}
										placeholder='Instrument'
									/>
								</Box>
							</HStack>
							<HStack>
								<Button size='sm' colorScheme='green' onClick={handleSaveInfo}>
									Save
								</Button>
								<Button size='sm' variant='outline' onClick={() => setIsEditingInfo(false)}>
									Cancel
								</Button>
							</HStack>
						</VStack>
					) : (
						<HStack spacing={4}>
							<Text fontSize='lg' fontWeight='bold'>
								{profileUser?.username ?? 'User name'}
							</Text>
							<Text fontSize='sm' color='gray.500'>
								{profileUser?.city ?? 'City'}
							</Text>
							<Text fontSize='sm' color='gray.500'>
								{profileUser?.state ?? 'State'}
							</Text>
							<Text fontSize='sm' color='gray.500'>
								{profileUser?.instrument ?? 'Instrument'}
							</Text>
						</HStack>
					)}

					{isEditingProfile && !isEditingInfo && (
						<Button
							size='sm'
							colorScheme='blue'
							variant='outline'
							onClick={() => setIsEditingInfo(true)}
						>
							Edit Info
						</Button>
					)}

					<HStack>
						{isOwnProfile && !isEditingProfile && (
							<Button
								size='sm'
								colorScheme='blue'
								variant='outline'
								onClick={() => setIsEditingProfile(true)}
							>
								Edit Profile
							</Button>
						)}
						{isOwnProfile && isEditingProfile && (
							<Button
								size='sm'
								colorScheme='green'
								onClick={() => {
									setIsEditingProfile(false);
									setIsEditingBio(false);
									setIsEditingInfo(false);
								}}
							>
								Save Profile
							</Button>
						)}
						{!isOwnProfile && (
							<Button size='sm' colorScheme='blue' variant='outline'>
								Message
							</Button>
						)}
					</HStack>
				</Flex>
			</Box>

			<Box bg='white' borderWidth='1px' borderColor='gray.300' borderRadius='lg' p={6} mb={4}>
				<Flex gap={10} align='center' justify='space-between'>
					<Box position='relative'>
						<Flex direction='column' align='center' gap={4}>
							<Image
								src={
									profileUser?.profileImgUrl ||
									'https://via.placeholder.com/250x250/E2E8F0/718096?text=No+Photo'
								}
								boxSize='250px'
								borderRadius='full'
								fit='cover'
								alt={profileUser?.username || 'Profile'}
								bg='gray.200'
							/>
							{isOwnProfile && isEditingProfile && (
								<Button size='sm' colorScheme='blue' onClick={() => setIsPhotoDialogOpen(true)}>
									Upload Photo
								</Button>
							)}
						</Flex>
					</Box>

					<Box mx='auto' flex='1'>
						{isEditingBio ? (
							<VStack align='stretch' spacing={3}>
								<Textarea
									value={bioValue}
									onChange={(e) => setBioValue(e.target.value)}
									placeholder='Tell us about yourself…'
									variant='outline'
									borderRadius='md'
									p={4}
									w='100%'
									minH='150px'
									maxH='300px'
									resize='vertical'
									fontSize='md'
									lineHeight='tall'
								/>
								<HStack>
									<Button size='sm' colorScheme='green' onClick={handleSaveBio}>
										Save Bio
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={() => {
											setBioValue(profileUser?.bio || '');
											setIsEditingBio(false);
										}}
									>
										Cancel
									</Button>
								</HStack>
							</VStack>
						) : (
							<Box position='relative'>
								<Textarea
									value={profileUser?.bio ?? ''}
									placeholder='Tell us about yourself…'
									readOnly
									variant='filled'
									bg='gray.50'
									borderRadius='md'
									p={4}
									w='100%'
									minH='150px'
									maxH='300px'
									resize='vertical'
									fontSize='md'
									lineHeight='tall'
									color='gray.800'
									_placeholder={{ color: 'gray.400' }}
								/>
								{isOwnProfile && isEditingProfile && (
									<Button
										position='absolute'
										top='10px'
										right='10px'
										size='sm'
										colorScheme='green'
										onClick={() => setIsEditingBio(true)}
									>
										Edit
									</Button>
								)}
							</Box>
						)}
					</Box>
				</Flex>
			</Box>

			<Dialog.Root open={isPhotoDialogOpen} onOpenChange={(e) => setIsPhotoDialogOpen(e.open)}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Update Profile Photo</Dialog.Title>
								<Dialog.CloseTrigger asChild>
									<Button size='sm' onClick={() => setIsPhotoDialogOpen(false)}>
										Close
									</Button>
								</Dialog.CloseTrigger>
							</Dialog.Header>
							<Dialog.Body>
								<Box>
									<Text fontSize='sm' mb={2} fontWeight='medium'>
										Photo URL
									</Text>
									{selectedFileName && (
										<Text mb={2} color='gray.700'>
											Selected: {selectedFileName}
										</Text>
									)}

									<input
										ref={fileInputRef}
										type='file'
										accept='image/*'
										style={{ display: 'none' }}
										onChange={(e) => {
											const f = e.target.files[0];
											setSelectedFileName(f ? f.name : '');
										}}
									/>
									<Button
										colorScheme='blue'
										mr={3}
										onClick={handleSavePhoto}
										isDisabled={!selectedFileName}
									>
										Save Photo Button
									</Button>
									<Button
										onClick={() => {
											setSelectedFileName('');
											fileInputRef.current.click();
										}}
										colorScheme='blue'
										mr={2}
									>
										Select File
									</Button>
								</Box>
								{photoUrl && (
									<Box mt={4}>
										<Text fontSize='sm' mb={2}>
											Preview:
										</Text>
										<Image
											src={photoUrl}
											boxSize='100px'
											borderRadius='full'
											fit='cover'
											alt='Preview'
										/>
									</Box>
								)}
							</Dialog.Body>
							<Dialog.Footer>
								{/* <Button colorScheme='blue' mr={3} onClick={handleSavePhoto} isDisabled={!photoUrl}>
									Save Photo
								</Button> */}
								<Button variant='ghost' onClick={() => setIsPhotoDialogOpen(false)}>
									Cancel
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>

			{/* Songs Section */}
			<Box bg='white' borderWidth='1px' borderRadius='lg' p={6} mt={6}>
				<Heading size='md' mb={4}>
					Songs
				</Heading>
				{songs.length > 0 ? (
					<VStack spacing={4}>
						{songs.map((s) => (
							<AudioPlayer key={s.id} song={s} uploaderName={profileUser.username} />
						))}
					</VStack>
				) : (
					<Box
						border='2px dashed'
						borderColor='gray.300'
						borderRadius='md'
						p={8}
						textAlign='center'
					>
						{isEditingProfile && isOwnProfile ? (
							<>
								<Text mb={2}>No songs yet—upload your first track!</Text>

								{selectedFileName && (
									<Text mb={2} color='gray.700'>
										Selected: {selectedFileName}
									</Text>
								)}

								<input
									ref={fileInputRef}
									type='file'
									accept='audio/*'
									style={{ display: 'none' }}
									onChange={(e) => {
										const f = e.target.files[0];
										setSelectedFileName(f ? f.name : '');
									}}
								/>

								<Button
									onClick={() => {
										setSelectedFileName('');
										fileInputRef.current.click();
									}}
									colorScheme='blue'
									mr={2}
								>
									Select File
								</Button>
								<Button onClick={handleUploadSong} colorScheme='green'>
									Upload Song
								</Button>
							</>
						) : (
							<Text color='gray.500'>This user hasn’t uploaded any songs yet.</Text>
						)}
					</Box>
				)}
			</Box>

			{/* Posts Section */}
			<Box bg='white' borderWidth='1px' borderRadius='lg' p={6} mt={6}>
				<Heading size='md' mb={4}>
					Posts
				</Heading>

				{/* Add Post Section only profile user can see this*/}
				{isOwnProfile && (
					<Box
						border='1px solid'
						borderColor='gray.200'
						borderRadius='md'
						p={4}
						mb={4}
						bg='gray.50'
					>
						<VStack spacing={3} align='stretch'>
							<Textarea
								placeholder="What's on your mind?"
								value={newPostContent}
								onChange={(e) => setNewPostContent(e.target.value)}
								resize='none'
								rows={3}
								bg='white'
								border='1px solid'
								borderColor='gray.200'
								borderRadius='8px'
								fontSize='md'
								_focus={{
									borderColor: 'blue.400',
									boxShadow: '0 0 0 1px blue.400',
								}}
							/>
							<HStack justify='flex-end'>
								<Button
									size='sm'
									colorScheme='blue'
									onClick={handleAddPost}
									isDisabled={!newPostContent.trim()}
								>
									Add Post
								</Button>
							</HStack>
						</VStack>
					</Box>
				)}

				{/* Posts List */}
				{posts.length > 0 ? (
					<VStack spacing={4} align='stretch'>
						{posts.map((post) => (
							<PostCard
								key={post.id}
								profileUser={profileUser}
								post={post}
								loggedInUser={loggedInUser}
								onPostDeleted={handlePostDeleted}
								onPostUpdated={handlePostUpdated}
							/>
						))}
					</VStack>
				) : (
					<Box
						border='2px dashed'
						borderColor='gray.300'
						borderRadius='md'
						p={8}
						textAlign='center'
					>
						{isOwnProfile ? (
							<Text color='gray.500'>You haven't added any posts yet!</Text>
						) : (
							<Text color='gray.500'>This user hasn't posted anything yet.</Text>
						)}
					</Box>
				)}
			</Box>
		</Container>
	);
}
