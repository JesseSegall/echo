import { Box, Flex, Heading, Button, Spacer, SkeletonCircle, Avatar } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

export default function NavBar() {
	const { user, setUser, fullUser, bands } = useUser();

	const ownBand = bands && bands.length > 0 ? bands[0] : null;

	const avatarSrc = ownBand ? ownBand.bandImgUrl : fullUser?.profileImgUrl;
	const avatarName = ownBand ? ownBand.name : fullUser?.username;

	const profilePath = ownBand ? `/band/${ownBand.id}` : `/profile/${fullUser?.username}`;

	return (
		<Box bg='blue.500' shadow='md' px={4} borderRadius='md' color='white'>
			<Flex h={16} alignItems='center'>
				<Heading size='md'>Echo Music</Heading>
				<Spacer />

				{!user ? (
					<>
						<Button as={NavLink} to='/signup' variant='outline' colorScheme='white' mr={3}>
							Sign Up
						</Button>
						<Button as={NavLink} to='/login' variant='outline' colorScheme='white'>
							Login
						</Button>
					</>
				) : (
					<>
						{fullUser ? (
							<Avatar.Root as={NavLink} to={profilePath} size='md' mr={3}>
								<Avatar.Fallback name={avatarName} />
								<Avatar.Image src={avatarSrc} />
							</Avatar.Root>
						) : (
							<SkeletonCircle size='40px' mr={3} />
						)}

						<Button
							as={NavLink}
							to='/messages'
							variant='ghost'
							color='white'
							fontSize='20px'
							p={0}
							mr={3}
							_hover={{ bg: 'whiteAlpha.200' }}
						>
							<FaEnvelope />
						</Button>

						<Button
							variant='outline'
							colorScheme='white'
							onClick={() => {
								setUser(null);
								localStorage.removeItem('user');
								navigate('/');
							}}
						>
							Logout
						</Button>
					</>
				)}
			</Flex>
		</Box>
	);
}
