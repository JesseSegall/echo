import { HStack, VStack, Box, Text, Input, Button } from '@chakra-ui/react';

export default function InfoSection({
	profileUser,
	isOwnProfile,
	isEditingProfile,
	isEditingInfo,
	infoValues,
	setInfoValues,
	onStartEditInfo,
	onSaveInfo,
	onCancelInfo,
}) {
	if (isEditingProfile && isEditingInfo) {
		return (
			<VStack align='start' flex={1} mr={4} spacing={4}>
				<HStack spacing={4} w='100%'>
					<Box flex={1}>
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
					<Box flex={1}>
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
					<Box flex={1}>
						<Text fontSize='sm' mb={1} fontWeight='medium'>
							Instrument
						</Text>
						<Input
							size='sm'
							value={infoValues.instrument}
							onChange={(e) => setInfoValues((prev) => ({ ...prev, instrument: e.target.value }))}
							placeholder='Instrument'
						/>
					</Box>
				</HStack>
				<HStack>
					<Button size='sm' colorScheme='green' onClick={onSaveInfo}>
						Save
					</Button>
					<Button size='sm' variant='outline' onClick={onCancelInfo}>
						Cancel
					</Button>
				</HStack>
			</VStack>
		);
	}

	return (
		<HStack spacing={4}>
			<Text fontSize='lg' fontWeight='bold'>
				{profileUser.username}
			</Text>
			<Text fontSize='sm' color='gray.500'>
				{profileUser.city || 'City'}
			</Text>
			<Text fontSize='sm' color='gray.500'>
				{profileUser.state || 'State'}
			</Text>
			<Text fontSize='sm' color='gray.500'>
				{profileUser.instrument || 'Instrument'}
			</Text>
			{isOwnProfile && isEditingProfile && (
				<Button size='sm' colorScheme='blue' variant='outline' onClick={onStartEditInfo}>
					Edit Info
				</Button>
			)}
		</HStack>
	);
}
