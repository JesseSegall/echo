import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react'
import {NavLink} from "react-router-dom";


function NavBar({user, setUser}) {


    return (
        <Box bg="blue.500" shadow="md" px={4} borderRadius="md" color="white">
            <Flex h={16} alignItems="center">
                <Heading size="md">Echo Music</Heading>
                <Spacer />
                {
                    !user && (
                        <>
                <Button as={NavLink} to='/signup' variant="outline" colorScheme="white" mr={3}>Sign Up</Button>
                <Button as={NavLink} to='/login' variant="outline" colorScheme="white">Login</Button>

                        </>
                    )
                }
                {
                    user && (
                        <Button as={NavLink} to='/' variant="outline" colorScheme="white"
                        onClick={() => {
                            setUser(null);
                            localStorage.removeItem('user');

                        }}
                        >Logout</Button>
                    )
                }
            </Flex>
        </Box>
    );
}

export default NavBar;
