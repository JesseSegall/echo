import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {
    Box,
    Flex,
    Text,
    Avatar,
    Image,
    Container,
    HStack,
    Button,
    VStack,
    Textarea
} from '@chakra-ui/react'


export default function UserProfile() {
    const {username} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:8080/api/user/profile/${username}`)
            .then((response) => {
                if(response.status >= 200 && response.status < 300) {
                    return response.json().then((user) => {
                        setUser(user);
                    })
                } else {
                    navigate('/notFound')
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                navigate('/notFound');
            });
    }, [])
    console.log(user);
    return (
        <Container maxW="container.md" p={6}>
            {/* Info Bar with user details and message button */}
            <Box bg="white" boxShadow="sm" borderRadius="lg" p={4} mb={4}>
                <Flex justify="space-between" align="center">
                    <HStack spacing={4}>
                        <Text fontSize="lg" fontWeight="bold">
                            {user?.username ?? "User name"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Goes to college
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {user?.genre ?? "Genre"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {user?.location ?? "Location"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {user?.instrument ?? "Instrument"}
                        </Text>
                    </HStack>
                    <Button size="sm" colorScheme="blue" variant="outline">
                        Message
                    </Button>
                </Flex>
            </Box>


            {/* Profile Photo and Bio Section */}
            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="lg"
                p={6}
            >
                <Flex gap={10} align="center" justify="space-between">
                    {/* Large Profile Photo */}
                    <Image
                        src={user?.profileImgUrl}
                        boxSize="250px"
                        borderRadius="full"
                        fit="cover"
                        alt="Naruto Uzumaki"
                    />

                    {/* Bio Text Area */}
                    <Box mx="auto" flex="1">
                        <Textarea
                            value={user?.bio ?? ""}
                            placeholder="Tell us about yourself…"
                            readOnly
                            variant="filled"
                            bg="gray.50"
                            borderRadius="md"
                            p={4}
                            w="100%"
                            minH="150px"
                            maxH="300px"
                            resize="vertical"
                            fontSize="md"
                            lineHeight="tall"
                            color="gray.800"
                            _placeholder={{ color: "gray.400" }}
                        />


                    </Box>
                </Flex>
            </Box>
        </Container>
    )

}