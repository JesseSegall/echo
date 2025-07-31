import { Link } from 'react-router-dom';
import { HStack, VStack, Text, Button, Card, Avatar, Badge } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function BandCard({ band }) {
	return (
		<Card.Root
			overflow='hidden'
			bg='white'
			borderRadius='16px'
			boxShadow='0 2px 12px rgba(0,0,0,0.08)'
			transition='all 0.2s ease'
			_hover={{
				boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
				transform: 'translateY(-2px)',
			}}
		>
			<Card.Body p={4}>
				<VStack spacing={3} align='center'>
					<Avatar.Root size='lg'>
						<Avatar.Image src={band.bandImgUrl} />
						<Avatar.Fallback name={band.name} />
					</Avatar.Root>

					<VStack spacing={1} align='center'>
						<Text fontSize='lg' fontWeight='600' color='gray.800'>
							{band.name}
						</Text>
					</VStack>

					<HStack spacing={2} flexWrap='wrap' justify='center'>
						{band.genre && (
							<Badge colorPalette='purple' variant='subtle' borderRadius='full' px={3} py={1}>
								{band.genre}
							</Badge>
						)}
						{band.needsNewMember && (
							<Badge colorPalette='green' variant='subtle' borderRadius='full' px={3} py={1}>
								Looking for New Members!
							</Badge>
						)}
					</HStack>

					{(band.city || band.state) && (
						<HStack spacing={1} color='gray.500' fontSize='sm'>
							<FaMapMarkerAlt size={12} />
							<Text>
								{band.city}
								{band.city && band.state && ', '}
								{band.state}
							</Text>
						</HStack>
					)}

					{band.bio && (
						<Text fontSize='sm' color='gray.600' textAlign='center' noOfLines={2} minH='2.5em'>
							{band.bio}
						</Text>
					)}

					<Button
						as={Link}
						to={`/band/${band.id}`}
						size='sm'
						colorScheme='purple'
						variant='outline'
						mt={2}
						w='full'
					>
						View Band
					</Button>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
}
