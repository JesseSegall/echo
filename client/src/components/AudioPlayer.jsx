import { useState, useRef } from 'react';
import { Box, HStack, VStack, Image, IconButton, Text, Flex } from '@chakra-ui/react';
import Wavesurfer from '@wavesurfer/react';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function AudioPlayer({ song, uploaderName }) {
	const [playing, setPlaying] = useState(false);
	const wavesurferRef = useRef(null);

	const { title, fileUrl, createdAt, albumCoverUrl } = song;

	const coverSrc = albumCoverUrl || '/default-cover.png';

	const uploadDate = createdAt
		? new Date(createdAt).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
		  })
		: '';

	return (
		<Box
			borderWidth='1px'
			borderRadius='md'
			p={4}
			bg='gray.50'
			boxShadow='sm'
			maxW='800px'
			mx='auto'
		>
			<Flex justify='space-between' mb={4}>
				<Text fontSize='lg' fontWeight='bold'>
					{uploaderName}
				</Text>
				<Text fontSize='sm' color='gray.500'>
					{uploadDate}
				</Text>
			</Flex>

			<HStack spacing={4}>
				<IconButton
					icon={playing ? <FaPause /> : <FaPlay />}
					aria-label={playing ? 'Pause' : 'Play'}
					onClick={() => {
						const ws = wavesurferRef.current;
						if (ws) {
							ws.playPause();
							setPlaying((p) => !p);
						}
					}}
					size='md'
				/>

				<Image
					src={coverSrc}
					boxSize='60px'
					objectFit='cover'
					borderRadius='md'
					alt='Album cover'
				/>

				<VStack align='stretch' flex='1'>
					<Text fontSize='md' isTruncated>
						{title}
					</Text>
					<Box h='50px'>
						<Wavesurfer
							onReady={(ws) => {
								wavesurferRef.current = ws;
							}}
							url={fileUrl}
							waveColor='#CBD5E0'
							progressColor='#ED64A6'
							cursorColor='#ED64A6'
							barWidth={2}
							height={50}
						/>
					</Box>
				</VStack>
			</HStack>
		</Box>
	);
}
