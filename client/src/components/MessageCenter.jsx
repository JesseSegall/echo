import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, HStack, VStack, Text, Flex, Avatar, Textarea, IconButton } from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import ConversationItem from './ConversationItem';
import MessageBubble from './MessageBubble';

export default function MessageCenter({ loggedInUser }) {
	const { conversationId } = useParams();
	const initialConversationId = conversationId ? Number(conversationId) : null;

	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);

	useEffect(() => {
		fetchConversations();
	}, []);

	useEffect(() => {
		if (initialConversationId !== null && conversations.length > 0) {
			const convo = conversations.find((c) => c.id === initialConversationId);
			if (convo) setSelectedConversation(convo);
		}
	}, [initialConversationId, conversations]);

	useEffect(() => {
		if (selectedConversation) {
			fetchMessages(selectedConversation.id);
		}
	}, [selectedConversation]);

	const fetchConversations = async () => {
		try {
			const res = await fetch('http://localhost:8080/api/messages/conversations', {
				headers: { Authorization: loggedInUser.jwt },
			});
			if (res.ok) {
				const data = await res.json();
				setConversations(data);
			}
		} catch (err) {
			console.error('Error fetching conversations:', err);
		}
	};

	const fetchMessages = async (convId) => {
		setLoading(true);
		try {
			const res = await fetch(`http://localhost:8080/api/messages/conversations/${convId}`, {
				headers: { Authorization: loggedInUser.jwt },
			});
			if (res.ok) {
				const msgs = await res.json();
				setMessages(msgs);
			}
		} catch (err) {
			console.error('Error fetching messages:', err);
		} finally {
			setLoading(false);
		}
	};

	const sendMessage = async () => {
		if (!newMessage.trim() || !selectedConversation) return;

		setSendingMessage(true);
		try {
			const otherUserId = selectedConversation.otherUserId;
			const res = await fetch(`http://localhost:8080/api/messages/send/${otherUserId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser.jwt,
				},
				body: JSON.stringify({ body: newMessage }),
			});
			if (res.ok) {
				setNewMessage('');
				fetchMessages(selectedConversation.id);
				fetchConversations();
			}
		} catch (err) {
			console.error('Error sending message:', err);
		} finally {
			setSendingMessage(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};
	const handleDeleteConversation = async (conversationId) => {
		try {
			const res = await fetch(
				`http://localhost:8080/api/messages/conversations/${conversationId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: loggedInUser.jwt,
					},
				}
			);

			if (res.status === 204) {
				// removed successfully → update local state
				setConversations((prev) => prev.filter((c) => c.id !== conversationId));
				// clear the view if you had it selected
				if (selectedConversation?.id === conversationId) {
					setSelectedConversation(null);
				}
			} else if (res.status === 404) {
				console.warn('Conversation not found or already deleted');
			} else if (res.status === 401) {
				console.error('Not authorized');
			} else {
				console.error('Failed to delete conversation', await res.text());
			}
		} catch (error) {
			console.error('Error deleting conversation:', error);
		}
	};

	return (
		<Flex h='80vh' bg='white' borderRadius='lg' overflow='hidden' boxShadow='lg'>
			{/* Left Sidebar - Conversations */}
			<Box w='300px' borderRight='1px solid' borderColor='gray.200'>
				<Box p={4} borderBottom='1px solid' borderColor='gray.200'>
					<Text fontSize='lg' fontWeight='600'>
						Messages
					</Text>
				</Box>
				<Box overflowY='auto' h='calc(100% - 65px)'>
					{conversations.length > 0 ? (
						conversations.map((convo) => (
							<ConversationItem
								key={convo.id}
								conversation={convo}
								isSelected={selectedConversation?.id === convo.id}
								onClick={() => setSelectedConversation(convo)}
								onDelete={() => handleDeleteConversation(convo.id)}
							/>
						))
					) : (
						<Box p={4} textAlign='center'>
							<Text color='gray.500' fontSize='sm'>
								No conversations yet
							</Text>
						</Box>
					)}
				</Box>
			</Box>

			{/* Right Side - Chat box */}
			<Flex direction='column' flex={1}>
				{selectedConversation ? (
					<>
						{/* Header */}
						<Box p={4} borderBottom='1px solid' borderColor='gray.200'>
							<HStack spacing={3}>
								<Avatar.Root size='sm'>
									<Avatar.Image src={selectedConversation.otherUserImage} />
									<Avatar.Fallback name={selectedConversation.otherUsername || 'Deleted User'} />
								</Avatar.Root>
								<Text fontSize='md' fontWeight='600'>
									{selectedConversation.otherUsername}
								</Text>
							</HStack>
						</Box>

						{/* Messages */}
						<Box flex={1} p={4} overflowY='auto' bg='gray.50'>
							{loading ? (
								<Text textAlign='center' color='gray.500'>
									Loading messages...
								</Text>
							) : messages.length > 0 ? (
								messages.map((msg) => (
									<MessageBubble
										key={msg.id}
										message={msg}
										isOwnMessage={msg.senderId === loggedInUser.id}
									/>
								))
							) : (
								<Text textAlign='center' color='gray.500'>
									No messages yet. Send the first message!
								</Text>
							)}
						</Box>

						{/* Input */}
						<Box p={4} borderTop='1px solid' borderColor='gray.200' bg='white'>
							<HStack spacing={2}>
								<Textarea
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									onKeyDown={handleKeyPress}
									placeholder='Type a message...'
									resize='none'
									rows={1}
									bg='gray.50'
									border='1px solid'
									borderColor='gray.300'
									borderRadius='20px'
									px={4}
									py={2}
									_focus={{
										borderColor: 'blue.400',
										boxShadow: '0 0 0 1px blue.400',
									}}
								/>
								<IconButton
									onClick={sendMessage}
									isDisabled={!newMessage.trim() || sendingMessage}
									colorScheme='blue'
									borderRadius='full'
									size='md'
									aria-label='Send message'
								>
									<FaPaperPlane />
								</IconButton>
							</HStack>
						</Box>
					</>
				) : (
					<Flex direction='column' align='center' justify='center' flex={1} bg='gray.50'>
						<Text fontSize='lg' color='gray.500' mb={2}>
							Select a conversation to start messaging
						</Text>
						<Text fontSize='sm' color='gray.400'>
							Choose a conversation from the list to view messages
						</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
}
