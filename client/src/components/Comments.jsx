import { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Avatar, Textarea, Button } from '@chakra-ui/react';

export default function Comments({
	post,
	showComments,
	loggedInUser,
	profileUser,
	onCommentsCountChange,
}) {
	const [newComment, setNewComment] = useState('');
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (showComments && post.id) {
			fetchComments();
		}
	}, [showComments, post.id]);

	useEffect(() => {
		if (onCommentsCountChange) {
			onCommentsCountChange(comments.length);
		}
	}, [comments.length, onCommentsCountChange]);

	const fetchComments = async () => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:8080/api/comments/${post.id}`, {
				headers: {
					Authorization: loggedInUser?.jwt,
				},
			});

			if (response.ok) {
				const commentsData = await response.json();
				console.log('Comments with author info:', commentsData);
				setComments(commentsData);
			} else {
				console.error('Failed to fetch comments');
			}
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		setSubmitting(true); // Start loading
		try {
			const response = await fetch(`http://localhost:8080/api/comments/${post.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser?.jwt,
				},
				body: JSON.stringify({
					userId: loggedInUser.id,
					bandId: null,
					body: newComment,
				}),
			});

			if (response.ok) {
				setNewComment('');
				fetchComments();
			} else {
				const errorText = await response.text();
				console.error('Failed to add comment:', errorText);
			}
		} catch (error) {
			console.error('Error adding comment:', error);
		} finally {
			setSubmitting(false);
		}
	};

	if (!showComments) return null;

	const getTimeAgo = (dateString) => {
		const now = new Date();
		const commentDate = new Date(dateString);
		const diffInMs = now - commentDate;

		const minutes = Math.floor(diffInMs / (1000 * 60));
		const hours = Math.floor(diffInMs / (1000 * 60 * 60));
		const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;

		return commentDate.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<Box borderTop='2px solid' borderColor='gray.100' bg='gray.50' p={4}>
			{/* Add Comment */}
			<VStack spacing={3} align='stretch'>
				<HStack spacing={3}>
					<Avatar.Root size='sm'>
						<Avatar.Image src={profileUser?.profileImgUrl} />
						<Avatar.Fallback name={profileUser?.username || 'Current User'} />
					</Avatar.Root>
					<Textarea
						placeholder='Write a comment...'
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						resize='none'
						rows={2}
						bg='white'
						border='1px solid'
						borderColor='gray.200'
						borderRadius='8px'
						fontSize='sm'
						_focus={{
							borderColor: 'orange.400',
							boxShadow: '0 0 0 1px orange.400',
						}}
					/>
					<Button
						size='sm'
						colorPalette='orange'
						variant='solid'
						onClick={handleAddComment}
						isDisabled={!newComment.trim()}
					>
						Post
					</Button>
				</HStack>

				{/* Comments List */}
				{loading ? (
					<Text fontSize='sm' color='gray.500' textAlign='center'>
						Loading comments...
					</Text>
				) : comments.length > 0 ? (
					<VStack spacing={3} align='stretch' mt={3}>
						{comments.map((comment) => (
							<HStack key={comment.id} align='start' spacing={3}>
								<Avatar.Root size='sm'>
									<Avatar.Image src={comment.authorImageUrl || ''} />
									<Avatar.Fallback name={comment.authorName || 'User'} />
								</Avatar.Root>
								<VStack
									align='start'
									spacing={1}
									flex={1}
									pb={3}
									borderBottom='1px solid'
									borderColor='gray.200'
								>
									<HStack spacing={2} width='100%' justify='space-between'>
										<Text fontSize='sm' fontWeight='600' color='gray.700'>
											{comment.authorName}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											{getTimeAgo(comment.createdAt)}
										</Text>
									</HStack>
									<Text fontSize='sm' color='gray.800'>
										{comment.body}
									</Text>
								</VStack>
							</HStack>
						))}
					</VStack>
				) : (
					<Text fontSize='sm' color='gray.500' textAlign='center' mt={3}>
						No comments yet. Be the first to comment!
					</Text>
				)}
			</VStack>
		</Box>
	);
}
