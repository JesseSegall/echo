import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Avatar, IconButton } from '@chakra-ui/react';
import { FaEnvelope } from 'react-icons/fa';

function NavBar({ user, setUser, fullUser }) {
	return (
		<Box bg='blue.500' shadow='md' px={4} borderRadius='md' color='white'>
			<Flex h={16} alignItems='center'>
				<Heading size='md'>Echo Music</Heading>
				<Spacer />
				{!user && (
					<>
						<Button as={NavLink} to='/signup' variant='outline' colorScheme='white' mr={3}>
							Sign Up
						</Button>
						<Button as={NavLink} to='/login' variant='outline' colorScheme='white'>
							Login
						</Button>
					</>
				)}
				{user && (
					<>
						{fullUser && (
							<Avatar.Root
								mr={3}
								as={NavLink}
								to={`/profile/${fullUser.username}`}
								size='md'
								className='avatar'
							>
								<Avatar.Fallback name={fullUser.username} />
								<Avatar.Image src={fullUser.profileImgUrl} />
							</Avatar.Root>
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
							as={NavLink}
							to='/'
							variant='outline'
							colorScheme='white'
							onClick={() => {
								setUser(null);
								localStorage.removeItem('user');
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

export default NavBar;
