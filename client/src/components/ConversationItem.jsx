import { Box, HStack, VStack, Text, Avatar, IconButton, Menu } from '@chakra-ui/react';
import { FaEllipsisH, FaTrash } from 'react-icons/fa';
export default function ConversationItem({ conversation, isSelected, onClick, onDelete }) {
	const getTimeAgo = (dateString) => {
		if (!dateString) return '';
		const now = new Date();
		const messageDate = new Date(dateString);
		const diffInMs = now - messageDate;

		const minutes = Math.floor(diffInMs / (1000 * 60));
		const hours = Math.floor(diffInMs / (1000 * 60 * 60));
		const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (minutes < 1) return 'now';
		if (minutes < 60) return `${minutes}m`;
		if (hours < 24) return `${hours}h`;
		if (days < 7) return `${days}d`;

		return messageDate.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<Box
			p={3}
			cursor='pointer'
			bg={isSelected ? 'blue.50' : 'white'}
			borderLeft={isSelected ? '3px solid' : '3px solid transparent'}
			borderColor='blue.500'
			_hover={{ bg: 'gray.50' }}
			onClick={onClick}
		>
			<HStack spacing={3} align='start'>
				<Avatar.Root size='md'>
					<Avatar.Image src={conversation.otherUserImage} />
					<Avatar.Fallback name={conversation.otherUsername || 'User'} />
				</Avatar.Root>
				<VStack align='start' spacing={1} flex={1} minW={0}>
					<HStack justify='space-between' w='full'>
						<Text fontSize='sm' fontWeight='600' color='gray.800' isTruncated>
							{conversation.otherUsername}
						</Text>
						<Text fontSize='xs' color='gray.500'>
							{getTimeAgo(conversation.lastMessageAt)}
						</Text>
					</HStack>
					<Text fontSize='xs' color='gray.600' isTruncated>
						{conversation.lastMessageText || 'No messages yet'}
					</Text>
				</VStack>

				<Menu.Root>
					<Menu.Trigger asChild>
						<IconButton
							aria-label='More options'
							size='sm'
							variant='ghost'
							color='gray.500'
							_hover={{ color: 'gray.700', bg: 'gray.50' }}
						>
							<FaEllipsisH />
						</IconButton>
					</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Item
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}
								color='red.500'
								_hover={{ color: 'red.700', bg: 'red.50' }}
							>
								<HStack spacing={2}>
									<FaTrash />
									<Text>Delete Post</Text>
								</HStack>
							</Menu.Item>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			</HStack>
		</Box>
	);
}
