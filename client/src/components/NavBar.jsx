import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react'
import {NavLink} from "react-router-dom";


function NavBar() {


    return (
        <Box bg="blue.500" shadow="md" px={4} borderRadius="md" color="white">
            <Flex h={16} alignItems="center">
                <Heading size="md">Echo Music</Heading>
                <Spacer />
                <Button as={NavLink} to='/signup' variant="outline" colorScheme="white" mr={3}>Sign Up</Button>
                <Button as={NavLink} to='/login' variant="outline" colorScheme="white">Login</Button>
            </Flex>
        </Box>
    );
}

export default NavBar;
