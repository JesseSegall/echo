import { Box, Flex, HStack, Button } from '@chakra-ui/react';
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
			</Flex>
		</Box>
	);
}
