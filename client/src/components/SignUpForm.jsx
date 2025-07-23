import { useState } from "react";
import {
    Box,
    VStack,
    Field,
    Input,
    Button,
    Heading,
    Card
} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom";

export default function SignUpForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/user',
            { method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),

            });
        if(200 <= response.status && response.status < 300) {
            navigate('/')
        }
        console.log({ username, email, password });
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            shadow="md"
            justifyContent="center"
            minH="100vh"
            bg="gray.50"
            p={4}
        >
            <Card.Root maxW="md" w="full" p={8} shadow="lg" borderRadius="md" bg="white">
                <VStack spacing={6} >
                    <Heading size="lg" textAlign="center">
                        Create an Account
                    </Heading>

                    <Box as="form" w="full" onSubmit={handleSubmit} >
                        <VStack spacing={4}>
                            <Field.Root>
                                <Field.Label htmlFor="username">Username</Field.Label>
                                <Input
                                    name="username"
                                    id="username-input"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="Enter your username"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label htmlFor="email">Email</Field.Label>
                                <Input
                                    name="email"
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Enter your email"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label htmlFor="password">Password</Field.Label>
                                <Input
                                    name="password"
                                    id="password-input"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                />
                            </Field.Root>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                size="lg"
                                w="full"
                                mt={4}
                            >
                                Create Account
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Card.Root>
        </Box>
    );
}