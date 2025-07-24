import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {
    Box,
    Flex,
    Text,
    Image,
    Container,
    HStack,
    Button,
    Textarea,
    Input,
    VStack,
    Dialog,
    Portal
} from '@chakra-ui/react'

export default function UserProfile({user: loggedInUser }) {
    const {username} = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);

    // Master edit state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioValue, setBioValue] = useState("");
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [infoValues, setInfoValues] = useState({
        city: "",
        state: "",
        instrument: ""
    });


    const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");

    useEffect(() => {
        console.log("⏱️ useEffect fired for", username)
        fetch(`http://localhost:8080/api/user/profile/${username}`)
            .then((response) => {
                if(response.status >= 200 && response.status < 300) {
                    return response.json().then((user) => {
                        setProfileUser(user);
                        setBioValue(user.bio || "");
                        setInfoValues({
                            city: user.city || "",
                            state: user.state || "",
                            instrument: user.instrument || ""
                        });
                    })
                } else {
                    navigate('/notFound')
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                navigate('/notFound');
            });
    }, [username, navigate]);

    const isOwnProfile = loggedInUser && profileUser && loggedInUser.id === profileUser.id;
    console.log("Profile User: ", profileUser);

    const handleSaveBio = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...profileUser,
                    bio: bioValue
                })
            });

            if (response.ok) {
                setProfileUser(prev => ({...prev, bio: bioValue}));
                setIsEditingBio(false);
            }
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    const handleSaveInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...profileUser,
                    city: infoValues.city,
                    state: infoValues.state,
                    instrument: infoValues.instrument
                })
            });

            if (response.ok) {
                setProfileUser(prev => ({
                    ...prev,
                    city: infoValues.city,
                    state: infoValues.state,
                    instrument: infoValues.instrument
                }));
                setIsEditingInfo(false);
            }
        } catch (error) {
            console.error('Error updating info:', error);
        }
    };

    const handleSavePhoto = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...profileUser,
                    profileImgUrl: photoUrl
                })
            });

            if (response.ok) {
                setProfileUser(prev => ({...prev, profileImgUrl: photoUrl}));
                setPhotoUrl("");
                setIsPhotoDialogOpen(false);
            }
        } catch (error) {
            console.error('Error updating photo:', error);
        }
    };

    return (
        <Container maxW="container.md" p={6}>

            <Box bg="white" boxShadow="sm" borderRadius="lg" p={4} mb={4}>
                <Flex justify="space-between" align="center">
                    {isEditingProfile && isEditingInfo ? (
                        <VStack align="start" flex={1} mr={4}>
                            <HStack spacing={4} width="100%">
                                <Box>
                                    <Text fontSize="sm" mb={1} fontWeight="medium">City</Text>
                                    <Input
                                        size="sm"
                                        value={infoValues.city}
                                        onChange={(e) => setInfoValues(prev => ({...prev, city: e.target.value}))}
                                        placeholder="City"
                                    />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" mb={1} fontWeight="medium">State</Text>
                                    <Input
                                        size="sm"
                                        value={infoValues.state}
                                        onChange={(e) => setInfoValues(prev => ({...prev, state: e.target.value}))}
                                        placeholder="State"
                                    />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" mb={1} fontWeight="medium">Instrument</Text>
                                    <Input
                                        size="sm"
                                        value={infoValues.instrument}
                                        onChange={(e) => setInfoValues(prev => ({...prev, instrument: e.target.value}))}
                                        placeholder="Instrument"
                                    />
                                </Box>
                            </HStack>
                            <HStack>
                                <Button size="sm" colorScheme="green" onClick={handleSaveInfo}>
                                    Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setIsEditingInfo(false)}>
                                    Cancel
                                </Button>
                            </HStack>
                        </VStack>
                    ) : (
                        <HStack spacing={4}>
                            <Text fontSize="lg" fontWeight="bold">
                                {profileUser?.username ?? "User name"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {profileUser?.city ?? "City"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {profileUser?.state ?? "State"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {profileUser?.instrument ?? "Instrument"}
                            </Text>
                        </HStack>
                    )}
                    {isEditingProfile && !isEditingInfo && (
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setIsEditingInfo(true)}>
                            Edit Info
                        </Button>
                    )}

                    <HStack>
                        {isOwnProfile && !isEditingProfile && (
                            <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setIsEditingProfile(true)}>
                                Edit Profile
                            </Button>
                        )}
                        {isOwnProfile && isEditingProfile && (
                            <Button size="sm" colorScheme="green" onClick={() => {
                                setIsEditingProfile(false);
                                setIsEditingInfo(false);
                                setIsEditingBio(false);
                            }}>
                                Save Profile
                            </Button>
                        )}
                        {!isOwnProfile && (
                            <Button size="sm" colorScheme="blue" variant="outline">
                                Message
                            </Button>
                        )}
                    </HStack>
                </Flex>
            </Box>

            <Box bg="white" borderWidth="1px" borderColor="gray.300" borderRadius="lg" p={6}>
                <Flex gap={10} align="center" justify="space-between">
                    <Box position="relative">
                        <Flex direction="column" align="center" gap={4}>
                            <Image
                                src={profileUser?.profileImgUrl || "https://via.placeholder.com/250x250/E2E8F0/718096?text=No+Photo"}
                                boxSize="250px"
                                borderRadius="full"
                                fit="cover"
                                alt={profileUser?.username || "Profile"}
                                bg="gray.200"
                            />
                            {isOwnProfile && isEditingProfile && (
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() => setIsPhotoDialogOpen(true)}
                                >
                                    Upload Photo
                                </Button>
                            )}
                        </Flex>
                    </Box>


                    <Box mx="auto" flex="1">
                        {isEditingBio ? (
                            <VStack align="stretch" spacing={3}>
                                <Textarea
                                    value={bioValue}
                                    onChange={(e) => setBioValue(e.target.value)}
                                    placeholder="Tell us about yourself…"
                                    variant="outline"
                                    borderRadius="md"
                                    p={4}
                                    w="100%"
                                    minH="150px"
                                    maxH="300px"
                                    resize="vertical"
                                    fontSize="md"
                                    lineHeight="tall"
                                />
                                <HStack>
                                    <Button size="sm" colorScheme="green" onClick={handleSaveBio}>
                                        Save Bio
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setBioValue(profileUser?.bio || "");
                                            setIsEditingBio(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </HStack>
                            </VStack>
                        ) : (
                            <Box position="relative">
                                <Textarea
                                    value={profileUser?.bio ?? ""}
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
                                {isOwnProfile && isEditingProfile && (
                                    <Button
                                        position="absolute"
                                        top="10px"
                                        right="10px"
                                        size="sm"
                                        colorScheme="green"
                                        onClick={() => setIsEditingBio(true)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                </Flex>
            </Box>

            <Dialog.Root open={isPhotoDialogOpen} onOpenChange={(e) => setIsPhotoDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Update Profile Photo</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <Button size="sm" onClick={() => setIsPhotoDialogOpen(false)}>
                                        Close
                                    </Button>
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Box>
                                    <Text fontSize="sm" mb={2} fontWeight="medium">Photo URL</Text>
                                    <Input
                                        placeholder="Enter image URL (for now)"
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                    />
                                </Box>
                                {photoUrl && (
                                    <Box mt={4}>
                                        <Text fontSize="sm" mb={2}>Preview:</Text>
                                        <Image
                                            src={photoUrl}
                                            boxSize="100px"
                                            borderRadius="full"
                                            fit="cover"
                                            alt="Preview"
                                        />
                                    </Box>
                                )}
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button colorScheme="blue" mr={3} onClick={handleSavePhoto} isDisabled={!photoUrl}>
                                    Save Photo
                                </Button>
                                <Button variant="ghost" onClick={() => setIsPhotoDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Container>
    )
}