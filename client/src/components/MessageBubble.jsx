import { Box, HStack, VStack, Text, Avatar } from '@chakra-ui/react';

export default function MessageBubble({ message, isOwnMessage, ownProfileImage }) {
	const getTimeAgo = (dateString) => {
		const now = new Date();
		const messageDate = new Date(dateString);
		const diffInMs = now - messageDate;

		const minutes = Math.floor(diffInMs / (1000 * 60));
		const hours = Math.floor(diffInMs / (1000 * 60 * 60));

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;

		return messageDate.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<HStack justify={isOwnMessage ? 'flex-end' : 'flex-start'} align='start' spacing={2} mb={3}>
			{!isOwnMessage && (
				<Avatar.Root size='sm'>
					<Avatar.Image src={message.senderImage} />
					<Avatar.Fallback name={message.senderName || 'User'} />
				</Avatar.Root>
			)}
			<VStack align={isOwnMessage ? 'end' : 'start'} spacing={1} maxW='70%'>
				<Box
					bg={isOwnMessage ? 'blue.500' : 'gray.100'}
					color={isOwnMessage ? 'white' : 'gray.800'}
					px={3}
					py={2}
					borderRadius='18px'
					borderBottomLeftRadius={isOwnMessage ? '18px' : '4px'}
					borderBottomRightRadius={isOwnMessage ? '4px' : '18px'}
				>
					<Text fontSize='sm'>{message.body}</Text>
				</Box>
				<Text fontSize='xs' color='gray.500'>
					{getTimeAgo(message.sentAt)}
				</Text>
			</VStack>
			{isOwnMessage && (
				<Avatar.Root size='sm'>
					<Avatar.Image src={ownProfileImage} />
					<Avatar.Fallback name={message.senderName || 'You'} />
				</Avatar.Root>
			)}
		</HStack>
	);
}
