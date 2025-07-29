import { Flex, Button, Heading } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function SignUpChoice() {
	return (
		<Flex direction='column' align='center' justify='center' minH='60vh' gap={6}>
			<Heading size='lg'>Sign Up As…</Heading>
			<Flex gap={4}>
				<Button as={NavLink} to='/signup/user' colorScheme='teal' size='lg'>
					Individual
				</Button>
				<Button as={NavLink} to='/signup/band' colorScheme='orange' size='lg'>
					Band
				</Button>
			</Flex>
		</Flex>
	);
}
