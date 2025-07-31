import { Box, Flex, HStack, Button, VStack, Text, Badge } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react';
import InfoSection from './InfoSection';

export default function ProfileHeader({
	profileUser,
	isOwnProfile,
	isEditingProfile,
	isEditingInfo,
	infoValues,
	setInfoValues,
	onStartEditProfile,
	onSaveProfile,
	onCancelEditProfile,
	onStartEditInfo,
	onSaveInfo,
	onCancelInfo,
	onMessageUser,
	onToggleLookingForMembers,
}) {
	return (
		<Box bg='white' boxShadow='sm' borderRadius='lg' p={4} mb={4}>
			<Flex justify='space-between' align='center'>
				<InfoSection
					profileUser={profileUser}
					isOwnProfile={isOwnProfile}
					isEditingProfile={isEditingProfile}
					isEditingInfo={isEditingInfo}
					infoValues={infoValues}
					setInfoValues={setInfoValues}
					onSaveInfo={onSaveInfo}
					onCancelInfo={onCancelInfo}
					onStartEditInfo={onStartEditInfo}
				/>

				<VStack align='end' spacing={3}>
					{profileUser.needsNewMember && (
						<Badge
							colorPalette='green'
							variant='solid'
							px={3}
							py={1}
							borderRadius='full'
							fontSize='sm'
						>
							Looking for New Members!
						</Badge>
					)}

					{/* Looking for Members toggle for owners when editing */}
					{isOwnProfile && isEditingProfile && (
						<HStack spacing={3} align='center'>
							<Text fontSize='sm' color='gray.600'>
								Looking for new members:
							</Text>
							<Switch.Root
								checked={profileUser.needsNewMember}
								onCheckedChange={(details) => onToggleLookingForMembers(details.checked)}
								size='md'
							>
								<Switch.HiddenInput />
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
							</Switch.Root>
						</HStack>
					)}

					<HStack spacing={2}>
						{/* Message button */}
						{!isOwnProfile && (
							<Button size='sm' colorScheme='blue' variant='outline' onClick={onMessageUser}>
								Message
							</Button>
						)}

						{/* Edit / Save / Cancel buttons */}
						{isOwnProfile && !isEditingProfile && (
							<Button size='sm' colorScheme='blue' variant='outline' onClick={onStartEditProfile}>
								Edit Profile
							</Button>
						)}
						{isOwnProfile && isEditingProfile && (
							<>
								<Button size='sm' colorScheme='green' onClick={onSaveProfile}>
									Save Profile
								</Button>
								<Button size='sm' variant='outline' onClick={onCancelEditProfile}>
									Cancel
								</Button>
							</>
						)}
					</HStack>
				</VStack>
			</Flex>
		</Box>
	);
}
