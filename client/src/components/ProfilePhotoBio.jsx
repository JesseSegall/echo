import {
	Box,
	Flex,
	Image,
	Button,
	Textarea,
	VStack,
	HStack,
	Input,
	Text,
	Dialog,
	Portal,
} from '@chakra-ui/react';

export default function ProfilePhotoBio({
	profileUser,
	isOwnProfile,
	isEditingProfile,
	isEditingBio,
	bioValue,
	setBioValue,
	onStartEditBio,
	onSaveBio,
	onCancelBio,
	fileInputRef,
	selectedFileName,
	onSelectPhoto,
	isPhotoDialogOpen,
	onOpenPhotoDialog,
	onClosePhotoDialog,
	onSavePhoto,
}) {
	const imageUrl =
		profileUser.profileImgUrl ||
		profileUser.bandImgUrl ||
		'https://ui-avatars.com/api/?name=No+Photo&size=250';
	return (
		<>
			<Box bg='white' borderWidth='1px' borderColor='gray.300' borderRadius='lg' p={6} mb={4}>
				<Flex gap={6} align='center' justify='space-between'>
					{/* Avatar & Photo Button */}
					<Box>
						<Image
							src={imageUrl}
							boxSize='250px'
							borderRadius='full'
							objectFit='cover'
							alt={profileUser.username || profileUser.name}
							bg='gray.200'
						/>
						{isOwnProfile && isEditingProfile && (
							<Button size='sm' colorScheme='blue' mt={3} onClick={onOpenPhotoDialog}>
								Upload Photo
							</Button>
						)}
					</Box>

					{/* Bio Editor/Viewer */}
					<Box flex={1}>
						{isEditingBio ? (
							<VStack align='stretch' spacing={3}>
								<Textarea
									value={bioValue}
									onChange={(e) => setBioValue(e.target.value)}
									placeholder='Tell us about yourself…'
									variant='filled'
								/>
								<HStack>
									<Button size='sm' colorScheme='green' onClick={onSaveBio}>
										Save Bio
									</Button>
									<Button size='sm' variant='outline' onClick={onCancelBio}>
										Cancel
									</Button>
								</HStack>
							</VStack>
						) : (
							<Box position='relative'>
								<Textarea value={profileUser.bio || ''} isReadOnly variant='filled' bg='gray.50' />
								{isOwnProfile && isEditingProfile && (
									<Button
										position='absolute'
										top='10px'
										right='10px'
										size='sm'
										colorScheme='green'
										onClick={onStartEditBio}
									>
										Edit Bio
									</Button>
								)}
							</Box>
						)}
					</Box>
				</Flex>
			</Box>

			{/* Dialog for file input & upload */}
			<Dialog.Root open={isPhotoDialogOpen} onOpenChange={(e) => onClosePhotoDialog()}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Update Profile Photo</Dialog.Title>
								<Dialog.CloseTrigger asChild>
									<Button size='sm' onClick={() => onClosePhotoDialog()}>
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
										onChange={(e) => onSelectPhoto(e.target.files[0]?.name)}
									/>
									<Button
										colorScheme='blue'
										mr={3}
										onClick={onSavePhoto}
										isDisabled={!selectedFileName}
									>
										Save Photo Button
									</Button>
									<Button onClick={() => fileInputRef.current.click()} colorScheme='blue' mr={2}>
										Select File
									</Button>
								</Box>
								{imageUrl && (
									<Box mt={4}>
										<Text fontSize='sm' mb={2}>
											Preview:
										</Text>
										<Image
											src={imageUrl}
											boxSize='100px'
											borderRadius='full'
											objectFit='cover'
											alt='Preview'
										/>
									</Box>
								)}
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant='ghost' onClick={() => onClosePhotoDialog()}>
									Cancel
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
}
