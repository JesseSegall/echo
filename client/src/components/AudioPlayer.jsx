import { useState, useRef } from 'react';
import {
	Box,
	HStack,
	VStack,
	Image,
	IconButton,
	Text,
	Flex,
	Card,
	Avatar,
	Badge,
} from '@chakra-ui/react';
import Wavesurfer from '@wavesurfer/react';
import { FaPlay, FaPause, FaHeart, FaShare, FaDownload } from 'react-icons/fa';

export default function AudioPlayer({ song, uploaderName }) {
	const [playing, setPlaying] = useState(false);
	const [liked, setLiked] = useState(false);
	const wavesurferRef = useRef(null);

	const { title, fileUrl, createdAt, albumCoverUrl } = song;
	const coverSrc =
		albumCoverUrl ||
		'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop';

	const uploadDate = createdAt
		? new Date(createdAt).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
		  })
		: '';

	const handlePlayPause = () => {
		const ws = wavesurferRef.current;
		if (ws) {
			ws.playPause();
			setPlaying((p) => !p);
		}
	};

	return (
		<Card.Root
			overflow='hidden'
			bg='white'
			borderRadius='16px'
			boxShadow='0 2px 12px rgba(0,0,0,0.08)'
			transition='all 0.2s ease'
			_hover={{
				boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
				transform: 'translateY(-1px)',
			}}
			w='full'
			maxW='none'
			mx='auto'
		>
			<Card.Body p={0}>
				{/* Header Section */}
				<Flex align='center' p={4} pb={3}>
					<Avatar.Root size='sm' mr={3}>
						<Avatar.Image src={coverSrc} />
						<Avatar.Fallback name={uploaderName} />
					</Avatar.Root>
					<VStack align='start' spacing={0} flex={1}>
						<Text fontSize='sm' fontWeight='600' color='gray.700'>
							{uploaderName}
						</Text>
						<Text fontSize='xs' color='gray.500'>
							{uploadDate}
						</Text>
					</VStack>
					<Badge
						colorPalette='orange'
						variant='subtle'
						borderRadius='full'
						px={2}
						py={1}
						fontSize='xs'
					>
						{createdAt}
					</Badge>
				</Flex>

				{/* Main Player Section */}
				<Flex p={4} pt={0} gap={4} align='center'>
					{/* Play Button */}
					<IconButton
						aria-label={playing ? 'Pause' : 'Play'}
						onClick={handlePlayPause}
						size='lg'
						colorPalette='orange'
						variant='solid'
						borderRadius='full'
						width='56px'
						height='56px'
						fontSize='18px'
						flexShrink={0}
						boxShadow='0 4px 12px rgba(255, 138, 0, 0.3)'
						_hover={{
							boxShadow: '0 6px 16px rgba(255, 138, 0, 0.4)',
							transform: 'scale(1.05)',
						}}
						transition='all 0.2s ease'
					>
						{playing ? <FaPause /> : <FaPlay />}
					</IconButton>

					{/* Album Cover */}
					<Image
						src={coverSrc}
						boxSize='80px'
						objectFit='cover'
						borderRadius='12px'
						alt='Album cover'
						flexShrink={0}
						border='1px solid'
						borderColor='gray.100'
					/>

					{/* Waveform Section */}
					<VStack align='stretch' flex={1} spacing={2}>
						<Text fontSize='md' fontWeight='600' color='gray.800' isTruncated lineHeight='1.2'>
							{title}
						</Text>

						{/* Waveform Container */}
						<Box
							height='60px'
							borderRadius='8px'
							bg='gray.50'
							p={2}
							position='relative'
							overflow='hidden'
						>
							<Wavesurfer
								onReady={(ws) => {
									wavesurferRef.current = ws;
								}}
								url={fileUrl}
								waveColor='#E2E8F0'
								progressColor='linear-gradient(90deg, #FF8A00, #FF6B35)'
								cursorColor='#FF8A00'
								barWidth={2}
								barGap={1}
								height={44}
								normalize={true}
								barRadius={2}
							/>
						</Box>
					</VStack>
				</Flex>

				{/* Action Buttons */}
				<Flex
					px={4}
					pb={4}
					justify='space-between'
					align='center'
					borderTop='1px solid'
					borderColor='gray.100'
					pt={3}
					mt={1}
				>
					<HStack spacing={4}>
						<IconButton
							aria-label='Like'
							size='sm'
							variant='ghost'
							colorPalette={liked ? 'red' : 'gray'}
							color={liked ? 'red.500' : 'gray.500'}
							onClick={() => setLiked(!liked)}
							_hover={{
								color: liked ? 'red.600' : 'red.400',
								bg: liked ? 'red.50' : 'gray.50',
							}}
						>
							<FaHeart />
						</IconButton>
						<IconButton
							aria-label='Share'
							size='sm'
							variant='ghost'
							color='gray.500'
							_hover={{ color: 'gray.700', bg: 'gray.50' }}
						>
							<FaShare />
						</IconButton>
						<IconButton
							aria-label='Download'
							size='sm'
							variant='ghost'
							color='gray.500'
							_hover={{ color: 'gray.700', bg: 'gray.50' }}
						>
							<FaDownload />
						</IconButton>
					</HStack>

					<HStack spacing={3} color='gray.500' fontSize='xs'>
						<Text>👥 24</Text>
						<Text>❤️ 12</Text>
						<Text>💬 3</Text>
					</HStack>
				</Flex>
			</Card.Body>
		</Card.Root>
	);
}
