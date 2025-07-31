import { Link } from 'react-router-dom';
import { Box, HStack, VStack, Text, Button, Container, Heading } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaMusic, FaUsers } from 'react-icons/fa';

export default function LandingPage() {
	return (
		<Container maxW='container.xl' py={20}>
			<VStack spacing={8} textAlign='center'>
				<VStack spacing={4}>
					<Heading size='4xl' color='blue.600'>
						Welcome to Echo Music
					</Heading>
					<Text fontSize='xl' color='gray.600' maxW='2xl'>
						Connect with musicians and bands in your area. Discover new music, find band members,
						and build your musical network.
					</Text>
				</VStack>

				<HStack spacing={8} mt={8}>
					<VStack spacing={2}>
						<Box p={4} bg='blue.50' borderRadius='full'>
							<FaUsers size={24} color='#3182CE' />
						</Box>
						<Text fontWeight='600'>Find Musicians</Text>
						<Text fontSize='sm' color='gray.600' textAlign='center'>
							Connect with talented musicians looking for bands
						</Text>
					</VStack>
					<VStack spacing={2}>
						<Box p={4} bg='purple.50' borderRadius='full'>
							<FaMusic size={24} color='#805AD5' />
						</Box>
						<Text fontWeight='600'>Discover Bands</Text>
						<Text fontSize='sm' color='gray.600' textAlign='center'>
							Explore local bands and their music
						</Text>
					</VStack>
					<VStack spacing={2}>
						<Box p={4} bg='green.50' borderRadius='full'>
							<FaMapMarkerAlt size={24} color='#38A169' />
						</Box>
						<Text fontWeight='600'>Local Network</Text>
						<Text fontSize='sm' color='gray.600' textAlign='center'>
							Build connections in your local music scene
						</Text>
					</VStack>
				</HStack>

				<VStack spacing={4} mt={12}>
					<Text fontSize='lg' fontWeight='600' color='gray.700'>
						Ready to join the community?
					</Text>
					<HStack spacing={4}>
						<Button as={Link} to='/signup' colorScheme='blue' size='lg'>
							Sign Up Now
						</Button>
						<Button as={Link} to='/login' variant='outline' size='lg'>
							Login
						</Button>
					</HStack>
				</VStack>
			</VStack>
		</Container>
	);
}
