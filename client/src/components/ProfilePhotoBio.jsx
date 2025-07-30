import { Box, Flex, Image, Button, Textarea, VStack, HStack } from '@chakra-ui/react';

export default function ProfilePhotoBio({
	profileUser,
	isOwnProfile,
	isEditingProfile,
	isEditingBio,
	bioValue,
	setBioValue,
	onSaveBio,
	onCancelBio,
	onStartEditBio,
	onOpenPhotoDialog,
}) {
	return (
		<Box bg='white' borderWidth='1px' borderColor='gray.300' borderRadius='lg' p={6} mb={4}>
			<Flex gap={10} align='center' justify='space-between'>
				<Box position='relative'>
					<Flex direction='column' align='center' gap={4}>
						<Image
							src={
								profileUser.profileImgUrl ||
								'https://via.placeholder.com/250x250/E2E8F0/718096?text=No+Photo'
							}
							boxSize='250px'
							borderRadius='full'
							fit='cover'
							alt={profileUser.username}
							bg='gray.200'
						/>
						{isOwnProfile && isEditingProfile && (
							<Button size='sm' colorScheme='blue' onClick={onOpenPhotoDialog}>
								Upload Photo
							</Button>
						)}
					</Flex>
				</Box>
				<Box flex={1} mx='auto'>
					{isEditingBio ? (
						<VStack align='stretch' spacing={3}>
							<Textarea
								value={bioValue}
								onChange={(e) => setBioValue(e.target.value)}
								placeholder='Tell us about yourself…'
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
							<Textarea value={profileUser.bio || ''} readOnly variant='filled' bg='gray.50' />
							{isOwnProfile && isEditingProfile && (
								<Button
									position='absolute'
									top='10px'
									right='10px'
									size='sm'
									colorScheme='green'
									onClick={onStartEditBio}
								>
									Edit
								</Button>
							)}
						</Box>
					)}
				</Box>
			</Flex>
		</Box>
	);
}
