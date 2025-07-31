import { Box, VStack, Button, Text, Heading } from '@chakra-ui/react';
import AudioPlayer from './AudioPlayer';

export default function SongsSection({
	songs,
	isOwnProfile,
	isEditingProfile,
	selectedFileName,
	onSelectSongFile,
	onUploadSong,
	onDeleteSong,
	fileInputRef,
	uploaderImage,
	loggedInUser,
}) {
	return (
		<Box bg='white' borderWidth='1px' borderRadius='lg' p={6} mt={6}>
			<Heading size='md' mb={4}>
				Songs
			</Heading>

			{isOwnProfile && isEditingProfile && (
				<Box border='2px dashed' borderColor='gray.300' p={4} mb={6} textAlign='center'>
					<Text mb={2}>Upload a New Song</Text>
					{selectedFileName && <Text mb={2}>{selectedFileName}</Text>}
					<input
						ref={fileInputRef}
						type='file'
						accept='audio/*'
						hidden
						onChange={(e) => onSelectSongFile(e.target.files?.[0]?.name)}
					/>
					<Button mr={3} onClick={() => fileInputRef.current.click()}>
						Select File
					</Button>
					<Button colorScheme='green' onClick={onUploadSong} isDisabled={!selectedFileName}>
						Upload Song
					</Button>
				</Box>
			)}

			{songs.length > 0 ? (
				<VStack spacing={4} align='stretch'>
					{songs.map((song) => (
						<AudioPlayer
							key={song.id}
							song={song}
							uploaderName={song.uploaderName}
							uploaderImage={uploaderImage}
							loggedInUser={loggedInUser}
							isOwnProfile={isOwnProfile}
							onDelete={() => onDeleteSong(song.id)}
						/>
					))}
				</VStack>
			) : (
				<Box border='2px dashed' borderColor='gray.300' p={8} textAlign='center'>
					<Text color='gray.500'>
						{isOwnProfile
							? "You haven't uploaded any songs yet."
							: "This user hasn't uploaded any songs yet."}
					</Text>
				</Box>
			)}
		</Box>
	);
}
