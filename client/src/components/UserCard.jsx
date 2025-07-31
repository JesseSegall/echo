import { Link } from 'react-router-dom';
import { HStack, VStack, Text, Button, Card, Avatar, Badge } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function UserCard({ user }) {
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
						<Avatar.Image src={user.profileImgUrl} />
						<Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
					</Avatar.Root>

					<VStack spacing={1} align='center'>
						<Text fontSize='lg' fontWeight='600' color='gray.800'>
							{user.firstName} {user.lastName}
						</Text>
						<Text fontSize='sm' color='gray.500'>
							@{user.username}
						</Text>
					</VStack>

					{user.instrument && (
						<Badge colorPalette='blue' variant='subtle' borderRadius='full' px={3} py={1}>
							{user.instrument}
						</Badge>
					)}

					{(user.city || user.state) && (
						<HStack spacing={1} color='gray.500' fontSize='sm'>
							<FaMapMarkerAlt size={12} />
							<Text>
								{user.city}
								{user.city && user.state && ', '}
								{user.state}
							</Text>
						</HStack>
					)}

					{user.bio && (
						<Text fontSize='sm' color='gray.600' textAlign='center' noOfLines={2} minH='2.5em'>
							{user.bio}
						</Text>
					)}

					<Button
						as={Link}
						to={`/profile/${user.username}`}
						size='sm'
						colorScheme='blue'
						variant='outline'
						mt={2}
						w='full'
					>
						View Profile
					</Button>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
}
